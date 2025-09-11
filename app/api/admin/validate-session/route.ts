import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "@/lib/supabase";
import { AdminUser } from "@/types/admin";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get("Authorization");
    
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Token não fornecido" },
        { status: 401 }
      );
    }

    const token = authorization.split(" ")[1];

    // Verificar e decodificar token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { message: "Token inválido" },
        { status: 401 }
      );
    }

    // Buscar usuário atualizado no banco
    const { data: adminUser, error } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, nome, role, created_at, updated_at")
      .eq("id", decoded.userId)
      .single();

    if (error || !adminUser) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 401 }
      );
    }

    const user: AdminUser = {
      id: adminUser.id,
      email: adminUser.email,
      nome: adminUser.nome,
      role: adminUser.role,
      created_at: adminUser.created_at,
      updated_at: adminUser.updated_at,
    };

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Erro na validação da sessão:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
