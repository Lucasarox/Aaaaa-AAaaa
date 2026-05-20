import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Bus, MapPin, Users, ArrowRight, X, Search } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

interface RouteData {
  id: string;
  name: string;
  driverId: string;
  status: 'active' | 'inactive';
  maxPassengers: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRouteName, setNewRouteName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [maxPassengers, setMaxPassengers] = useState(15);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !profile) return;

    let q;
    if (profile.role === 'driver') {
      q = query(collection(db, 'routes'), where('driverId', '==', user.uid));
    } else {
      // For passengers, we show all routes for now, or we could filter by participation
      q = query(collection(db, 'routes'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const routesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RouteData[];
      setRoutes(routesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, profile]);

  const handleJoinRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim()) {
      navigate(`/route/${joinCode.trim()}`);
    }
  };

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'routes'), {
        name: newRouteName,
        driverId: user.uid,
        status: 'inactive',
        maxPassengers: maxPassengers,
        createdAt: serverTimestamp(),
        passengerOrder: []
      });
      setShowCreateModal(false);
      setNewRouteName('');
    } catch (error) {
      console.error("Error creating route:", error);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Olá, {profile?.name.split(' ')[0]}</h1>
          <p className="text-zinc-500 text-sm">Bem-vindo ao VemVans</p>
        </div>
        {profile?.role === 'driver' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-3 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-colors"
          >
            <Plus size={24} />
          </button>
        )}
      </header>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
          <Bus size={20} className="text-orange-500" />
          Suas Rotas
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-zinc-900"></div>
          </div>
        ) : routes.length > 0 ? (
          <div className="grid gap-4">
            {routes.map((route) => (
              <Link
                key={route.id}
                to={`/route/${route.id}`}
                className="block bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      route.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-zinc-100 text-zinc-400'
                    }`}>
                      <Bus size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900">{route.name}</h3>
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        route.status === 'active' ? 'text-green-600' : 'text-zinc-400'
                      }`}>
                        {route.status === 'active' ? 'Em Viagem' : 'Inativa'}
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-zinc-300 group-hover:text-orange-500 transition-colors" />
                </div>
                
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>Máx: {route.maxPassengers}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-zinc-200">
            <p className="text-zinc-400 mb-4">Nenhuma rota encontrada.</p>
            {profile?.role === 'driver' ? (
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-orange-500 font-bold hover:underline"
              >
                Criar minha primeira rota
              </button>
            ) : (
              <div className="flex flex-col items-center gap-4 p-4">
                <p className="text-sm">Procure por uma rota ou peça o código ao motorista.</p>
                <form onSubmit={handleJoinRoute} className="relative w-full max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input
                    type="text"
                    placeholder="Código da Rota"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="w-full bg-zinc-100 border-none rounded-2xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button type="submit" className="hidden">Join</button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Nova Rota</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-zinc-100 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateRoute} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-zinc-500 mb-2 block">Nome da Rota</label>
                    <input
                      type="text"
                      placeholder="Ex: Faculdade Manhã"
                      value={newRouteName}
                      onChange={(e) => setNewRouteName(e.target.value)}
                      required
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-zinc-500 mb-2 block">Capacidade da Van</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={maxPassengers}
                      onChange={(e) => setMaxPassengers(parseInt(e.target.value))}
                      required
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                >
                  Criar Rota
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
