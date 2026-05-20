import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, onSnapshot, updateDoc, collection, setDoc, deleteDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRightLeft, 
  Play, 
  Square,
  Share2,
  MoreVertical,
  ChevronRight,
  User
} from 'lucide-react';
import Map from '../components/Map';
import { cn } from '../lib/utils';

interface RoutePassenger {
  passengerId: string;
  name: string;
  status: 'vai' | 'não vai' | 'só ida' | 'só volta' | 'pendente';
  address: string;
  orderIndex: number;
}

interface RouteData {
  id: string;
  name: string;
  driverId: string;
  status: 'active' | 'inactive';
  maxPassengers: number;
  passengerOrder: string[];
}

export default function RouteDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [route, setRoute] = useState<RouteData | null>(null);
  const [passengers, setPassengers] = useState<RoutePassenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [vanLocation, setVanLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!id || !user) return;

    const unsubRoute = onSnapshot(doc(db, 'routes', id), (docSnap) => {
      if (docSnap.exists()) {
        setRoute({ id: docSnap.id, ...docSnap.data() } as RouteData);
      } else {
        navigate('/');
      }
      setLoading(false);
    });

    const unsubPassengers = onSnapshot(collection(db, 'routes', id, 'passengers'), (snapshot) => {
      const passengersData = snapshot.docs.map(doc => ({
        passengerId: doc.id,
        ...doc.data()
      })) as RoutePassenger[];
      setPassengers(passengersData.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)));
    });

    return () => {
      unsubRoute();
      unsubPassengers();
    };
  }, [id, user]);

  // Real-time location tracking for driver
  useEffect(() => {
    if (route?.status === 'active' && route.driverId === user?.uid) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDoc(doc(db, 'locations', id!), {
            routeId: id,
            lat: latitude,
            lng: longitude,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        },
        (error) => console.error("Location error:", error),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [route?.status, route?.driverId, user?.uid, id]);

  // Real-time location for passengers
  useEffect(() => {
    if (route?.status === 'active' && id) {
      const unsubLoc = onSnapshot(doc(db, 'locations', id), (docSnap) => {
        if (docSnap.exists()) {
          setVanLocation(docSnap.data() as { lat: number; lng: number });
        }
      });
      return () => unsubLoc();
    } else {
      setVanLocation(null);
    }
  }, [route?.status, id]);

  const toggleTrip = async () => {
    if (!route) return;
    const newStatus = route.status === 'active' ? 'inactive' : 'active';
    await updateDoc(doc(db, 'routes', route.id), { status: newStatus });
  };

  const updateStatus = async (status: RoutePassenger['status']) => {
    if (!id || !user || !profile) return;
    await setDoc(doc(db, 'routes', id, 'passengers', user.uid), {
      passengerId: user.uid,
      name: profile.name,
      address: profile.address,
      status,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  };

  const isPassenger = passengers.some(p => p.passengerId === user?.uid);
  const myStatus = passengers.find(p => p.passengerId === user?.uid)?.status || 'pendente';

  const joinRoute = async () => {
    if (!id || !user || !profile) return;
    await setDoc(doc(db, 'routes', id, 'passengers', user.uid), {
      passengerId: user.uid,
      name: profile.name,
      address: profile.address,
      status: 'pendente',
      orderIndex: passengers.length,
      updatedAt: new Date().toISOString()
    });
  };

  if (loading) return null;

  return (
    <div className="space-y-6 pb-12">
      <header className="flex items-center justify-between">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-zinc-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-tight">{route?.name}</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(id || '');
              alert('Código da rota copiado!');
            }}
            className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400"
            title="Copiar código da rota"
          >
            <Share2 size={20} />
          </button>
          <button className="p-2 hover:bg-zinc-100 rounded-full">
            <MoreVertical size={24} />
          </button>
        </div>
      </header>

      {!isPassenger && route?.driverId !== user?.uid && (
        <div className="bg-orange-50 p-6 rounded-[2.5rem] border border-orange-100 text-center">
          <h3 className="font-bold text-orange-900 mb-2">Você não está nesta rota</h3>
          <p className="text-sm text-orange-700 mb-4">Deseja participar como passageiro?</p>
          <button
            onClick={joinRoute}
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-2xl hover:bg-orange-600 transition-colors"
          >
            Participar da Rota
          </button>
        </div>
      )}

      {route?.status === 'active' && (
        <div className="h-64 w-full">
          <Map 
            center={vanLocation || { lat: -23.5505, lng: -46.6333 }} 
            markers={vanLocation ? [{ position: vanLocation, title: "Van em movimento" }] : []}
          />
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-zinc-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-3 h-3 rounded-full animate-pulse",
              route?.status === 'active' ? "bg-green-500" : "bg-zinc-300"
            )} />
            <span className="font-bold text-zinc-900">
              {route?.status === 'active' ? 'Viagem em Andamento' : 'Viagem Inativa'}
            </span>
          </div>
          {route?.driverId === user?.uid && (
            <button
              onClick={toggleTrip}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all",
                route?.status === 'active' 
                  ? "bg-red-100 text-red-600 hover:bg-red-200" 
                  : "bg-green-100 text-green-600 hover:bg-green-200"
              )}
            >
              {route?.status === 'active' ? <Square size={18} /> : <Play size={18} />}
              {route?.status === 'active' ? 'Encerrar' : 'Iniciar'}
            </button>
          )}
        </div>

        {route?.driverId !== user?.uid && (
          <div className="space-y-4">
            <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Seu Status</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'vai', label: 'Vou', icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
                { id: 'não vai', label: 'Não vou', icon: XCircle, color: 'text-red-600 bg-red-50' },
                { id: 'só ida', label: 'Só Ida', icon: ArrowRightLeft, color: 'text-blue-600 bg-blue-50' },
                { id: 'só volta', label: 'Só Volta', icon: ArrowRightLeft, color: 'text-purple-600 bg-purple-50' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => updateStatus(opt.id as any)}
                  className={cn(
                    "flex items-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold",
                    myStatus === opt.id 
                      ? "border-orange-500 bg-orange-50 text-orange-700" 
                      : "border-zinc-100 bg-white text-zinc-500"
                  )}
                >
                  <opt.icon size={20} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <Users size={20} className="text-orange-500" />
            Passageiros ({passengers.length}/{route?.maxPassengers})
          </h2>
          <button className="text-orange-500 font-bold text-sm">Ver Ordem</button>
        </div>

        <div className="space-y-3">
          {passengers.map((p, idx) => (
            <div key={p.passengerId} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400 font-bold">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">{p.name}</h3>
                  <p className="text-xs text-zinc-500 flex items-center gap-1">
                    <MapPin size={12} />
                    {p.address.split(',')[0]}
                  </p>
                </div>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                p.status === 'vai' ? "bg-green-100 text-green-600" :
                p.status === 'não vai' ? "bg-red-100 text-red-600" :
                p.status === 'só ida' ? "bg-blue-100 text-blue-600" :
                p.status === 'só volta' ? "bg-purple-100 text-purple-600" :
                "bg-zinc-100 text-zinc-400"
              )}>
                {p.status}
              </div>
            </div>
          ))}
          {passengers.length === 0 && (
            <div className="text-center py-8 text-zinc-400 text-sm italic">
              Nenhum passageiro confirmado ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
