import { useState, useEffect } from "react";

interface AdminStats {
  total: number;
  confirmados: number;
  pendentes: number;
  canceladas: number;
}

interface UseAdminStatsReturn {
  stats: AdminStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAdminStats(): UseAdminStatsReturn {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = JSON.parse(localStorage.getItem("admin_session") || "{}").token;
      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      const response = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar estatísticas");
      }

      if (data.success) {
        setStats(data.data);
      } else {
        throw new Error(data.error || "Erro desconhecido");
      }
    } catch (err) {
      console.error("Erro ao buscar estatísticas:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
