import { useEffect, useRef } from 'react';

export function useAuthBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return undefined;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let particles = [];
    let width = 0;
    let height = 0;
    let frame;
    let previousTime = 0;
    let previousRatio = 0;
    let previousMotion;

    const draw = (time) => {
      const step = previousTime ? Math.min((time - previousTime) / 16.67, 3) : 0;
      previousTime = time;
      context.clearRect(0, 0, width, height);
      const breath = motion.matches ? 0.5 : 0.5 + 0.5 * Math.sin(time / 2800);
      const crossX = width * 0.82;
      const crossY = height * 0.35;
      const crossSize = Math.min(width * 0.16, 90);
      const elapsed = motion.matches ? 0 : time / 1000;

      // Broad, translucent rays keep the light behind the content.
      context.save();
      context.globalCompositeOperation = 'screen';
      for (let ray = 0; ray < 4; ray += 1) {
        const origin = width * (0.55 + ray * 0.15);
        const sway = Math.sin(elapsed / 6 + ray * 1.7) * width * 0.09;
        const light = context.createLinearGradient(origin, 0, origin - width * 0.3, height);
        light.addColorStop(0, 'rgba(234, 219, 167, 0)');
        light.addColorStop(0.15, `rgba(234, 219, 167, ${0.04 + breath * 0.025})`);
        light.addColorStop(1, 'rgba(234, 219, 167, 0)');
        context.fillStyle = light;
        context.beginPath();
        context.moveTo(origin, -20);
        context.lineTo(origin + width * 0.035, -20);
        context.lineTo(origin - width * 0.18 + sway, height);
        context.lineTo(origin - width * 0.5 + sway, height);
        context.closePath();
        context.fill();
      }
      context.restore();

      context.save();
      context.strokeStyle = `rgba(234, 219, 167, ${0.22 + breath * 0.1})`;
      context.lineWidth = 1.5;
      context.shadowColor = '#eadba7';
      context.shadowBlur = 28 + breath * 18;
      context.beginPath();
      context.moveTo(crossX, crossY - crossSize);
      context.lineTo(crossX, crossY + crossSize * 1.6);
      context.moveTo(crossX - crossSize * 0.65, crossY);
      context.lineTo(crossX + crossSize * 0.65, crossY);
      context.stroke();
      context.lineWidth = 7;
      context.globalAlpha = 0.12;
      context.stroke();
      context.restore();

      particles.forEach((particle) => {
        if (!motion.matches) {
          particle.y -= particle.speed * step;
          particle.x += Math.sin(time / 1600 + particle.phase) * 0.22 * step;
          if (particle.x < -4) particle.x = width + 4;
          if (particle.x > width + 4) particle.x = -4;
          if (particle.y < -4) particle.y = height + 4;
        }
        const opacity = particle.opacity * (motion.matches ? 1 : 0.7 + 0.3 * Math.sin(time / 1500 + particle.phase));
        context.globalAlpha = opacity;
        context.drawImage(particle.sprite, particle.x - 12, particle.y - 12, 24, 24);
        context.globalAlpha = 1;
      });
      if (!motion.matches) frame = requestAnimationFrame(draw);
    };

    const resize = () => {
      const bounds = canvas.parentElement.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      if (width === bounds.width && height === bounds.height && previousRatio === ratio && previousMotion === motion.matches) return;
      cancelAnimationFrame(frame);
      previousRatio = ratio;
      previousMotion = motion.matches;
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: Math.min(85, Math.max(36, Math.floor(width * height / 12000))) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.4 + Math.random() * 1.2,
        opacity: 0.12 + Math.random() * 0.3,
        speed: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      }));
      // Cache each glow once; drawing a sprite preserves its shape without recomputing a blur every frame.
      particles.forEach((particle) => {
        const sprite = document.createElement('canvas');
        sprite.width = sprite.height = 24 * ratio;
        const brush = sprite.getContext('2d');
        brush.scale(ratio, ratio);
        brush.fillStyle = 'rgb(234, 219, 167)';
        brush.shadowColor = 'rgba(234, 219, 167, 0.5)';
        brush.shadowBlur = particle.radius > 1 ? 6 : 0;
        brush.beginPath();
        brush.arc(12, 12, particle.radius, 0, Math.PI * 2);
        brush.fill();
        particle.sprite = sprite;
      });
      previousTime = 0;
      frame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement);
    motion.addEventListener('change', resize);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener('change', resize);
    };
  }, []);

  return canvasRef;
}
