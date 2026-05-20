import React, { useState } from 'react';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { User, Phone, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

interface ProfileSetupProps {
  isEditing?: boolean;
}

export default function ProfileSetup({ isEditing = false }: ProfileSetupProps) {
  const { profile, updateProfile } = useAuth();
  const [name, setName] = useState(profile?.name || '');
  const [contact, setContact] = useState(profile?.contact || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [role, setRole] = useState<UserRole>(profile?.role || 'passenger');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, contact, address, role });
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col p-6">
      <div className="max-w-md mx-auto w-full">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tighter text-zinc-900">
            {isEditing ? 'Editar Perfil' : 'Complete seu Perfil'}
          </h1>
          <p className="text-zinc-500">Precisamos de alguns dados para começar.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input
                type="text"
                placeholder="Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input
                type="tel"
                placeholder="Telefone de Contato"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                className="w-full bg-white border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input
                type="text"
                placeholder="Endereço de Embarque"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full bg-white border border-zinc-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {!isEditing && (
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('passenger')}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  role === 'passenger' 
                    ? 'border-orange-500 bg-orange-50 text-orange-700' 
                    : 'border-zinc-200 bg-white text-zinc-500'
                }`}
              >
                <User size={24} />
                <span className="font-bold">Passageiro</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('driver')}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  role === 'driver' 
                    ? 'border-orange-500 bg-orange-50 text-orange-700' 
                    : 'border-zinc-200 bg-white text-zinc-500'
                }`}
              >
                <CheckCircle2 size={24} />
                <span className="font-bold">Motorista</span>
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-zinc-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Começar Agora'}
            {!saving && <ArrowRight size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
}
