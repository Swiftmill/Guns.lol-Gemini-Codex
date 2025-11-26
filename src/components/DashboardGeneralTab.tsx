import { UserData } from '../lib/usersDB';

interface Props {
  data: UserData;
  onChange: <K extends keyof UserData>(field: K, value: UserData[K]) => void;
}

export default function DashboardGeneralTab({ data, onChange }: Props) {
  return (
    <div className="dash-tab" id="dash-general">
      <h2 className="text-3xl font-bold mb-6">Général</h2>
      <div className="bg-guns-card border border-guns-border rounded-xl p-6 space-y-4 max-w-2xl">
        <div>
          <label className="block text-xs text-gray-500 font-bold mb-2">Nom d'affichage</label>
          <input
            type="text"
            className="input-guns"
            value={data.displayName}
            onChange={(e) => onChange('displayName', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 font-bold mb-2">Bio / Sous-titre</label>
          <input type="text" className="input-guns" value={data.bio} onChange={(e) => onChange('bio', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 font-bold mb-2">Texte d'entrée</label>
          <input
            type="text"
            className="input-guns"
            value={data.enterText}
            onChange={(e) => onChange('enterText', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
