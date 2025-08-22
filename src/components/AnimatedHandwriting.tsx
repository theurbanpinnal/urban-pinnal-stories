import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface AnimatedHandwritingProps {
  text: string;
  duration?: number; // in ms
  audioSrc?: string;
  className?: string;
  triggerOnView?: boolean;
}

const AnimatedHandwriting = ({
  text,
  duration = 3000,
  audioSrc,
  className,
  triggerOnView = true,
}: AnimatedHandwritingProps) => {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUnlockedRef = useRef(false);

  // Prepare audio element
  useEffect(() => {
    if (!audioSrc) return;
    const audio = new Audio(audioSrc);
    audio.crossOrigin = "anonymous";
    audio.volume = 0.8;
    audio.loop = true;
    audioRef.current = audio;

    // Try to unlock audio on first user gesture
    const unlock = () => {
      if (!audioRef.current) return;
      const a = audioRef.current;
      const prevMuted = a.muted;
      a.muted = true;
      a.play().then(() => {
        a.pause();
        a.currentTime = 0;
        a.muted = prevMuted;
        audioUnlockedRef.current = true;
      }).catch(() => {
        // ignore; will show prompt if needed later
      });
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [audioSrc]);

  const tryPlayAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // Autoplay blocked; silently ignore.
    });
  };

  // Start typing + audio
  useEffect(() => {
    const start = () => {
      if (started) return;
      setStarted(true);
      if (audioSrc) {
        if (audioUnlockedRef.current) {
          tryPlayAudio();
        } else {
          // Attempt; if blocked, show prompt
          tryPlayAudio();
        }
        // stop after duration
        const stopId = setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        }, duration);
        return () => clearTimeout(stopId);
      }
    };

    if (!triggerOnView) {
      return start();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            start();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [audioSrc, duration, started, triggerOnView]);

  const chars = text.length;
  const typingStyle: React.CSSProperties = started
    ? {
        animation: `typing ${duration}ms steps(${chars}, end) forwards` as any,
      }
    : {};

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        ref={containerRef}
        className={cn(
          "inline-block overflow-hidden whitespace-nowrap", // no caret
        )}
        style={typingStyle}
      >
        {text}
      </span>
      {/* no UI fallback for blocked audio */}
    </span>
  );
};

export default AnimatedHandwriting;

// CSS keyframes (global) – ensure to add these to index.css if not already
// @layer utilities {
//   @keyframes typing {
//     from { width: 0; }
//     to   { width: 100%; }
//   }
//   @keyframes blink {
//     50% { border-color: transparent; }
//   }
// }
