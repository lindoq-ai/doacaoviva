import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Heart, LogOut, User as UserIcon, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface NavbarProps {
  onNewStory: () => void;
  onViewChange: (view: 'home' | 'dashboard') => void;
  currentView: 'home' | 'dashboard';
}

export function Navbar({ onNewStory, onViewChange, currentView }: NavbarProps) {
  const { user, profile, signIn, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b-0 border-white/40 shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onViewChange('home')}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
            <span className="text-xl">💙</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tighter">DoaçãoViva</h1>
            <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] leading-none">Conecta Direto</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6">
            <span 
              onClick={() => onViewChange('dashboard')}
              className={`text-xs font-black uppercase tracking-widest cursor-pointer transition-colors ${currentView === 'dashboard' ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}
            >
              Impacto
            </span>
            <span 
              onClick={() => onViewChange('home')}
              className={`text-xs font-black uppercase tracking-widest cursor-pointer transition-colors ${currentView === 'home' ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}
            >
              Histórias
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {profile?.role === 'recipient' && (
                  <Button onClick={onNewStory} variant="outline" className="hidden sm:flex gap-2 rounded-full border-blue-200 bg-white/40 text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-bold text-xs uppercase tracking-widest px-6 shadow-sm">
                    <Plus className="h-4 w-4" />
                    Contar História
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="relative h-11 w-11 rounded-2xl overflow-hidden border-2 border-white shadow-md hover:scale-105 transition-transform cursor-pointer">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={profile?.avatarUrl || user.photoURL || undefined} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                        {user.displayName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 glass-card border-none rounded-3xl mt-2 mr-2 p-2" align="end">
                    <DropdownMenuLabel className="font-normal p-4">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-black text-slate-800 leading-none">{profile?.name || user.displayName}</p>
                        <p className="text-xs font-bold text-slate-400">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-100/50" />
                    <DropdownMenuItem className="p-3 rounded-xl focus:bg-blue-50 focus:text-blue-600">
                      <UserIcon className="mr-3 h-4 w-4 opacity-50" />
                      <span className="font-bold text-xs uppercase tracking-widest">Meu Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-100/50" />
                    <DropdownMenuItem onClick={logout} className="p-3 rounded-xl focus:bg-red-50 text-red-500 focus:text-red-500">
                      <LogOut className="mr-3 h-4 w-4 opacity-50" />
                      <span className="font-bold text-xs uppercase tracking-widest">Sair da conta</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={signIn} className="rounded-full bg-blue-600 px-8 py-6 hover:bg-blue-700 shadow-lg shadow-blue-200 font-bold text-xs uppercase tracking-widest">
                Entrar
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
