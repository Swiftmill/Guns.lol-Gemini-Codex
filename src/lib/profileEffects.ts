export interface TrailSettings {
  cursorTrail: boolean;
  cursorImage: string;
  accentColor?: string;
}

export function startSnow(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { stop: () => undefined };
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = Array.from({ length: 50 }).map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    d: Math.random() * 10
  }));
  let angle = 0;
  const interval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    for (const p of particles) {
      ctx.moveTo(p.x, p.y);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
    }
    ctx.fill();
    angle += 0.01;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
      p.x += Math.sin(angle) * 2;
      if (p.x > canvas.width + 5 || p.x < -5 || p.y > canvas.height) {
        if (i % 3 > 0) particles[i] = { x: Math.random() * canvas.width, y: -10, r: p.r, d: p.d };
        else if (Math.sin(angle) > 0) particles[i] = { x: -5, y: Math.random() * canvas.height, r: p.r, d: p.d };
        else particles[i] = { x: canvas.width + 5, y: Math.random() * canvas.height, r: p.r, d: p.d };
      }
    }
  }, 33);
  return { stop: () => clearInterval(interval) };
}

export function initTilt(element: HTMLElement) {
  const move = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };
  const leave = () => {
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };
  element.addEventListener('mousemove', move);
  element.addEventListener('mouseleave', leave);
  return { dispose: () => {
    element.removeEventListener('mousemove', move);
    element.removeEventListener('mouseleave', leave);
  } };
}

export function initCursorTrail(canvas: HTMLCanvasElement, settings: TrailSettings) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { dispose: () => undefined };
  let trails: { x: number; y: number; size: number; opacity: number }[] = [];
  const img = new Image();
  let imageLoaded = false;
  if (settings.cursorImage) {
    img.src = settings.cursorImage;
    img.onload = () => (imageLoaded = true);
  }

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const mouseMove = (e: MouseEvent) => {
    if (!settings.cursorTrail) return;
    trails.push({ x: e.clientX, y: e.clientY, size: 15, opacity: 1 });
  };
  window.addEventListener('mousemove', mouseMove);

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!settings.cursorTrail) trails = [];
    for (let i = 0; i < trails.length; i++) {
      const p = trails[i];
      if (settings.cursorImage && imageLoaded) {
        ctx.globalAlpha = p.opacity;
        ctx.drawImage(img, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.globalAlpha = 1;
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,58,237,${p.opacity})`;
        if (settings.accentColor) ctx.fillStyle = `${settings.accentColor}${Math.round(p.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      }
      p.opacity -= 0.02;
      if (p.opacity <= 0) { trails.splice(i, 1); i--; }
    }
    requestAnimationFrame(animate);
  };
  animate();

  return {
    dispose: () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', mouseMove);
    }
  };
}
