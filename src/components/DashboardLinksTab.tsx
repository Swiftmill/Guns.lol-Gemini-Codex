import { UserData, addLink, deleteLink, updateLink } from '../lib/usersDB';

interface Props {
  username: string;
  data: UserData;
  refresh: () => void;
}

export default function DashboardLinksTab({ username, data, refresh }: Props) {
  const links = data.links || [];

  const add = () => {
    addLink(username);
    refresh();
  };

  const remove = (idx: number) => {
    deleteLink(username, idx);
    refresh();
  };

  const updateType = (idx: number, val: any) => {
    updateLink(username, idx, (link) => ({ ...link, type: val }));
    refresh();
  };

  const updateUrl = (idx: number, val: string) => {
    updateLink(username, idx, (link) => ({ ...link, url: val }));
    refresh();
  };

  return (
    <div className="dash-tab" id="dash-links">
      <h2 className="text-3xl font-bold mb-6">Liens</h2>
      <div className="bg-guns-card border border-guns-border rounded-xl p-6">
        <div className="space-y-3 mb-4">
          {links.map((link, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <select
                className="bg-[#18181b] border border-[#27272a] rounded p-2 text-sm text-white"
                value={link.type}
                onChange={(e) => updateType(idx, e.target.value)}
              >
                <option value="discord">Discord</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
              </select>
              <input
                type="text"
                value={link.url}
                className="flex-1 bg-[#18181b] border border-[#27272a] rounded p-2 text-sm text-white"
                placeholder="URL"
                onChange={(e) => updateUrl(idx, e.target.value)}
              />
              <button onClick={() => remove(idx)} className="text-red-500 px-2">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </div>
        <button onClick={add} className="w-full btn-aesthetic-secondary text-white py-2 rounded">
          + Ajouter un lien
        </button>
      </div>
    </div>
  );
}
