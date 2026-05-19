'use client';
import { useEffect, useState } from 'react';

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [dot, setDot] = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    let mouseX = -100, mouseY = -100;
    let dotX = -100, dotY = -100;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setPos({ x: mouseX, y: mouseY });

      const target = e.target as HTMLElement;
      const isHoverable = target.closest('a, button, [data-hover]');
      setHovering(!!isHoverable);
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const animate = () => {
      dotX += (mouseX - dotX) * 0.15;
      dotY += (mouseY - dotY) * 0.15;
      setDot({ x: dotX, y: dotY });
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Glow ring — follows mouse instantly */}
      <div style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: hovering ? 48 : clicking ? 20 : 32,
        height: hovering ? 48 : clicking ? 20 : 32,
        border: `1px solid ${hovering ? '#3b82f6' : 'rgba(255,255,255,0.4)'}`,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'width 0.2s, height 0.2s, border-color 0.2s',
        mixBlendMode: 'difference',
      }} />

      {/* Dot — follows with lag */}
      <div style={{
        position: 'fixed',
        left: dot.x,
        top: dot.y,
        width: clicking ? 6 : 4,
        height: clicking ? 6 : 4,
        background: hovering ? '#3b82f6' : '#ffffff',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'width 0.15s, height 0.15s, background 0.2s',
      }} />

      {/* Large ambient glow */}
      <div style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 9998,
      }} />
    </>
  );
}