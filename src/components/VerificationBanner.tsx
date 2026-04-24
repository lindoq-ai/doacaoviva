import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function VerificationBanner() {
  const { user, sendVerification, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);

  if (!user || user.emailVerified) return null;

  const handleResend = async () => {
    setLoading(true);
    try {
      await sendVerification();
      toast.success("E-mail de verificação enviado! Verifique seu spam.");
    } catch (error) {
      toast.error("Erro ao enviar. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshLoading(true);
    try {
      await refreshUser();
      if (user.emailVerified) {
        toast.success("E-mail verificado com sucesso!");
      } else {
        toast.info("Ainda não detectamos a verificação. Verifique seu e-mail.");
      }
    } catch (error) {
      toast.error("Erro ao atualizar status.");
    } finally {
      setRefreshLoading(false);
    }
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 p-3">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-amber-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-bold tracking-tight">
            Seu e-mail (<span className="underline">{user.email}</span>) ainda não foi verificado.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshLoading}
            className="text-amber-700 hover:bg-amber-100 font-bold text-[10px] uppercase tracking-widest gap-2"
          >
            <RefreshCw className={`h-3 w-3 ${refreshLoading ? 'animate-spin' : ''}`} />
            Já verifiquei
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResend}
            disabled={loading}
            className="bg-white border-amber-200 text-amber-700 hover:bg-amber-100 font-bold text-[10px] uppercase tracking-widest gap-2"
          >
            <Mail className="h-3 w-3" />
            {loading ? "Enviando..." : "Reenviar e-mail"}
          </Button>
        </div>
      </div>
    </div>
  );
}
