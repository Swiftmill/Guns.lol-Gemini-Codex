import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { UserData, getUsersDB, getUserData, incrementViews, ensureDefaultAdmin } from '../lib/usersDB';
import { initCursorTrail, initTilt, startSnow } from '../lib/profileEffects';

ensureDefaultAdmin();

export default function ProfilePage() {
  const { username: usernameParam } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState<UserData | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const snowRef = useRef<{ stop: () => void } | null>(null);
  const cursorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const trailDispose = useRef<{ dispose: () => void } | null>(null);

  const targetUser = useMemo(() => searchParams.get('user') || usernameParam, [searchParams, usernameParam]);

  useEffect(() => {
    if (!targetUser) return;
    const userData = getUserData(targetUser) || getUsersDB()[targetUser]?.data || null;
    if (!userData) {
      alert('Utilisateur introuvable');
      navigate('/');
      return;
    }
    setData(userData);
    incrementViews(targetUser);
  }, [navigate, targetUser]);

  useEffect(() => {
    if (!data) return;
    if (data.snowEffect && snowRef.current === null && document.getElementById('snow-canvas')) {
      snowRef.current = startSnow(document.getElementById('snow-canvas') as HTMLCanvasElement);
    }
    if (cursorCanvasRef.current) {
      trailDispose.current?.dispose();
      trailDispose.current = initCursorTrail(cursorCanvasRef.current, {
        cursorTrail: data.cursorTrail,
        cursorImage: data.cursorImage,
        accentColor: data.accentColor
      });
    }
    if (cardRef.current && data.tiltEffect) {
      initTilt(cardRef.current);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      snowRef.current?.stop();
      trailDispose.current?.dispose();
    };
  }, []);

  if (!data) return null;

  const isVideo = data.background && (data.background.includes('data:video') || data.background.endsWith('.mp4'));

  const handleEnter = () => {
    setShowCard(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.muted = false;
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => undefined);
    }
    if (videoRef.current && isVideo) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => undefined);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) audioRef.current.play();
    else audioRef.current.muted = !audioRef.current.muted;
    setMuted(audioRef.current.muted);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) audioRef.current.play();
    else audioRef.current.pause();
  };

  useEffect(() => {
    const audio = audioRef.current;
    const progress = document.getElementById('player-progress-bar') as HTMLDivElement | null;
    const timeDisplay = document.getElementById('player-time-display');
    const playIconHolder = document.querySelector('#profile-panel .fa-play, #profile-panel .fa-pause') as HTMLElement | null;
    if (!audio) return;
    const onTime = () => {
      if (!audio.duration) return;
      const percent = (audio.currentTime / audio.duration) * 100;
      if (progress) progress.style.width = `${percent}%`;
      const curMins = Math.floor(audio.currentTime / 60);
      const curSecs = Math.floor(audio.currentTime % 60)
        .toString()
        .padStart(2, '0');
      const durMins = Math.floor(audio.duration / 60);
      const durSecs = Math.floor(audio.duration % 60)
        .toString()
        .padStart(2, '0');
      if (timeDisplay) timeDisplay.textContent = `${curMins}:${curSecs} / ${durMins}:${durSecs}`;
    };
    const onPlay = () => {
      playIconHolder?.classList.remove('fa-play');
      playIconHolder?.classList.add('fa-pause');
    };
    const onPause = () => {
      playIconHolder?.classList.remove('fa-pause');
      playIconHolder?.classList.add('fa-play');
    };
    const onEnd = () => {
      audio.currentTime = 0;
      audio.play().catch(() => undefined);
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnd);
    };
  }, [data]);

  return (
    <section id="view-profile" className="view-section min-h-screen relative flex-col items-center justify-center overflow-hidden active">
      <canvas id="cursor-canvas" ref={cursorCanvasRef}></canvas>
      <audio id="global-audio" ref={audioRef} src={data.music} loop crossOrigin="anonymous"></audio>
      <canvas id="snow-canvas"></canvas>
      <div id="profile-bg-container" className="absolute inset-0 z-0">
        <div
          id="profile-bg-layer"
          className="absolute inset-0 bg-black bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: isVideo ? undefined : data.background ? `url(${data.background})` : undefined }}
        ></div>
        <video id="bg-video" loop muted playsInline className={isVideo ? '' : 'hidden'} ref={videoRef} src={isVideo ? data.background : undefined}></video>
      </div>
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {!showCard && (
        <div
          id="enter-overlay"
          onClick={handleEnter}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer"
        >
          <div className="animate-pulse-glow text-white text-2xl font-mono" style={{ textShadow: `0 0 15px ${data.accentColor}` }}>
            {data.enterText || 'click...'}
          </div>
        </div>
      )}

      <button onClick={() => navigate('/dashboard')} className="fixed top-4 left-4 z-[60] bg-black/50 text-white/70 px-3 py-1 rounded backdrop-blur text-xs border border-white/10 hover:text-white">
        <i className="fas fa-arrow-left mr-1"></i> Dashboard
      </button>

      <div
        id="profile-card-container"
        className={`relative z-20 w-full flex items-center justify-center perspective-container ${showCard ? data.animationType === 'slide' ? 'anim-slide' : data.animationType === 'fade' ? 'anim-fade' : data.animationType === 'zoom' ? 'anim-zoom' : data.animationType === 'flip' ? 'anim-flip' : 'anim-bounce' : 'opacity-0 scale-95 hidden'}`}
      >
        <div
          id="profile-panel"
          ref={cardRef}
          className="glass-panel tilt-card rounded-3xl w-[400px] p-0 relative overflow-hidden flex flex-col items-center text-center pb-6"
          style={{ background: `rgba(10,10,10,${(data.opacity || 90) / 100})`, ['--blur-amount' as any]: `${data.blur || 10}px` }}
        >
          <div className="w-full h-32 bg-gradient-to-b from-white/5 to-transparent"></div>
          <div className="relative -mt-16 mb-3">
            <div id="avatar-glow" className="absolute -inset-1 rounded-full opacity-0 blur-lg transition-opacity duration-300"></div>
            <img id="display-avatar" src={data.avatar} className="relative w-32 h-32 rounded-full border-[3px] border-[#121212] object-cover shadow-2xl bg-black" />
          </div>
          <h1 id="display-name" className="text-2xl font-bold text-white drop-shadow-md mb-1 tracking-wide" style={{ color: data.textColor, textShadow: `0 0 15px ${data.accentColor}` }}>
            {data.displayName}
          </h1>
          <div id="display-badges" className="flex justify-center gap-2 mb-3 flex-wrap min-h-[20px] px-4">
            {(data.badges || []).map((b) => (
              <i key={b} className={`${badgeIcon(b)} mx-1 drop-shadow-sm text-sm`} style={{ color: badgeColor(b) }}></i>
            ))}
          </div>
          <div className="mb-2">
            <p id="display-bio" className="font-mono text-xs text-gray-300 uppercase tracking-widest">
              {data.bio}
            </p>
          </div>
          <div className="text-white/80 text-xl mb-4 flex items-center gap-2 decoration-wings"></div>
          <div id="display-links" className="flex flex-wrap justify-center gap-3 w-full px-8 mb-6">
            {(data.links || []).map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                className="bg-transparent p-2 hover:scale-110 transition flex items-center justify-center"
                rel="noreferrer"
              >
                <i className={`${socialIcon(link.type)} text-2xl text-white drop-shadow-md`}></i>
              </a>
            ))}
          </div>

          <div className="w-full px-6 mt-auto">
            <div className="bg-black/40 rounded-xl p-3 flex items-center gap-3 border border-white/5">
              <div
                className="w-10 h-10 bg-white/10 rounded overflow-hidden relative flex-shrink-0 cursor-pointer hover:opacity-80 transition"
                onClick={togglePlayPause}
              >
                {data.albumArt ? (
                  <img src={data.albumArt} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fas fa-play text-white/50 text-xs"></i>
                  </div>
                )}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div id="player-song-name" className="text-[10px] text-white font-bold truncate">
                  {data.songTitle || 'Unknown Track'}
                </div>
                <div id="player-artist-name" className="text-[9px] text-gray-500 truncate">
                  {data.songArtist || 'Unknown Artist'}
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full mt-1 relative overflow-hidden">
                  <div id="player-progress-bar" className="absolute top-0 left-0 h-full bg-white/80 w-0 transition-all duration-100"></div>
                </div>
              </div>
              <div id="player-time-display" className="text-white/50 text-[9px] font-mono">
                {/* handled via audio events */}
              </div>
            </div>
          </div>
          <div className="mt-4 text-[9px] text-gray-600 font-mono flex items-center gap-2">
            <i className="fas fa-eye"></i> <span id="display-views">{data.views?.toLocaleString()}</span>
          </div>
        </div>
      </div>
      {showCard && (
        <div id="volume-control" className="fixed bottom-8 right-8 z-40">
          <button
            onClick={toggleMute}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition"
          >
            <i className={`fas ${muted ? 'fa-volume-mute' : 'fa-volume-up'}`} id="vol-icon"></i>
          </button>
        </div>
      )}
    </section>
  );
}

function badgeIcon(b: string) {
  if (b === 'verified') return 'fas fa-check-circle';
  if (b === 'premium') return 'fas fa-gem';
  if (b === 'staff') return 'fas fa-gavel';
  if (b === 'dev') return 'fas fa-code';
  if (b === 'og') return 'fas fa-crown';
  return 'fas fa-certificate';
}

function badgeColor(b: string) {
  if (b === 'staff') return '#ef4444';
  if (b === 'dev') return '#ffffff';
  if (b === 'og') return '#ffffff';
  return '#ffffff';
}

function socialIcon(type: string) {
  if (type === 'discord') return 'fab fa-discord';
  if (type === 'instagram') return 'fab fa-instagram';
  if (type === 'twitter') return 'fab fa-twitter';
  return 'fas fa-link';
}
