const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Variáveis de ambiente do Supabase não configuradas');
    console.log('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
    try {
        console.log('🔐 Criando usuário administrador...');

        // Obter dados da linha de comando ou usar padrão
        const args = process.argv.slice(2);
        const email = args[0] || 'admin@corrida.com';
        const password = args[1] || 'admin123456';
        const nome = args[2] || 'Administrador';
        const role = args[3] || 'super_admin';

        // Dados do admin
        const adminData = {
            email: email,
            password: password,
            nome: nome,
            role: role
        };

        // Hash da senha
        const passwordHash = await bcrypt.hash(adminData.password, 12);

        // Verificar se já existe
        const { data: existingUser } = await supabase
            .from('admin_users')
            .select('id')
            .eq('email', adminData.email)
            .single();

        if (existingUser) {
            console.log('⚠️  Usuário admin já existe!');
            console.log(`📧 Email: ${adminData.email}`);
            return;
        }

        // Criar usuário
        const { data, error } = await supabase
            .from('admin_users')
            .insert([
                {
                    email: adminData.email,
                    password_hash: passwordHash,
                    nome: adminData.nome,
                    role: adminData.role,
                }
            ])
            .select()
            .single();

        if (error) {
            throw error;
        }

        console.log('✅ Usuário administrador criado com sucesso!');
        console.log(`📧 Email: ${adminData.email}`);
        console.log(`🔑 Senha: ${adminData.password}`);
        console.log(`👤 Nome: ${adminData.nome}`);
        console.log(`🏷️  Role: ${adminData.role}`);
        console.log('');
        console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
        console.log('🌐 Acesse: http://localhost:3000/admin/login');

    } catch (error) {
        console.error('❌ Erro ao criar usuário admin:', error.message);
        process.exit(1);
    }
}

createAdminUser();