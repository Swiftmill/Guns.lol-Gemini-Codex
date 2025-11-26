export type BadgeId = 'verified' | 'premium' | 'staff' | 'dev' | 'og';
export type LinkType = 'discord' | 'instagram' | 'twitter';
export interface UserLink { type: LinkType; url: string; }

export interface UserData {
  displayName: string;
  bio: string;
  enterText: string;
  avatar: string;
  background: string;
  accentColor: string;
  textColor: string;
  music: string;
  songTitle: string;
  songArtist: string;
  albumArt: string;
  badges: BadgeId[];
  links: UserLink[];
  views: number;
  uid: number;
  opacity: number;
  blur: number;
  glowUsername: boolean;
  glowSocials: boolean;
  snowEffect: boolean;
  tiltEffect: boolean;
  animationType: 'slide' | 'fade' | 'zoom' | 'flip' | 'bounce';
  cursorTrail: boolean;
  cursorImage: string;
}

export interface UserRecord {
  password: string;
  data: UserData;
}

export type UsersDB = Record<string, UserRecord>;

export const ADMIN_USER = 'Admin';
export const ADMIN_PASS = '246v8q81';

const DEFAULT_AVATAR = 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix';

export const defaultUserData: UserData = {
  displayName: 'New User',
  bio: 'Welcome to my profile',
  enterText: 'click to enter...',
  avatar: DEFAULT_AVATAR,
  background: '',
  accentColor: '#ffffff',
  textColor: '#ffffff',
  music: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
  songTitle: '',
  songArtist: '',
  albumArt: '',
  badges: [],
  links: [],
  views: 0,
  uid: Math.floor(Math.random() * 10000) + 100,
  opacity: 90,
  blur: 10,
  glowUsername: true,
  glowSocials: false,
  snowEffect: true,
  tiltEffect: true,
  animationType: 'bounce',
  cursorTrail: false,
  cursorImage: ''
};

const USERS_KEY = 'gunsUsers';
const CURRENT_USER_KEY = 'gunsCurrentUser';

function loadUsers(): UsersDB {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as UsersDB;
  } catch (e) {
    return {};
  }
}

export function getUsersDB(): UsersDB {
  const db = loadUsers();
  return ensureDefaultAdmin(db);
}

export function saveUsersDB(db: UsersDB) {
  localStorage.setItem(USERS_KEY, JSON.stringify(db));
}

export function ensureDefaultAdmin(db?: UsersDB): UsersDB {
  const current = db || loadUsers();
  if (!current[ADMIN_USER]) {
    current[ADMIN_USER] = {
      password: ADMIN_PASS,
      data: {
        ...defaultUserData,
        displayName: 'Administrator',
        bio: 'System Admin',
        views: 999999,
        badges: ['staff', 'dev', 'og'],
        uid: 1
      }
    };
    try {
      saveUsersDB(current);
    } catch (err) {
      console.error(err);
    }
  }
  return current;
}

export function getCurrentUser(): string | null {
  return localStorage.getItem(CURRENT_USER_KEY);
}

export function setCurrentUser(username: string | null) {
  if (username) localStorage.setItem(CURRENT_USER_KEY, username);
  else localStorage.removeItem(CURRENT_USER_KEY);
}

export function createUser(username: string, password: string): { ok: boolean; message?: string } {
  const db = getUsersDB();
  if (username === ADMIN_USER) return { ok: false, message: 'Pseudo réservé.' };
  if (db[username]) return { ok: false, message: 'Utilisateur existant' };
  db[username] = { password, data: { ...defaultUserData, displayName: username } };
  try {
    saveUsersDB(db);
    return { ok: true };
  } catch (e) {
    return { ok: false, message: 'Erreur de stockage (Quota dépassé). Impossible de créer le compte.' };
  }
}

export function loginUser(username: string, password: string): { ok: boolean; message?: string } {
  const db = getUsersDB();
  const user = db[username];
  if (user && user.password === password) {
    if (!user.data) user.data = { ...defaultUserData };
    try {
      saveUsersDB(db);
    } catch (e) {
      /* ignore */
    }
    setCurrentUser(username);
    return { ok: true };
  }
  return { ok: false, message: 'Identifiants incorrects' };
}

export function logoutUser() {
  setCurrentUser(null);
}

export function updateUserData(username: string, updater: (data: UserData) => UserData) {
  const db = getUsersDB();
  if (!db[username]) return;
  db[username].data = updater(db[username].data || { ...defaultUserData });
  saveUsersDB(db);
}

export function getUserData(username: string): UserData | null {
  const db = getUsersDB();
  const record = db[username];
  if (!record) return null;
  if (!record.data) record.data = { ...defaultUserData };
  try { saveUsersDB(db); } catch (e) { /* ignore */ }
  return record.data;
}

export function setUserDataField<K extends keyof UserData>(username: string, field: K, value: UserData[K]) {
  updateUserData(username, (data) => ({ ...data, [field]: value }));
}

export function incrementViews(username: string) {
  updateUserData(username, (data) => ({ ...data, views: (data.views || 0) + 1 }));
}

export function setViews(username: string, value: number) {
  updateUserData(username, (data) => ({ ...data, views: value }));
}

export function toggleBadge(username: string, badge: BadgeId) {
  updateUserData(username, (data) => {
    const badges = new Set(data.badges || []);
    if (badges.has(badge)) badges.delete(badge); else badges.add(badge);
    return { ...data, badges: Array.from(badges) };
  });
}

export function updateLink(username: string, index: number, updater: (link: UserLink) => UserLink) {
  updateUserData(username, (data) => {
    const links = [...(data.links || [])];
    links[index] = updater(links[index]);
    return { ...data, links };
  });
}

export function addLink(username: string) {
  updateUserData(username, (data) => ({ ...data, links: [...(data.links || []), { type: 'discord', url: '' }] }));
}

export function deleteLink(username: string, index: number) {
  updateUserData(username, (data) => {
    const links = [...(data.links || [])];
    links.splice(index, 1);
    return { ...data, links };
  });
}

export function getBadgeList(isAdmin: boolean) {
  return [
    { id: 'verified' as BadgeId, icon: 'fas fa-check-circle', color: '#ffffff', restricted: false },
    { id: 'premium' as BadgeId, icon: 'fas fa-gem', color: '#ffffff', restricted: false },
    { id: 'staff' as BadgeId, icon: 'fas fa-gavel', color: '#ef4444', restricted: true },
    { id: 'dev' as BadgeId, icon: 'fas fa-code', color: '#ffffff', restricted: true },
    { id: 'og' as BadgeId, icon: 'fas fa-crown', color: '#ffffff', restricted: true }
  ].filter((b) => (isAdmin ? true : !b.restricted));
}
