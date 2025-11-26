import { FormEvent, useState } from 'react';
import { setViews, toggleBadge, getUsersDB, saveUsersDB } from '../lib/usersDB';

export default function AdminPanel() {
  const [targetUser, setTargetUser] = useState('');
  const [message, setMessage] = useState('');
  const [loaded, setLoaded] = useState<string | null>(null);
  const [views, setViewsState] = useState(0);

  const loadUser = (e: FormEvent) => {
    e.preventDefault();
    const db = getUsersDB();
    if (!db[targetUser]) {
      setMessage('Utilisateur inconnu');
      setLoaded(null);
      return;
    }
    setLoaded(targetUser);
    setViewsState(db[targetUser].data.views || 0);
    setMessage('Utilisateur chargé: ' + targetUser);
  };

  const updateViews = () => {
    if (!loaded) return;
    setViews(loaded, views);
    setMessage('Vues mises à jour');
  };

  const resetViews = () => {
    if (!loaded) return;
    setViews(loaded, 0);
    setViewsState(0);
    setMessage('Vues reset');
  };

  const toggle = (badge: any) => {
    if (!loaded) return;
    toggleBadge(loaded, badge);
    setMessage('Badges mis à jour');
  };

  const resetUsersDB = () => {
    const db = getUsersDB();
    saveUsersDB(db);
  };

  return (
    <div className="dash-tab" id="dash-admin">
      <h2 className="text-3xl font-bold mb-6 text-red-500 flex items-center gap-2">
        <i className="fas fa-shield-alt"></i> Admin Panel
      </h2>
      <form onSubmit={loadUser} className="grid gap-6 max-w-4xl">
        <div className="bg-guns-card border border-red-500/30 rounded-xl p-6">
          <h3 className="font-bold mb-4">Gestion Utilisateur</h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Pseudo..."
              className="input-guns"
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
            />
            <button type="submit" className="bg-red-500 hover:bg-red-600 text-white px-6 rounded font-bold transition">
              Charger
            </button>
          </div>
          <p className="text-sm mt-2 text-yellow-500">{message}</p>
        </div>
        {loaded && (
          <div id="admin-controls" className="space-y-6">
            <div className="bg-guns-card border border-guns-border rounded-xl p-6">
              <h3 className="font-bold mb-4">Badges Rares</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button onClick={() => toggle('staff')} className="p-4 border border-guns-border rounded hover:bg-white/5 flex flex-col items-center" type="button">
                  <i className="fas fa-gavel text-red-500 text-xl"></i> Staff
                </button>
                <button onClick={() => toggle('dev')} className="p-4 border border-guns-border rounded hover:bg-white/5 flex flex-col items-center" type="button">
                  <i className="fas fa-code text-green-500 text-xl"></i> Dev
                </button>
                <button onClick={() => toggle('og')} className="p-4 border border-guns-border rounded hover:bg-white/5 flex flex-col items-center" type="button">
                  <i className="fas fa-crown text-yellow-500 text-xl"></i> OG
                </button>
              </div>
            </div>
            <div className="bg-guns-card border border-guns-border rounded-xl p-6">
              <h3 className="font-bold mb-4">Vues</h3>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Set Vues</label>
                  <input type="number" className="input-guns" value={views} onChange={(e) => setViewsState(Number(e.target.value))} />
                </div>
                <button onClick={updateViews} className="bg-blue-600 text-white px-4 py-3 rounded font-bold" type="button">
                  Set
                </button>
                <button onClick={resetViews} className="bg-red-600 text-white px-4 py-3 rounded font-bold" type="button">
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
      <button onClick={resetUsersDB} className="hidden">ResetDB</button>
    </div>
  );
}
