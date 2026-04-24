import { Story } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Copy, Check, Heart, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/AuthContext';
import { db, handleFirestoreError } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';

interface DonationDialogProps {
  story: Story | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DonationDialog({ story, open, onOpenChange }: DonationDialogProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<'pix' | 'confirm'>('pix');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!story) return null;

  const copyPix = () => {
    navigator.clipboard.writeText(story.pixKey);
    setCopied(true);
    toast.success("Chave Pix copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmDonation = async () => {
    if (!user || !amount) return;
    
    setLoading(true);
    try {
      const amountNum = Number(amount);
      const donationData = {
        storyId: story.id,
        donorId: user.uid,
        donorName: user.displayName || 'Doador Anônimo',
        amount: amountNum,
        timestamp: serverTimestamp(),
        isPublic: true,
      };

      // 1. Record in root donations
      await addDoc(collection(db, 'donations'), donationData);
      
      // 2. Record in subcollection
      await addDoc(collection(db, `stories/${story.id}/donations`), donationData);

      // 3. Update story raised amount
      await updateDoc(doc(db, 'stories', story.id), {
        raisedAmount: increment(amountNum),
        updatedAt: serverTimestamp()
      });

      toast.success("Doação registrada! Seu impacto já está no painel.");
      onOpenChange(false);
      setStep('pix');
      setAmount('');
    } catch (error) {
      console.error(error);
      handleFirestoreError(error, 'create', 'donations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => {
      onOpenChange(o);
      if (!o) setStep('pix');
    }}>
      <DialogContent className="sm:max-w-md glass-card rounded-[2.5rem] border-none p-0 overflow-hidden">
        {step === 'pix' ? (
          <>
            <div className="bg-gradient-to-br from-blue-600 to-blue-400 p-8 text-center text-white relative">
              <div className="relative z-10 space-y-4">
                <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-inner">
                  <Heart className="h-8 w-8 text-white fill-white" />
                </div>
                <div className="space-y-1">
                  <DialogTitle className="text-3xl font-black tracking-tighter">Apoie esta História</DialogTitle>
                  <DialogDescription className="text-white/80 font-bold text-xs uppercase tracking-widest">
                    Doação Direta e Transparente
                  </DialogDescription>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            </div>

            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <p className="text-center text-slate-500 font-medium leading-relaxed italic text-sm">
                  "Toda doação vai integralmente para <strong className="text-blue-600 font-black">{story.authorName}</strong> via Pix."
                </p>

                <div className="bg-slate-50/50 rounded-3xl p-6 border border-white space-y-4 shadow-inner">
                  <div className="w-full space-y-3">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] block px-1">Chave PIX do Destinatário</label>
                    <div className="flex gap-2">
                      <Input 
                        readOnly 
                        value={story.pixKey} 
                        className="bg-white border-2 border-white rounded-2xl font-mono text-sm shadow-sm h-12"
                      />
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={copyPix}
                        className="shrink-0 h-12 w-12 rounded-2xl bg-white border-white shadow-sm hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-blue-800 text-[10px] font-bold uppercase tracking-wider leading-relaxed">
                <ShieldCheck className="h-5 w-5 shrink-0 opacity-50" />
                <p>
                  Verifique o nome no seu banco antes de confirmar. 
                  O DoaçãoViva não retém valores.
                </p>
              </div>

              <Button 
                className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 h-16 font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100"
                onClick={() => setStep('confirm')}
              >
                Já fiz o Pix
              </Button>
            </div>
          </>
        ) : (
          <div className="p-8 space-y-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Confirmar Doação</h3>
              <p className="text-sm text-slate-500 font-medium">
                Informe o valor que você enviou para que possamos atualizar a meta e seu painel de impacto.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest block px-1">Quanto você doou?</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">R$</span>
                  <Input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00" 
                    className="pl-12 rounded-2xl bg-slate-50 border-white h-14 font-black text-xl tracking-tighter"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="outline"
                  className="flex-1 rounded-2xl h-14 font-bold border-slate-100"
                  onClick={() => setStep('pix')}
                >
                  Voltar
                </Button>
                <Button 
                  className="flex-[2] rounded-2xl bg-blue-600 hover:bg-blue-700 h-14 font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100"
                  onClick={handleConfirmDonation}
                  disabled={loading || !amount}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar e Salvar"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

