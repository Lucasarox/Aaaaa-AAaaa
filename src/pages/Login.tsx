import React from 'react';
import { loginWithGoogle } from '../firebase';
import { motion } from 'motion/react';
import { BusFront, LogIn } from 'lucide-react';

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="w-24 h-24 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20">
          <BusFront size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter mb-2">VemVans</h1>
        <p className="text-zinc-400 font-medium">Transporte inteligente e pontual</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-sm"
      >
        <button
          onClick={loginWithGoogle}
          className="w-full bg-white text-zinc-900 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-100 transition-colors shadow-xl"
        >
          <LogIn size={20} />
          Entrar com Google
        </button>
        
        <p className="mt-8 text-center text-xs text-zinc-500 px-8">
          Ao entrar, você concorda com nossos termos de uso e política de privacidade.
        </p>
      </motion.div>
    </div>
  );
}
