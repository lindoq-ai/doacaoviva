import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { Donation, Story } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, TrendingUp, Calendar, ArrowRight, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function ImpactDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stories, setStories] = useState<Record<string, Story>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'donations'),
      where('donorId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const donationData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Donation));
      setDonations(donationData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Derived metrics
  const totalDonated = donations.reduce((acc, d) => acc + d.amount, 0);
  const causesSupported = new Set(donations.map(d => d.storyId)).size;

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Seu Impacto do Bem</h2>
        <p className="text-slate-500 font-medium italic">Você está transformando vidas, uma doação de cada vez.</p>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-none rounded-3xl shadow-lg relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Dodo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">R$ {totalDonated.toLocaleString('pt-BR')}</span>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 opacity-50"></div>
        </Card>

        <Card className="glass-card border-none rounded-3xl shadow-lg relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Causas Apoiadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">{causesSupported}</span>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -mr-12 -mt-12 opacity-50"></div>
        </Card>

        <Card className="glass-card border-none rounded-3xl shadow-lg relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nível do Bem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">
                {totalDonated > 500 ? 'Anjo' : totalDonated > 100 ? 'Mentor' : 'Amigo'}
              </span>
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                <Star className="h-6 w-6 fill-current" />
              </div>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -mr-12 -mt-12 opacity-50"></div>
        </Card>
      </div>

      {/* History Table-ish */}
      <div className="space-y-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Histórico de Atos Generosos</h3>
        
        {donations.length === 0 ? (
          <div className="p-12 text-center glass-card rounded-[2rem]">
            <p className="text-slate-500 font-bold">Você ainda não registrou doações. Comece apoiando uma história!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 rounded-3xl border-white/60 flex items-center justify-between group hover:bg-white/60 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 font-black">
                    $
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 tracking-tight">Doação para Causas do Bem</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {donation.timestamp?.seconds ? format(new Date(donation.timestamp.seconds * 1000), "dd 'de' MMM", { locale: ptBR }) : 'Recentemente'}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{donation.isPublic ? 'Pública' : 'Privada'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <span className="text-2xl font-black text-slate-800 tracking-tighter">R$ {donation.amount}</span>
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Impact Story (Static/Placeholder for now as per blueprint) */}
      <div className="glass-card p-10 rounded-[3rem] border-white/80 bg-gradient-to-br from-white/40 to-blue-50/40 relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <Badge className="bg-blue-600 text-white border-none px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest">Update de Impacto</Badge>
          <h3 className="text-3xl font-black text-slate-800 leading-tight tracking-tighter max-w-lg">
            "Graças a vocês, conseguimos comprar as cestas básicas deste mês."
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-200 rounded-2xl overflow-hidden border-2 border-white">
               <div className="w-full h-full bg-blue-100 flex items-center justify-center text-xl">🍲</div>
            </div>
            <div>
              <p className="font-black text-slate-800 text-sm">Cozinha Solidária</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fortaleza, CE</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 p-12 opacity-10">
          <Users className="w-64 h-64 text-blue-600" />
        </div>
      </div>
    </div>
  );
}
