'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../../app/providers';

type RemoteCursor = { userId: string; name: string; color: string; cursor: { x: number; y: number } };
type PresenceUser = { id: string; name: string; email: string; color: string };

interface PresenceCursorsProps {
  projectId: string;
  pageId: string;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export function PresenceCursors({ projectId, pageId, canvasRef }: PresenceCursorsProps) {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [cursors, setCursors] = useState<Map<string, RemoteCursor>>(new Map());
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);

  useEffect(() => {
    if (!user) return;

    const socket = io('http://localhost:3001/realtime', {
      query: { userId: user.id, userName: user.name || user.email, userEmail: user.email },
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('presence:join', {
        projectId,
        pageId,
        user: { id: user.id, name: user.name || user.email, email: user.email },
      });
    });

    socket.on('presence:users', (users: PresenceUser[]) => {
      setOnlineUsers(users.filter((u) => u.id !== user.id));
    });

    socket.on('cursor:moved', (data: RemoteCursor) => {
      setCursors((prev) => {
        const next = new Map(prev);
        next.set(data.userId, data);
        return next;
      });
    });

    return () => {
      socket.emit('presence:leave');
      socket.disconnect();
    };
  }, [user, projectId, pageId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !socketRef.current) return;

    function handleMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      socketRef.current?.emit('cursor:move', { x, y });
    }

    canvas.addEventListener('mousemove', handleMouseMove);
    return () => canvas.removeEventListener('mousemove', handleMouseMove);
  }, [canvasRef]);

  return (
    <>
      {onlineUsers.length > 0 && (
        <div style={usersBarStyle}>
          {onlineUsers.map((u) => (
            <div key={u.id} style={avatarStyle(u.color)} title={u.name}>
              {u.name.charAt(0).toUpperCase()}
            </div>
          ))}
          <span style={onlineLabel}>{onlineUsers.length + 1} online</span>
        </div>
      )}

      {Array.from(cursors.values()).map((c) => (
        <div key={c.userId} style={cursorStyle(c.cursor.x, c.cursor.y, c.color)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill={c.color}>
            <path d="M0 0L16 6L8 8L6 16L0 0Z" />
          </svg>
          <span style={cursorLabel(c.color)}>{c.name}</span>
        </div>
      ))}
    </>
  );
}

export function usePresenceBlockSelect(socketRef: React.RefObject<Socket | null>) {
  return (blockId: string | null) => {
    socketRef.current?.emit('block:select', { blockId });
  };
}

const usersBarStyle: React.CSSProperties = { position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4, alignItems: 'center', zIndex: 100 };
const avatarStyle = (color: string): React.CSSProperties => ({
  width: 28, height: 28, borderRadius: '50%', background: color, color: '#fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '0.7rem', fontWeight: 700, border: '2px solid #fff',
});
const onlineLabel: React.CSSProperties = { fontSize: '0.7rem', color: '#64748b', marginLeft: 4 };
const cursorStyle = (x: number, y: number, color: string): React.CSSProperties => ({
  position: 'absolute', left: x, top: y, pointerEvents: 'none', zIndex: 999,
  transition: 'left 0.1s ease, top 0.1s ease',
});
const cursorLabel = (color: string): React.CSSProperties => ({
  position: 'absolute', top: 16, left: 12, padding: '2px 6px', borderRadius: 4,
  background: color, color: '#fff', fontSize: '0.65rem', fontWeight: 600, whiteSpace: 'nowrap',
});
