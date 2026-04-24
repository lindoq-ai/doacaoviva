import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { StoryCard } from '@/components/StoryCard';
import { DonationDialog } from '@/components/DonationDialog';
import { NewStoryDialog } from '@/components/NewStoryDialog';
import { ImpactDashboard } from '@/components/ImpactDashboard';
import { VerificationBanner } from '@/components/VerificationBanner';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Story } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Users, Shield, Zap, Info } from 'lucide-react';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function RoleSelectionDialog({ open, onSelect }: { open: boolean, onSelect: (role: 'donor' | 'recipient') => void }) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md glass-card rounded-[2rem] border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center text-slate-800 tracking-tight">Como você quer usar o DoaçãoViva?</DialogTitle>
          <DialogDescription className="text-center font-medium text-slate-500">
            Escolha seu perfil para começar a transformar vidas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 pt-4">
          <Button 
            onClick={() => onSelect('donor')}
            className="h-28 rounded-3xl bg-white/60 border-2 border-white hover:border-blue-400 hover:bg-blue-50 text-slate-800 flex flex-col gap-1 transition-all shadow-sm"
          >
            <span className="text-2xl">💙</span>
            <span className="font-black text-lg tracking-tight">Quero Doar</span>
            <span className="text-[10px] text-blue-600 uppercase font-black tracking-widest">Apoiar pessoas</span>
          </Button>
          <Button 
            onClick={() => onSelect('recipient')}
            className="h-28 rounded-3xl bg-white/60 border-2 border-white hover:border-blue-400 hover:bg-blue-50 text-slate-800 flex flex-col gap-1 transition-all shadow-sm"
          >
            <span className="text-2xl">🤝</span>
            <span className="font-black text-lg tracking-tight">Preciso de Ajuda</span>
            <span className="text-[10px] text-blue-600 uppercase font-black tracking-widest">Receber apoio via Pix</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function App() {
  const { user, profile, loading, updateProfile } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [donationOpen, setDonationOpen] = useState(false);
  const [newStoryOpen, setNewStoryOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [view, setView] = useState<'home' | 'dashboard'>('home');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!loading && user && !profile) {
      setRoleDialogOpen(true);
    } else {
      setRoleDialogOpen(false);
    }
  }, [user, profile, loading]);

  useEffect(() => {
    const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story));
      setStories(data);
    });
  }, []);

  const handleRoleSelect = async (role: 'donor' | 'recipient') => {
    await updateProfile({ role, name: user?.displayName || 'Usuário' });
    setRoleDialogOpen(false);
  };

  const handleOpenDonate = (story: Story) => {
    setSelectedStory(story);
    setDonationOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Heart className="h-12 w-12 text-blue-600 animate-pulse fill-blue-600" />
          <p className="text-xl font-medium text-slate-800 opacity-60">Sintonizando o bem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Mesh Gradient Background Decorators */}
      <div className="fixed top-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="fixed bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-green-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 pointer-events-none"></div>

      <VerificationBanner />
      <Navbar 
        onNewStory={() => {
          if (!user?.emailVerified) {
            toast.error("Por favor, verifique seu e-mail para contar sua história.");
            return;
          }
          setNewStoryOpen(true);
        }} 
        onViewChange={setView} 
        currentView={view} 
      />
      
      <main className="container mx-auto px-4 py-20 relative z-10">
        {view === 'dashboard' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ImpactDashboard />
          </motion.div>
        ) : (
          <>
            {/* Hero Section */}
            <header className="mb-24 flex flex-col md:flex-row gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-left"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              Impacto Real e Direto
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
              Transforme vidas <br/> <span className="text-blue-600">sem intermediários.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed font-medium max-w-xl">
              Nossa plataforma conecta você diretamente a quem precisa. 
              Sua doação cai na conta do receptor via Pix instantaneamente, 
              garantindo que 100% da sua ajuda chegue ao destino final.
            </p>

            <div className="flex gap-4 items-center mt-12">
              <div className="glass shadow-sm p-5 rounded-3xl border-white/60">
                <p className="text-3xl font-black text-slate-900 tracking-tighter">12.4K+</p>
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Ajudados</p>
              </div>
              <div className="glass shadow-sm p-5 rounded-3xl border-white/60">
                <p className="text-3xl font-black text-slate-900 tracking-tighter">零 Taxas</p>
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">De Plataforma</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="hidden md:block w-96 h-96 bg-gradient-to-br from-blue-600 to-blue-400 rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center text-8xl grayscale opacity-20">💙</div>
            <div className="absolute inset-0 flex items-center justify-center text-7xl">💸</div>
          </motion.div>
        </header>

        {/* Stories Feed */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Necessidades Urgentes</h3>
            
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'lgbt', label: '🏳️🌈 LGBT+' },
                { id: 'emergency', label: '🚨 Urgente' },
                { id: 'health', label: '🏥 Saúde' },
                { id: 'food', label: '🍲 Alimento' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === cat.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-105' 
                      : 'bg-white/40 text-slate-400 hover:bg-white hover:text-blue-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[1px] w-full bg-slate-200/50"></div>

          <AnimatePresence mode="popLayout">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              layout
            >
              {stories.length === 0 ? (
                <div className="col-span-full py-20 text-center glass-card rounded-glass">
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-6">Nenhuma história no momento</p>
                  <Button onClick={() => setNewStoryOpen(true)} className="rounded-full bg-blue-600 px-8 py-6 shadow-lg shadow-blue-200">Começar uma história</Button>
                </div>
              ) : (
                stories
                  .filter(s => filter === 'all' || s.category === filter)
                  .map((story) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    layout
                  >
                    <StoryCard story={story} onDonate={handleOpenDonate} />
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </>
    )}
  </main>

      <footer className="mt-32 glass border-t-0 p-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">
          <div className="flex gap-8">
            <span>© 2024 DoaçãoViva</span>
            <span>Feito com 💙 por Lindomar</span>
          </div>
          <div className="flex gap-8 items-center">
            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Sistema Pix On-line</span>
            <span className="glass px-3 py-1 rounded-md bg-white/20">Licença MIT</span>
          </div>
        </div>
      </footer>

      <DonationDialog 
        story={selectedStory} 
        open={donationOpen} 
        onOpenChange={setDonationOpen} 
      />
      
      <NewStoryDialog 
        open={newStoryOpen} 
        onOpenChange={setNewStoryOpen} 
        onSuccess={() => {}}
      />

      <RoleSelectionDialog 
        open={roleDialogOpen} 
        onSelect={handleRoleSelect} 
      />

      <Toaster position="top-center" richColors />
    </div>
  );
}
