import { UserData } from '../lib/usersDB';

interface Props {
  data: UserData;
  onChange: <K extends keyof UserData>(field: K, value: UserData[K]) => void;
  onFile: (type: keyof Pick<UserData, 'background' | 'music' | 'avatar' | 'albumArt' | 'cursorImage'>, file: File) => void;
}

const effectsOptions = [
  { label: 'Slide Up', value: 'slide' },
  { label: 'Fade In', value: 'fade' },
  { label: 'Zoom In', value: 'zoom' },
  { label: 'Flip 3D', value: 'flip' },
  { label: 'Bounce', value: 'bounce' }
];

export default function DashboardVisualsTab({ data, onChange, onFile }: Props) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const file = e.target.files?.[0];
    if (file) onFile(field, file);
  };

  return (
    <div className="dash-tab" id="dash-visuals">
      <h2 className="text-3xl font-bold mb-6">Visuels Premium</h2>
      <div className="max-w-4xl space-y-6">
        <div className="bg-guns-card border border-guns-border rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 border-b border-guns-border pb-2">Assets</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FileTile label="Background" icon="fas fa-image" accept="image/*,video/mp4" onChange={(e) => handleFile(e, 'background')} />
            <FileTile label="Audio" icon="fas fa-music" accept="audio/*" onChange={(e) => handleFile(e, 'music')} />
            <FileTile label="Avatar" icon="fas fa-user-circle" accept="image/*" onChange={(e) => handleFile(e, 'avatar')} />
            <FileTile label="Album Art" icon="fas fa-compact-disc" accept="image/*" onChange={(e) => handleFile(e, 'albumArt')} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 font-bold mb-2">Titre Musique</label>
              <input
                type="text"
                className="input-guns"
                value={data.songTitle}
                onChange={(e) => onChange('songTitle', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-bold mb-2">Artiste</label>
              <input
                type="text"
                className="input-guns"
                value={data.songArtist}
                onChange={(e) => onChange('songArtist', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-guns-card border border-guns-border rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 border-b border-guns-border pb-2">Effets</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="text-sm font-bold">Animation d'entrée</span>
              <select
                className="bg-black border border-gray-700 text-white text-sm rounded-lg p-1.5 focus:border-guns-primary outline-none"
                value={data.animationType}
                onChange={(e) => onChange('animationType', e.target.value as any)}
              >
                {effectsOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <ToggleRow label="Effet Neige" checked={data.snowEffect} onChange={(v) => onChange('snowEffect', v)} />
            <ToggleRow label="Tilt 3D" checked={data.tiltEffect} onChange={(v) => onChange('tiltEffect', v)} />
            <div className="border-t border-gray-800 pt-2 mt-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold">Traînée Souris</span>
                <input type="checkbox" className="accent-guns-primary" checked={data.cursorTrail} onChange={(e) => onChange('cursorTrail', e.target.checked)} />
              </div>
              <div className="flex items-center gap-4">
                <label className="text-xs text-gray-500 flex-1">Image Particule (PNG)</label>
                <div className="relative overflow-hidden inline-block">
                  <button className="bg-white/5 hover:bg-white/10 text-white text-xs py-1 px-3 rounded border border-white/20 transition">
                    Upload Image
                  </button>
                  <input type="file" accept="image/*" className="absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer" onChange={(e) => handleFile(e, 'cursorImage')} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-guns-card border border-guns-border rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 border-b border-guns-border pb-2">Couleurs</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 font-bold mb-2">Accent</label>
              <input type="color" className="w-full h-10 bg-transparent cursor-pointer" value={data.accentColor} onChange={(e) => onChange('accentColor', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-bold mb-2">Texte</label>
              <input type="color" className="w-full h-10 bg-transparent cursor-pointer" value={data.textColor} onChange={(e) => onChange('textColor', e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileTile({ label, icon, accept, onChange }: { label: string; icon: string; accept: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="relative group cursor-pointer border border-dashed border-gray-700 rounded-xl h-32 flex flex-col items-center justify-center hover:border-guns-primary hover:bg-white/5 transition">
      <i className={`${icon} text-2xl text-gray-500 mb-2`}></i>
      <span className="text-xs font-bold">{label}</span>
      <input type="file" accept={accept} className="absolute inset-0 opacity-0 cursor-pointer" onChange={onChange} />
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-bold">{label}</span>
      <input type="checkbox" className="accent-guns-primary" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </div>
  );
}
