import { useAuth } from '@/lib/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { db, handleFirestoreError } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface NewStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function NewStoryDialog({ open, onOpenChange, onSuccess }: NewStoryDialogProps) {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !profile) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const storyData = {
      title: formData.get('title'),
      content: formData.get('content'),
      pixKey: formData.get('pixKey'),
      category: formData.get('category'),
      targetAmount: Number(formData.get('targetAmount')),
      raisedAmount: 0,
      authorId: user.uid,
      authorName: profile.name,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      images: formData.get('imageUrl') ? [formData.get('imageUrl')] : []
    };
    
    try {
      await addDoc(collection(db, 'stories'), storyData);
      
      toast.success("História publicada com sucesso!");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      handleFirestoreError(error, 'create', 'stories');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass-card rounded-[2.5rem] border-none max-h-[90vh] overflow-y-auto p-0">
        <div className="p-8 bg-gradient-to-br from-blue-50 to-white">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-slate-800 tracking-tighter">Conte sua História</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">
              Sua voz importa. Compartilhe sua jornada e conecte-se com doadores diretos.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Título da sua causa</label>
            <Input name="title" placeholder="Ex: Precisamos de gás para a cozinha comunitária" required className="rounded-2xl border-white bg-slate-50/50 shadow-inner h-12 focus:ring-blue-600" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Sua história completa</label>
            <Textarea 
              name="content" 
              placeholder="Conte quem você é e do que precisa com detalhes..." 
              required 
              rows={5}
              className="rounded-2xl border-white bg-slate-50/50 shadow-inner resize-none p-4 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Chave PIX</label>
              <Input name="pixKey" placeholder="CPF ou E-mail" required className="rounded-2xl border-white bg-slate-50/50 shadow-inner h-12" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Categoria da Causa</label>
              <select 
                name="category" 
                required 
                className="w-full rounded-2xl border-white bg-slate-50/50 shadow-inner h-12 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-600 appearance-none"
              >
                <option value="emergency">Emergência</option>
                <option value="lgbt">LGBT+ (Orgulho & Apoio)</option>
                <option value="health">Saúde</option>
                <option value="food">Alimentação</option>
                <option value="education">Educação</option>
                <option value="housing">Moradia</option>
                <option value="others">Outros</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Meta R$ (Opcional)</label>
              <Input name="targetAmount" type="number" placeholder="0.00" className="rounded-2xl border-white bg-slate-50/50 shadow-inner h-12" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">URL da Imagem</label>
            <Input name="imageUrl" placeholder="https://..." className="rounded-2xl border-white bg-slate-50/50 shadow-inner h-12" />
          </div>

          <div className="pt-6">
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 h-16 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Publicar História"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
