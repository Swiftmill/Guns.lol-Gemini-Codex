import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUser } from '../lib/usersDB';

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const res = createUser(username, password);
    if (res.ok) {
      alert('Compte créé !');
      navigate('/login');
    } else setError(res.message || 'Erreur inconnue');
  };

  return (
    <section className="view-section min-h-screen items-center justify-center relative active">
      <Link to="/" className="absolute top-8 left-8 text-gray-400 hover:text-white z-20 flex items-center gap-2">
        <i className="fas fa-arrow-left"></i> Back
      </Link>
      <div className="bg-guns-card border border-guns-border p-8 rounded-2xl w-full max-w-md relative z-10 shadow-2xl glass-panel">
        <div className="text-center mb-6">
          <i className="fas fa-user-plus text-4xl text-guns-primary mb-4"></i>
          <h1 className="text-2xl font-bold">Créer un compte</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="username" type="text" placeholder="Nom d'utilisateur souhaité" className="input-guns" required />
          <input name="email" type="email" placeholder="Email" className="input-guns" required />
          <input name="password" type="password" placeholder="Mot de passe" className="input-guns" required />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button type="submit" className="w-full btn-aesthetic py-3 rounded-lg">
            S'inscrire
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-500">Déjà un compte ?</span>
          <Link to="/login" className="text-white hover:underline ml-1">
            Se connecter
          </Link>
        </div>
      </div>
    </section>
  );
}
