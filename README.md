# 🏃‍♀️ Sistema de Inscrições - Corrida Solidária Outubro Rosa

Sistema completo de gerenciamento de inscrições para corridas e eventos esportivos, com painel administrativo, sistema de sorteios e integração com Google Drive.

![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)

---

## 📖 Índice

1. [Visão Geral](#-visão-geral)
2. [Funcionalidades](#-funcionalidades)
3. [Tecnologias](#-tecnologias-utilizadas)
4. [Estrutura do Projeto](#-estrutura-do-projeto)
5. [Instalação](#-instalação)
6. [Configuração](#-configuração)
7. [Uso](#-uso)
8. [Painel Administrativo](#-painel-administrativo)
9. [Sistema de Sorteios](#-sistema-de-sorteios)
10. [API Endpoints](#-api-endpoints)
11. [Banco de Dados](#-banco-de-dados)
12. [Deploy](#-deploy)
13. [Documentação Adicional](#-documentação-adicional)

---

## 🎯 Visão Geral

Sistema desenvolvido para gerenciar inscrições de eventos esportivos de forma completa e profissional. Criado inicialmente para a **1ª Corrida Solidária Outubro Rosa**, pode ser facilmente adaptado para outros eventos.

### Principais Recursos

✅ **Inscrições Online**
- Formulário completo de inscrição
- Upload de comprovante de pagamento
- Validação de CPF único
- Email de confirmação automático

✅ **Sistema de Lotes**
- Preços progressivos
- Kits personalizados por lote
- Controle de vagas
- Requisitos especiais configuráveis

✅ **Painel Administrativo**
- Dashboard com estatísticas em tempo real
- Gerenciamento completo de inscrições
- Aprovação/rejeição de pagamentos
- Exportação em PDF, XLSX e CSV
- Sistema de permissões (Super Admin, Admin, Moderator)

✅ **Sistema de Sorteios**
- Sorteios por lote ou todos os inscritos
- Múltiplas rodadas
- Histórico completo
- Exportação de resultados em PDF

✅ **Integrações**
- Google Drive para armazenamento de comprovantes
- Nodemailer para envio de emails
- Supabase (PostgreSQL) como backend

✅ **Interface Moderna**
- Design responsivo (mobile-first)
- Tema claro/escuro
- Componentes HeroUI
- Animações suaves

---

## ⚡ Funcionalidades

### Para Participantes

- 📝 Formulário de inscrição intuitivo
- 💳 Instruções de pagamento PIX com QR Code
- 📤 Upload de comprovante (imagem ou PDF)
- 📧 Confirmação automática por email
- 🎽 Visualização do kit completo
- 📋 Acesso ao regulamento

### Para Administradores

- 📊 Dashboard com métricas em tempo real
- 👥 Lista completa de inscrições
- 🔍 Busca e filtros avançados
- ✅ Aprovar/rejeitar inscrições
- ✏️ Editar dados dos participantes
- 🔢 Atribuir números de camisa
- 👁️ Visualizar comprovantes
- 📥 Exportar dados (PDF/XLSX/CSV)
- 🎲 Realizar sorteios
- 📈 Relatórios e estatísticas

---

## 💻 Tecnologias Utilizadas

### Frontend
- **[Next.js 15.3.1](https://nextjs.org/)** - Framework React com App Router
- **[React 18.3.1](https://react.dev/)** - Biblioteca para interfaces
- **[TypeScript 5.6.3](https://www.typescriptlang.org/)** - Tipagem estática
- **[HeroUI v2](https://heroui.com/)** - Componentes UI modernos
- **[Tailwind CSS 4.1.11](https://tailwindcss.com/)** - Estilização utility-first
- **[Framer Motion](https://www.framer.com/motion/)** - Animações
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Tema claro/escuro
- **[Embla Carousel](https://www.embla-carousel.com/)** - Carrossel de imagens

### Backend & Infraestrutura
- **[Supabase](https://supabase.com/)** - Backend as a Service (PostgreSQL)
- **[Google Drive API](https://developers.google.com/drive)** - Armazenamento de arquivos
- **[Nodemailer](https://nodemailer.com/)** - Envio de emails
- **[JWT](https://jwt.io/)** - Autenticação segura
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Criptografia de senhas

### Bibliotecas Adicionais
- **[jsPDF](https://github.com/parallax/jsPDF)** & **jsPDF-AutoTable** - Geração de PDFs
- **[XLSX](https://www.npmjs.com/package/xlsx)** - Exportação de planilhas Excel
- **[Zod](https://zod.dev/)** - Validação de dados
- **[@heroicons/react](https://heroicons.com/)** - Ícones SVG

---

## 📂 Estrutura do Projeto

```
inscricoes-corrida-novo/
├── app/                           # App Router (Next.js 15)
│   ├── admin/                     # Área administrativa
│   │   ├── dashboard/             # Dashboard com estatísticas
│   │   ├── login/                 # Login administrativo
│   │   └── sorteios/              # Sistema de sorteios
│   │       ├── page.tsx           # Realizar sorteios
│   │       └── historico/         # Histórico de sorteios
│   ├── api/                       # API Routes
│   │   ├── admin/                 # Endpoints administrativos
│   │   │   ├── inscricoes/        # CRUD de inscrições
│   │   │   ├── sorteios/          # API de sorteios
│   │   │   ├── stats/             # Estatísticas
│   │   │   ├── export/            # Exportação (PDF/XLSX/CSV)
│   │   │   └── login/             # Autenticação
│   │   ├── files/                 # Upload e visualização
│   │   ├── inscricoes/            # Inscrições públicas
│   │   ├── lotes/                 # Gerenciamento de lotes
│   │   └── upload/                # Upload de arquivos
│   ├── inscricao/                 # Página pública de inscrição
│   ├── regulamento/               # Regulamento do evento
│   └── page.tsx                   # Homepage
│
├── components/                    # Componentes React
│   ├── admin/                     # Componentes administrativos
│   │   ├── admin-header.tsx       # Cabeçalho padrão
│   │   ├── admin-page-layout.tsx  # Layout padrão
│   │   ├── admin-nav-buttons.tsx  # Navegação contextual
│   │   ├── inscricoes-table.tsx   # Tabela de inscrições
│   │   └── comprovante-viewer.tsx # Visualizador de comprovantes
│   ├── formulario-inscricao.tsx   # Formulário de inscrição
│   ├── pix-component.tsx          # Informações PIX
│   ├── kit-showcase.tsx           # Exibição do kit
│   ├── navbar.tsx                 # Barra de navegação
│   └── theme-switch.tsx           # Alternador de tema
│
├── config/                        # Configurações
│   ├── event.ts                   # Dados do evento
│   ├── lotes.ts                   # Sistema de lotes e kits
│   ├── site.ts                    # Metadados
│   └── fonts.ts                   # Fontes
│
├── hooks/                         # React Hooks customizados
│   ├── useAuth.ts                 # Hook de autenticação
│   ├── useInscricao.ts            # Hook de inscrição
│   ├── useAdminStats.ts           # Hook de estatísticas
│   ├── useLoteVigente.ts          # Hook do lote vigente
│   └── useDebounce.ts             # Hook de debounce
│
├── lib/                           # Bibliotecas e utilitários
│   ├── services/                  # Serviços externos
│   │   ├── google-drive.ts        # Integração Google Drive
│   │   ├── email-service.ts       # Serviço de email
│   │   └── file-storage.ts        # Armazenamento
│   ├── supabase.ts                # Cliente Supabase
│   ├── auth-middleware.ts         # Middleware de auth
│   ├── validations.ts             # Validações Zod
│   └── utils.ts                   # Funções utilitárias
│
├── types/                         # Tipos TypeScript
│   ├── database.ts                # Tipos do banco
│   ├── admin.ts                   # Tipos admin
│   ├── inscricao.ts               # Tipos de inscrição
│   ├── sorteio.ts                 # Tipos de sorteio
│   └── index.ts                   # Exportações
│
├── public/                        # Arquivos estáticos
│   ├── imagens/                   # Imagens do evento
│   └── kit/                       # Imagens do kit
│
└── docs/                          # Documentação
    └── CONFIGURACAO_SIMPLES.md    # Config. de lotes
```

---

## 🚀 Instalação

### Pré-requisitos

- **Node.js** 18 ou superior
- **npm** ou **yarn** ou **pnpm**
- Conta no **[Supabase](https://supabase.com/)**
- Conta no **[Google Cloud](https://console.cloud.google.com/)** (para Drive API)
- Email para SMTP (Gmail recomendado)

### Passo a Passo

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/inscricoes-corrida-novo.git
cd inscricoes-corrida-novo
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

# Google Drive API
GOOGLE_DRIVE_FOLDER_ID=id_da_pasta_no_drive
GOOGLE_CLIENT_EMAIL=seu-service-account@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Email (Nodemailer - Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu.email@gmail.com
EMAIL_PASS=senha_de_aplicativo_do_gmail
EMAIL_FROM=noreply@seuevent.com

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aleatoria

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Execute o projeto**

```bash
# Desenvolvimento
npm run dev

# Acesse http://localhost:3000
```

---

## ⚙️ Configuração

### 1. Configurar Supabase

**Criar projeto e tabelas:**

```sql
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.
-- ========================================
-- 1. EVENTOS (CONFIG + BASE)
-- ========================================

CREATE TABLE IF NOT EXISTS public.eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR NOT NULL,
  descricao TEXT,
  data_evento DATE,
  local TEXT,

  -- ENUM STATUS
  status VARCHAR DEFAULT 'ativo',

  -- CONFIGURAÇÃO VISUAL (UI DINÂMICA)
  config JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================
-- 2. LOTES (ADICIONAR COLUNAS)
-- ========================================

ALTER TABLE public.lotes
ADD COLUMN IF NOT EXISTS evento_id uuid,
ADD COLUMN IF NOT EXISTS descricao TEXT,
ADD COLUMN IF NOT EXISTS data_inicio TIMESTAMP,
ADD COLUMN IF NOT EXISTS data_fim TIMESTAMP,
ADD COLUMN IF NOT EXISTS limite_por_pessoa INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS vendas_ativas BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS kit_id uuid;

-- FK evento → lotes
ALTER TABLE public.lotes
ADD CONSTRAINT IF NOT EXISTS lotes_evento_fkey
FOREIGN KEY (evento_id)
REFERENCES public.eventos(id)
ON DELETE CASCADE;

-- ========================================
-- 3. ITENS (KIT ITEMS)
-- ========================================

CREATE TABLE IF NOT EXISTS public.itens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR NOT NULL,
  descricao TEXT,
  imagem_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- ========================================
-- 4. KITS
-- ========================================

CREATE TABLE IF NOT EXISTS public.kits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- ========================================
-- 5. RELAÇÃO KIT → ITENS (N:N)
-- ========================================

CREATE TABLE IF NOT EXISTS public.kit_itens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_id uuid NOT NULL,
  item_id uuid NOT NULL,
  quantidade INTEGER DEFAULT 1,

  CONSTRAINT fk_kit FOREIGN KEY (kit_id) REFERENCES public.kits(id) ON DELETE CASCADE,
  CONSTRAINT fk_item FOREIGN KEY (item_id) REFERENCES public.itens(id) ON DELETE CASCADE
);

-- FK lote → kit
ALTER TABLE public.lotes
ADD CONSTRAINT IF NOT EXISTS lotes_kit_fkey
FOREIGN KEY (kit_id)
REFERENCES public.kits(id);

-- ========================================
-- 6. PREMIOS (🏆 NOVO)
-- ========================================

CREATE TABLE IF NOT EXISTS public.premios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id uuid NOT NULL,
  posicao INTEGER NOT NULL,
  titulo VARCHAR,
  valor NUMERIC,
  descricao TEXT,
  cor VARCHAR,
  icone VARCHAR,
  created_at TIMESTAMP DEFAULT now(),

  CONSTRAINT premios_evento_fkey
  FOREIGN KEY (evento_id)
  REFERENCES public.eventos(id)
  ON DELETE CASCADE
);

-- ========================================
-- 7. GARANTIR PKs (caso falte)
-- ========================================

ALTER TABLE public.inscricoes
ADD CONSTRAINT IF NOT EXISTS inscricoes_pkey PRIMARY KEY (id);

ALTER TABLE public.sorteios
ADD CONSTRAINT IF NOT EXISTS sorteios_pkey PRIMARY KEY (id);

ALTER TABLE public.sorteio_participantes
ADD CONSTRAINT IF NOT EXISTS sorteio_participantes_pkey PRIMARY KEY (id);

-- ========================================
-- 8. RELAÇÕES IMPORTANTES
-- ========================================

-- inscrição → lote
ALTER TABLE public.inscricoes
ADD CONSTRAINT IF NOT EXISTS inscricoes_lote_id_fkey
FOREIGN KEY (lote_id)
REFERENCES public.lotes(id);

-- sorteio_participantes → sorteios
ALTER TABLE public.sorteio_participantes
ADD CONSTRAINT IF NOT EXISTS sp_sorteio_fkey
FOREIGN KEY (sorteio_id)
REFERENCES public.sorteios(id);

-- sorteio_participantes → inscricoes
ALTER TABLE public.sorteio_participantes
ADD CONSTRAINT IF NOT EXISTS sp_inscricao_fkey
FOREIGN KEY (inscricao_id)
REFERENCES public.inscricoes(id);

-- Índices para performance
CREATE INDEX idx_inscricoes_cpf ON inscricoes(cpf);
CREATE INDEX idx_inscricoes_status ON inscricoes(status);
CREATE INDEX idx_inscricoes_lote_id ON inscricoes(lote_id);
CREATE INDEX idx_sorteios_lote_id ON sorteios(lote_id);
```

**Inserir dados iniciais:**

```sql
-- Inserir lotes
INSERT INTO lotes (nome, valor, total_vagas, status) VALUES
  ('1º Lote', 79.90, 100, true),
  ('2º Lote', 89.90, 150, false),
  ('3º Lote', 99.90, 200, false);
```

### 2. Configurar Google Drive API

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Ative a **Google Drive API**
4. Crie uma **Service Account**
5. Baixe a chave JSON da Service Account
6. Crie uma pasta no Google Drive
7. Compartilhe a pasta com o email da Service Account (editor)
8. Copie o ID da pasta (último segmento da URL)
9. Configure as variáveis no `.env.local`

### 3. Configurar Email (Gmail)

1. Acesse sua conta Google
2. Ative a **verificação em 2 etapas**
3. Gere uma **senha de aplicativo**:
   - Configurações → Segurança → Senhas de app
   - Selecione "Email" e "Outro"
4. Use essa senha em `EMAIL_PASS`

### 4. Criar Usuário Admin

```bash
npm run create-admin
```

Ou direto no banco:

```sql
-- Senha: admin123 (hash bcrypt)
INSERT INTO admin_users (email, nome, password_hash, role)
VALUES (
  'admin@example.com',
  'Administrador',
  '$2a$10$exemplo.hash.bcrypt',
  'super_admin'
);
```

### 5. Configurar Evento

Edite `config/event.ts`:

```typescript
export const eventConfig = {
  inscricoesAbertas: true,          // true = aceita inscrições
  local: "NS2 AO LADO DA QUADRA POLIESPORTIVA",
  dataEvento: "26 de Outubro de 2025",
  horarioConcentracao: "06h00",
  horarioCaminhada: "07h00",
  horarioCorrida: "07h30",
  mostrarBotaoInscricao: true,
  mostrarProgressoInscricoes: true,
  mostrarInformacoesEvento: true,
};
```

### 6. Configurar Sistema de Lotes

Veja documentação detalhada em: **[docs/CONFIGURACAO_SIMPLES.md](docs/CONFIGURACAO_SIMPLES.md)**

---

## 📖 Uso

### Para Participantes

1. Acesse a página inicial
2. Clique em "Inscrever-se"
3. Preencha o formulário com seus dados
4. Realize o pagamento via PIX
5. Faça upload do comprovante
6. Aguarde aprovação (receberá email)

### Para Administradores

1. Acesse `/admin/login`
2. Faça login com suas credenciais
3. Dashboard mostra todas as estatísticas
4. Gerencie inscrições, aprove pagamentos
5. Realize sorteios
6. Exporte relatórios

---

## 🛡️ Painel Administrativo

### Dashboard (`/admin/dashboard`)

**Estatísticas em Tempo Real:**
- 📊 Total de inscrições
- ✅ Inscrições confirmadas
- ⏳ Pendentes de aprovação
- ❌ Canceladas
- 💰 Receita confirmada e esperada
- 📈 Gráficos por lote e status

**Funcionalidades:**
- 🔍 Busca por nome, CPF ou email
- 🔽 Filtros por status e lote
- 📄 Exportação (PDF, XLSX, CSV)
- 👁️ Visualizar comprovantes
- ✏️ Editar inscrições
- ✅ Aprovar/Rejeitar
- 🔢 Atribuir números de camisa

### Níveis de Acesso

#### Super Admin
- ✅ Editar inscrições
- ✅ Deletar inscrições
- ✅ Exportar dados
- ✅ Gerenciar usuários
- ✅ Gerenciar lotes

#### Admin
- ✅ Editar inscrições
- ❌ Deletar inscrições
- ✅ Exportar dados
- ❌ Gerenciar usuários
- ✅ Gerenciar lotes

#### Moderator
- ✅ Editar inscrições
- ❌ Deletar inscrições
- ❌ Exportar dados
- ❌ Gerenciar usuários
- ❌ Gerenciar lotes

---

## 🎲 Sistema de Sorteios

### Realizar Sorteio (`/admin/sorteios`)

**Como funciona:**

1. **Selecionar participantes:**
   - Por lote específico (ex: "1º Lote")
   - Todos os lotes (todos os confirmados)

2. **Buscar inscritos confirmados**

3. **Sortear em rodadas:**
   - Define quantidade a sortear
   - Sistema remove sorteados da lista
   - Pode fazer várias rodadas

4. **Finalizar:**
   - Define título e descrição
   - Salva no banco de dados
   - Exporta resultado em PDF

**Exemplo prático:**
```
1. Selecionar "1º Lote" (50 inscritos)
2. Sortear 5 pessoas → Rodada 1
3. Sortear 3 pessoas → Rodada 2
4. Sortear 2 pessoas → Rodada 3
5. Finalizar: "Sorteio de Kits VIP"
```

### Histórico (`/admin/sorteios/historico`)

- 📋 Lista todos os sorteios realizados
- 🔍 Busca por título/descrição
- 🔽 Filtro por lote e status
- 👁️ Ver detalhes completos
- 📊 Exportar em PDF
- ❌ Cancelar sorteio

**PDF de Sorteio inclui:**
- Título e descrição
- Informações do lote
- Lista de sorteados por rodada
- Nome, CPF e email
- Data e responsável

---

## 🔌 API Endpoints

### Públicos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/inscricoes` | Criar inscrição |
| `POST` | `/api/upload` | Upload de arquivo |
| `GET` | `/api/lotes` | Listar lotes disponíveis |
| `GET` | `/api/files/[fileId]` | Baixar arquivo |
| `GET` | `/api/files/[fileId]/view` | Visualizar arquivo |

### Administrativos (requerem autenticação)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/admin/login` | Login admin |
| `GET` | `/api/admin/validate-session` | Validar sessão |
| `GET` | `/api/admin/inscricoes` | Listar inscrições |
| `GET` | `/api/admin/inscricoes/[id]` | Detalhes inscrição |
| `PATCH` | `/api/admin/inscricoes/[id]` | Atualizar inscrição |
| `DELETE` | `/api/admin/inscricoes/[id]` | Deletar inscrição |
| `GET` | `/api/admin/stats` | Estatísticas |
| `GET` | `/api/admin/export` | Exportar dados |
| `POST` | `/api/admin/sorteios` | Criar sorteio |
| `GET` | `/api/admin/sorteios` | Listar sorteios |
| `GET` | `/api/admin/sorteios/[id]` | Detalhes sorteio |
| `DELETE` | `/api/admin/sorteios/[id]` | Cancelar sorteio |
| `GET` | `/api/admin/sorteios/inscricoes-confirmadas` | Inscritos para sorteio |

### Exemplo de Requisição

```bash
# Criar inscrição
curl -X POST http://localhost:3000/api/inscricoes \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "João Silva",
    "cpf": "12345678900",
    "idade": 30,
    "sexo": "Masculino",
    "celular": "11999999999",
    "email": "joao@email.com",
    "tamanho_blusa": "M",
    "comprovante_file_id": "file-id-123",
    "lote_id": "uuid-do-lote"
  }'
```

---

## 💾 Banco de Dados

### Schema Completo

```
lotes
├── id (UUID, PK)
├── nome (VARCHAR)
├── valor (DECIMAL)
├── total_vagas (INTEGER)
├── status (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

inscricoes
├── id (UUID, PK)
├── nome_completo (VARCHAR)
├── cpf (VARCHAR, UNIQUE)
├── idade (INTEGER)
├── sexo (VARCHAR)
├── celular (VARCHAR)
├── email (VARCHAR)
├── tamanho_blusa (VARCHAR)
├── comprovante_file_id (VARCHAR)
├── lote_id (UUID, FK → lotes)
├── status (VARCHAR)
├── number_shirt (VARCHAR)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

admin_users
├── id (UUID, PK)
├── email (VARCHAR, UNIQUE)
├── nome (VARCHAR)
├── password_hash (TEXT)
├── role (VARCHAR)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

sorteios
├── id (UUID, PK)
├── titulo (VARCHAR)
├── descricao (TEXT)
├── lote_id (UUID, FK → lotes)
├── lote_nome (VARCHAR)
├── total_inscritos (INTEGER)
├── total_sorteados (INTEGER)
├── realizado_por (UUID, FK → admin_users)
├── realizado_por_nome (VARCHAR)
├── status (VARCHAR)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

sorteio_participantes
├── id (UUID, PK)
├── sorteio_id (UUID, FK → sorteios)
├── inscricao_id (UUID, FK → inscricoes)
├── rodada (INTEGER)
└── created_at (TIMESTAMP)
```

---

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conecte seu repositório**
   - Acesse [vercel.com](https://vercel.com)
   - Importe seu repositório

2. **Configure variáveis de ambiente**
   - Adicione todas as variáveis do `.env.local`

3. **Deploy**
   - Vercel faz build e deploy automaticamente

### Build Manual

```bash
# Build de produção
npm run build

# Iniciar servidor
npm start
```

### Checklist de Deploy

- [ ] Banco de dados criado e configurado
- [ ] Tabelas criadas no Supabase
- [ ] Google Drive API configurada
- [ ] SMTP configurado para emails
- [ ] Variáveis de ambiente definidas
- [ ] Admin criado no banco
- [ ] Lotes inseridos na tabela
- [ ] Build executado sem erros
- [ ] Teste de inscrição funcionando
- [ ] Painel admin acessível
- [ ] Sistema de sorteios testado

---

## 🆘 Troubleshooting

### Erro: "CPF já cadastrado"
**Solução:** Verificar se existe inscrição duplicada no banco.

```sql
SELECT * FROM inscricoes WHERE cpf = '12345678900';
```

### Erro: "Failed to upload file"
**Possíveis causas:**
- Service Account sem permissão na pasta
- ID da pasta incorreto
- Chave privada mal formatada
- Tamanho do arquivo muito grande

### Erro: "Unauthorized"
**Solução:** Token JWT expirado, fazer login novamente.

### Erro ao enviar email
**Solução:** 
- Verificar senha de aplicativo do Gmail
- Confirmar que 2FA está ativo
- Verificar configurações SMTP

---

## 📚 Documentação Adicional

- **[Configuração de Lotes](docs/CONFIGURACAO_SIMPLES.md)** - Sistema híbrido de lotes e kits
- **[Next.js Docs](https://nextjs.org/docs)** - Documentação oficial do Next.js
- **[HeroUI Docs](https://heroui.com/docs)** - Componentes HeroUI
- **[Supabase Docs](https://supabase.com/docs)** - Backend Supabase

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido para a **1ª Corrida Solidária Outubro Rosa** 🎀

---

## 🎉 Agradecimentos

- Comunidade Next.js
- Time do HeroUI
- Supabase
- Todos os participantes e organizadores da corrida

---

**⭐ Se este projeto foi útil, considere dar uma estrela no repositório!**
