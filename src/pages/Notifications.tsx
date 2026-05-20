import React from 'react';
import { Bell, Clock, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      title: "A van está chegando!",
      description: "A van chega em aproximadamente 5 minutos.",
      time: "Agora",
      icon: Clock,
      color: "bg-orange-100 text-orange-600"
    },
    {
      id: 2,
      title: "Você é o próximo!",
      description: "Prepare-se para o embarque.",
      time: "2 min atrás",
      icon: MapPin,
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: 3,
      title: "Viagem iniciada",
      description: "O motorista iniciou a rota 'Faculdade Manhã'.",
      time: "10 min atrás",
      icon: CheckCircle2,
      color: "bg-green-100 text-green-600"
    }
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Notificações</h1>
        <p className="text-zinc-500 text-sm">Fique por dentro das atualizações</p>
      </header>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="bg-white p-5 rounded-3xl border border-zinc-100 flex items-start gap-4 hover:bg-zinc-50 transition-colors cursor-pointer group">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
              <n.icon size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-zinc-900">{n.title}</h3>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{n.time}</span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">{n.description}</p>
            </div>
            <ChevronRight size={16} className="text-zinc-200 mt-1 group-hover:text-zinc-400 transition-colors" />
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={32} className="text-zinc-300" />
          </div>
          <p className="text-zinc-400 font-medium">Nenhuma notificação por aqui.</p>
        </div>
      )}
    </div>
  );
}
