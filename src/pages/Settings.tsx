import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../firebase';
import { LogOut, User, Shield, Globe, HelpCircle, ChevronRight } from 'lucide-react';

export default function Settings() {
  const { profile, user } = useAuth();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Ajustes</h1>
        <p className="text-zinc-500 text-sm">Gerencie sua conta e preferências</p>
      </header>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-100 flex flex-col items-center">
        <div className="w-24 h-24 bg-zinc-100 rounded-[2rem] flex items-center justify-center mb-4 border-4 border-white shadow-xl">
          <User size={48} className="text-zinc-300" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900">{profile?.name}</h2>
        <p className="text-zinc-500 text-sm mb-6">{user?.email}</p>
        <div className="px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-widest">
          {profile?.role === 'driver' ? 'Motorista' : 'Passageiro'}
        </div>
      </div>

      <div className="space-y-4">
        {[
          { icon: Shield, label: 'Privacidade e Segurança', color: 'text-blue-500 bg-blue-50' },
          { icon: Globe, label: 'Idioma', color: 'text-green-500 bg-green-50', value: 'Português (BR)' },
          { icon: HelpCircle, label: 'Ajuda e Suporte', color: 'text-purple-500 bg-purple-50' },
        ].map((item, idx) => (
          <button key={idx} className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-zinc-100 hover:bg-zinc-50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", item.color)}>
                <item.icon size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold text-zinc-900">{item.label}</p>
                {item.value && <p className="text-xs text-zinc-400 font-medium">{item.value}</p>}
              </div>
            </div>
            <ChevronRight size={20} className="text-zinc-300 group-hover:text-zinc-500 transition-colors" />
          </button>
        ))}
      </div>

      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-3 p-5 bg-red-50 text-red-600 font-bold rounded-3xl hover:bg-red-100 transition-colors"
      >
        <LogOut size={20} />
        Sair da Conta
      </button>
    </div>
  );
}

// Helper for cn in this file since it's a new file
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
