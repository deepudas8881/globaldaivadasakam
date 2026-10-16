import React, { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err) {
      setError('Invalid admin credentials.');
    }
  };

  if (user) {
    return (
      <div className="text-center py-10">
        <p className="mb-4">Logged in as: {user.email}</p>
        <button onClick={() => signOut(auth)} className="px-4 py-2 bg-red-600 rounded">Logout</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto p-6 bg-[#05231c] rounded-xl border border-[#d9b56d]/30">
      <h2 className="text-xl font-bold mb-4 text-[#d9b56d]">Admin Login</h2>
      {error && <p className="text-red-400 mb-2">{error}</p>}
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 mb-3 bg-[#082f26] border rounded" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-2 mb-4 bg-[#082f26] border rounded" required />
      <button type="submit" className="w-full py-2 bg-[#d9b56d] text-[#122e25] font-bold rounded">Login</button>
    </form>
  );
};
