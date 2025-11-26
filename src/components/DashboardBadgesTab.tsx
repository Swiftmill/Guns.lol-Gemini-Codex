import { BadgeId, UserData, getBadgeList, toggleBadge } from '../lib/usersDB';

interface Props {
  username: string;
  data: UserData;
  isAdmin: boolean;
  refresh: () => void;
}

export default function DashboardBadgesTab({ username, data, isAdmin, refresh }: Props) {
  const badges = getBadgeList(isAdmin);
  const userBadges = data.badges || [];

  const toggle = (id: BadgeId) => {
    toggleBadge(username, id);
    refresh();
  };

  return (
    <div className="dash-tab" id="dash-badges">
      <h2 className="text-3xl font-bold mb-6">Badges</h2>
      <div className="bg-guns-card border border-guns-border rounded-xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((b) => {
            const active = userBadges.includes(b.id);
            return (
              <button
                key={b.id}
                onClick={() => toggle(b.id)}
                className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center gap-2 transition ${active ? 'badge-selected border-guns-primary bg-white/5' : 'border-guns-border bg-guns-card hover:bg-white/5'}`}
              >
                <i className={`${b.icon} text-xl`} style={{ color: active ? b.color : '#666' }}></i>
                <span className="text-xs font-bold uppercase">{b.id}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
