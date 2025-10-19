import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { supabaseAdmin } from "@/lib/supabase";
import { AdminUser, AdminSession } from "@/types/admin";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email e senha são obrigatórios" },
        { status: 400 },
      );
    }

    // Buscar usuário no banco
    const { data: adminUser, error } = await supabaseAdmin
      .from("admin_users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (error || !adminUser) {
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(
      password,
      adminUser.password_hash,
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    // Gerar token JWT
    const token = jwt.sign(
      {
        userId: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Preparar dados do usuário (sem senha)
    const user: AdminUser = {
      id: adminUser.id,
      email: adminUser.email,
      nome: adminUser.nome,
      role: adminUser.role,
      created_at: adminUser.created_at,
      updated_at: adminUser.updated_at,
    };

    // Preparar sessão
    const session: AdminSession = {
      user,
      token,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
    };

    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
