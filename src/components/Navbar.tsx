import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, Settings, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 px-6 py-4 z-40">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-orange-500" : "text-zinc-400 hover:text-zinc-600"
            )
          }
        >
          <Home size={24} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Início</span>
        </NavLink>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-orange-500" : "text-zinc-400 hover:text-zinc-600"
            )
          }
        >
          <Bell size={24} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Alertas</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-orange-500" : "text-zinc-400 hover:text-zinc-600"
            )
          }
        >
          <User size={24} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Perfil</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-orange-500" : "text-zinc-400 hover:text-zinc-600"
            )
          }
        >
          <Settings size={24} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Ajustes</span>
        </NavLink>
      </div>
    </nav>
  );
}
