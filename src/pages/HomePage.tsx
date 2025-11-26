import { Link } from 'react-router-dom';

const icons = [
  { icon: 'fas fa-gun', size: 'text-6xl', style: { top: '10%', left: '10%', transform: 'rotate(-15deg)' } },
  { icon: 'fas fa-gun', size: 'text-8xl', style: { top: '50%', left: '80%', transform: 'rotate(15deg)', animationDelay: '2s' } },
  { icon: 'fas fa-gun', size: 'text-5xl', style: { top: '80%', left: '20%', transform: 'rotate(-10deg)', animationDelay: '4s' } },
  { icon: 'fas fa-bomb', size: 'text-4xl', style: { top: '20%', left: '60%', opacity: 0.2, animationDelay: '3s' } },
  { icon: 'fas fa-crosshairs', size: 'text-7xl', style: { top: '70%', left: '50%', animationDelay: '1.5s' } }
];

export default function HomePage() {
  return (
    <section id="view-home" className="view-section min-h-screen relative active">
      <div className="bg-pattern z-0">
        {icons.map((i, idx) => (
          <i
            key={idx}
            className={`${i.icon} bg-icon ${i.size}`}
            style={{ ...i.style, position: 'absolute' as const }}
          />
        ))}
      </div>
      <nav className="relative z-20 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <i className="fas fa-gun text-white text-2xl" />
          <span className="text-2xl font-bold tracking-tight">guns.lol</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
          <a className="hover:text-white transition" href="#">Help</a>
          <a className="hover:text-white transition" href="#">Discord</a>
          <a className="hover:text-white transition" href="#">Premium</a>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/login" className="text-gray-300 hover:text-white font-medium text-sm transition">
            Login
          </Link>
          <Link to="/signup" className="btn-aesthetic text-black px-5 py-2 rounded-full text-sm">
            Sign Up Free
          </Link>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center text-center mt-12 px-4">
        <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-guns-primary mb-6 animate-pulse">
          ✨ The #1 Biolink Service
        </div>
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-600 max-w-5xl drop-shadow-2xl">
          Everything you want,
          <br />
          right here.
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mb-10 leading-relaxed">
          Créez un profil unique, sombre et esthétique. Rejoignez l'élite avec guns.lol.
        </p>

        <div className="flex gap-4 mb-20">
          <Link to="/signup" className="btn-aesthetic px-8 py-4 rounded-xl font-bold text-lg">
            Commencer Gratuitement
          </Link>
          <button className="btn-aesthetic-secondary px-8 py-4 rounded-xl font-bold text-lg">Voir les Prix</button>
        </div>

        <div className="relative w-full max-w-6xl perspective-[2000px] mb-20 group">
          <div className="absolute inset-0 bg-guns-primary/20 blur-[120px] rounded-full transform translate-y-20"></div>
          <div className="relative transform rotate-x-[15deg] group-hover:rotate-x-[5deg] transition duration-1000 ease-out">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
              className="rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] opacity-90 w-full h-[500px] object-cover object-top"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full text-white font-mono text-sm shadow-2xl">
                <i className="fas fa-eye mr-2 text-guns-primary"></i> Live Preview
              </div>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-white/5 py-12 bg-black/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-white mb-1">42M+</h3>
              <p className="text-gray-500 text-sm font-mono uppercase tracking-widest">Vues Profil</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-white mb-1">1.2M+</h3>
              <p className="text-gray-500 text-sm font-mono uppercase tracking-widest">Utilisateurs</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-white mb-1">35k+</h3>
              <p className="text-gray-500 text-sm font-mono uppercase tracking-widest">Membres Premium</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
