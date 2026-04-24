import { Story } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, MapPin, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StoryCardProps {
  story: Story;
  onDonate: (story: Story) => void;
}

export function StoryCard({ story, onDonate }: StoryCardProps) {
  const percentage = story.targetAmount 
    ? Math.min(Math.round((story.raisedAmount / story.targetAmount) * 100), 100) 
    : 0;

  const categoryLabels: Record<string, { label: string, color: string }> = {
    lgbt: { label: 'Pride & Apoio', color: 'bg-gradient-to-r from-red-200 via-yellow-200 to-purple-200 text-purple-800' },
    health: { label: 'Saúde', color: 'bg-blue-50 text-blue-700' },
    food: { label: 'Alimentação', color: 'bg-green-50 text-green-700' },
    education: { label: 'Educação', color: 'bg-orange-50 text-orange-700' },
    housing: { label: 'Moradia', color: 'bg-purple-50 text-purple-700' },
    emergency: { label: 'Urgente', color: 'bg-red-50 text-red-700' },
    others: { label: 'Impacto Social', color: 'bg-slate-50 text-slate-700' }
  };

  const cat = story.category ? categoryLabels[story.category] : categoryLabels.others;

  return (
    <Card className="glass-card rounded-[2.5rem] overflow-hidden border-none transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl">
      <div className="relative aspect-[4/3] w-full overflow-hidden p-3 pb-0">
        <img 
          src={story.images?.[0] || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000'} 
          alt={story.title}
          className="h-full w-full object-cover rounded-[2rem]"
        />
        <Badge className="absolute top-6 right-6 bg-white/80 backdrop-blur-md text-blue-600 border-none shadow-sm font-black text-[10px] uppercase tracking-widest px-3 py-1">
          Pix Direto
        </Badge>
      </div>

      <CardHeader className="space-y-2 px-8 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-blue-600 uppercase tracking-[0.15em] font-black">
            <MapPin className="h-3 w-3" />
            {story.authorName || 'Necessidade'}
          </div>
          <Badge className={`${cat.color} border-none text-[8px] font-black uppercase tracking-tight`}>
            {cat.label}
          </Badge>
        </div>
        <h3 className="text-2xl font-black text-slate-800 leading-tight tracking-tighter">
          {story.title}
        </h3>
      </CardHeader>

      <CardContent className="space-y-6 px-8 py-4">
        <p className="line-clamp-3 text-sm text-slate-500 leading-relaxed italic font-medium">
          "{story.content}"
        </p>

        {story.targetAmount && (
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Arrecadado</span>
                <span className="text-lg font-black text-slate-800 tracking-tighter">R$ {story.raisedAmount}</span>
              </div>
              <span className="text-xl font-black text-blue-600 tracking-tighter">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-2 bg-slate-100/50 rounded-full" />
            <p className="text-[9px] text-right text-slate-400 font-bold uppercase tracking-widest">
              Alvo: R$ {story.targetAmount}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-3 px-8 pb-8 pt-2">
        <Button 
          onClick={() => onDonate(story)}
          className="flex-1 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 gap-2 h-14 font-black uppercase text-xs tracking-[0.1em] shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <Heart className="h-4 w-4 fill-white" />
          Apoiar agora
        </Button>
        <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-white bg-white/40 backdrop-blur-md shadow-sm hover:bg-white transition-all">
          <Share2 className="h-4 w-4 text-slate-400" />
        </Button>
      </CardFooter>

      <div className="px-8 pb-6">
        <div className="h-[1px] w-full bg-slate-100/50 mb-4"></div>
        <p className="text-[9px] text-slate-400 text-center font-bold uppercase tracking-[0.2em]">
          Contado {formatDistanceToNow(story.createdAt instanceof Date ? story.createdAt : new Date(story.createdAt?.seconds * 1000 || Date.now()), { locale: ptBR, addSuffix: true })}
        </p>
      </div>
    </Card>
  );
}
