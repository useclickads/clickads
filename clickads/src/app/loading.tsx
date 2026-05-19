'use client';
import Link from 'next/link';

export default function Loading() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#0a0a0a]">
      <p className="text-center text-6xl font-light uppercase tracking-widest text-[#a0a0a0]">
        CLICK. TARGET. CONVERT
        <span
          aria-hidden
          style={{ animation: 'blink 1s step-end infinite' }}
          className="inline-block text-[#a0a0a0]"
        >
          |
        </span>
      </p>
      <Link
        href="/"
        className="absolute bottom-6 right-6 text-[10px] text-zinc-600 hover:text-zinc-500 transition-colors"
      >
        Skip
      </Link>
    </div>
  );
}