import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardOverviewTab from '../components/DashboardOverviewTab';
import DashboardGeneralTab from '../components/DashboardGeneralTab';
import DashboardVisualsTab from '../components/DashboardVisualsTab';
import DashboardBadgesTab from '../components/DashboardBadgesTab';
import DashboardLinksTab from '../components/DashboardLinksTab';
import AdminPanel from '../components/AdminPanel';
import {
  ADMIN_USER,
  UserData,
  ensureDefaultAdmin,
  getCurrentUser,
  getUserData,
  logoutUser,
  setUserDataField
} from '../lib/usersDB';

ensureDefaultAdmin();

const tabs = ['overview', 'general', 'visuals', 'badges', 'links', 'admin'] as const;
type Tab = (typeof tabs)[number];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<Tab>('overview');
  const [username, setUsername] = useState<string | null>(getCurrentUser());
  const [data, setData] = useState<UserData>(() => getUserData(getCurrentUser() || '') || ensureDefaultAdmin()[ADMIN_USER].data);

  const isAdmin = useMemo(() => username === ADMIN_USER, [username]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setUsername(user);
    const userData = getUserData(user);
    if (userData) setData(userData);
  }, [navigate]);

  const handleUpdate = <K extends keyof UserData>(field: K, value: UserData[K]) => {
    if (!username) return;
    setData((prev) => ({ ...prev, [field]: value }));
    try {
      setUserDataField(username, field, value);
    } catch (e) {
      alert('Erreur : Stockage plein. Impossible de sauvegarder les modifications.');
    }
  };

  const handleFileUpload = (field: keyof Pick<UserData, 'background' | 'music' | 'avatar' | 'albumArt' | 'cursorImage'>, file: File) => {
    if (file.size > 100 * 1024 * 1024) {
      alert('Fichier trop lourd >100MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      handleUpdate(field as any, result as any);
      alert('Upload OK');
    };
    reader.onerror = () => alert('Erreur: Le stockage local est plein.');
    reader.readAsDataURL(file);
  };

  const logout = () => {
    logoutUser();
    setUsername(null);
    navigate('/login');
  };

  const refresh = () => {
    if (!username) return;
    const userData = getUserData(username);
    if (userData) setData(userData);
  };

  const openProfile = () => {
    if (username) navigate(`/u/${username}`);
  };

  if (!username) return null;

  return (
    <section className="view-section min-h-screen bg-guns-bg relative active" id="view-dashboard">
      <aside className="fixed top-0 left-0 h-full w-64 bg-guns-card border-r border-guns-border flex flex-col z-50">
        <div className="p-6 flex items-center justify-between border-b border-guns-border">
          <div className="flex items-center gap-3">
            <i className="fas fa-gun text-guns-primary text-xl"></i>
            <span className="font-bold text-lg tracking-tight">guns.lol</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="mb-4 px-4">
            <p className="text-xs text-gray-500">Connecté:</p>
            <p className="font-bold text-white truncate" id="dash-user-display">
              {username}
            </p>
          </div>
          {isAdmin && (
            <div className="mb-6 border-b border-guns-border pb-4">
              <p className="px-4 text-xs font-bold text-red-500 uppercase tracking-wider mb-2">Administration</p>
              <button onClick={() => setCurrentTab('admin')} className={navClasses(currentTab === 'admin')}>
                <i className="fas fa-shield-alt w-5"></i> Admin Tools
              </button>
            </div>
          )}
          <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4">Menu</p>
          <button onClick={() => setCurrentTab('overview')} className={navClasses(currentTab === 'overview')}>
            <i className="fas fa-home w-5"></i> Overview
          </button>
          <button onClick={() => setCurrentTab('general')} className={navClasses(currentTab === 'general')}>
            <i className="fas fa-id-card w-5"></i> General
          </button>
          <button onClick={() => setCurrentTab('visuals')} className={navClasses(currentTab === 'visuals')}>
            <i className="fas fa-paint-brush w-5"></i> Visuals
          </button>
          <button onClick={() => setCurrentTab('badges')} className={navClasses(currentTab === 'badges')}>
            <i className="fas fa-certificate w-5"></i> Badges
          </button>
          <button onClick={() => setCurrentTab('links')} className={navClasses(currentTab === 'links')}>
            <i className="fas fa-link w-5"></i> Links
          </button>
        </nav>
        <div className="p-4 border-t border-guns-border space-y-2">
          <button onClick={openProfile} className="w-full btn-aesthetic text-black py-2 rounded-lg text-sm font-bold">
            <i className="fas fa-external-link-alt mr-2"></i> Voir Page
          </button>
          <button onClick={logout} className="w-full text-red-500 hover:bg-red-500/10 py-2 rounded-lg text-sm transition">
            <i className="fas fa-sign-out-alt mr-2"></i> Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-8 overflow-y-auto h-screen relative w-full">
        {currentTab === 'admin' && isAdmin && <AdminPanel />}
        {currentTab === 'overview' && <DashboardOverviewTab data={data} />}
        {currentTab === 'general' && <DashboardGeneralTab data={data} onChange={handleUpdate} />}
        {currentTab === 'visuals' && <DashboardVisualsTab data={data} onChange={handleUpdate} onFile={handleFileUpload} />}
        {currentTab === 'badges' && (
          <DashboardBadgesTab username={username} data={data} isAdmin={isAdmin} refresh={refresh} />
        )}
        {currentTab === 'links' && <DashboardLinksTab username={username} data={data} refresh={refresh} />}
      </main>
    </section>
  );
}

function navClasses(active: boolean) {
  return `dash-nav-btn w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-3 ${active ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`;
}
