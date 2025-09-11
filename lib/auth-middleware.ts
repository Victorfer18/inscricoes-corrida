import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "@/lib/supabase";
import { AdminUser } from "@/types/admin";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthenticatedRequest extends NextRequest {
  user?: AdminUser;
}

export async function authenticateAdmin(request: NextRequest): Promise<AdminUser | null> {
  try {
    const authorization = request.headers.get("Authorization");
    
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return null;
    }

    const token = authorization.split(" ")[1];

    // Verificar e decodificar token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }

    // Buscar usuário no banco
    const { data: adminUser, error } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, nome, role, created_at, updated_at")
      .eq("id", decoded.userId)
      .single();

    if (error || !adminUser) {
      return null;
    }

    return {
      id: adminUser.id,
      email: adminUser.email,
      nome: adminUser.nome,
      role: adminUser.role,
      created_at: adminUser.created_at,
      updated_at: adminUser.updated_at,
    };
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return null;
  }
}

export function requireAuth(handler: (request: NextRequest, user: AdminUser, context?: any) => Promise<Response>) {
  return async (request: NextRequest, context?: any) => {
    const user = await authenticateAdmin(request);
    
    if (!user) {
      return new Response(
        JSON.stringify({ message: "Acesso negado" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return handler(request, user, context);
  };
}
