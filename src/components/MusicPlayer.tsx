"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Music } from "lucide-react";
import styles from "./MusicPlayer.module.css";
import { tracks, playerNotes, AUTOPLAY_DELAY_MS } from "@/data/music";
import { trackEvent, type MusicTrigger } from "@/lib/analytics";

type Status = "idle" | "playing" | "paused" | "unavailable";

const PAUSED_KEY = "music-paused";
// Matches the CSS: the widget shows only on mouse screens 1100px+ wide (it would collide with the
// centred window below that), and nothing streams where it is hidden.
const DESKTOP_QUERY = "(min-width: 1100px) and (pointer: fine)";
const SEEK_STEP_S = 5;

// SF Symbols-style glyphs: sharp shapes with slightly rounded corners (stroke + round join).
const glyph = { fill: "currentColor", stroke: "currentColor", strokeWidth: 1.6, strokeLinejoin: "round" as const };

const BackwardIcon = () => (
  <svg width="26" height="24" viewBox="0 0 26 24" aria-hidden="true">
    <path d="M12.2 6 3 12l9.2 6z" {...glyph} />
    <path d="M23 6l-9.2 6L23 18z" {...glyph} />
  </svg>
);

const ForwardIcon = () => (
  <svg width="26" height="24" viewBox="0 0 26 24" aria-hidden="true">
    <path d="M3 6l9.2 6L3 18z" {...glyph} />
    <path d="M13.8 6 23 12l-9.2 6z" {...glyph} />
  </svg>
);

const PlayIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 4.8 19.2 12 7 19.2z" {...glyph} />
  </svg>
);

const PauseIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="6" y="4.5" width="4.2" height="15" rx="1.2" fill="currentColor" />
    <rect x="13.8" y="4.5" width="4.2" height="15" rx="1.2" fill="currentColor" />
  </svg>
);

const SpeakerIcon = ({ muted }: { muted: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 9.2h3.4L12 5.5v13l-4.6-3.7H4z" {...glyph} strokeWidth={1.4} />
    {muted ? (
      <path d="m15.5 9.5 5 5m0-5-5 5" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" fill="none" />
    ) : (
      <path
        d="M15.3 9.2a4 4 0 0 1 0 5.6M17.8 6.8a7.4 7.4 0 0 1 0 10.4"
        stroke="currentColor"
        strokeWidth={1.9}
        strokeLinecap="round"
        fill="none"
      />
    )}
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth={1.8} />
    <path d="M12 10.8v5.4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    <circle cx="12" cy="7.6" r="1.2" fill="currentColor" />
  </svg>
);

const formatTime = (s: number) =>
  Number.isFinite(s) && s >= 0 ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "--:--";

const press = { scale: 0.86 };
const spring = { type: "spring", stiffness: 500, damping: 32 } as const;
// Cover slides in the direction you skipped
const coverSlide = {
  enter: (dir: number) => ({ x: dir * 28, opacity: 0 }),
  exit: (dir: number) => ({ x: dir * -28, opacity: 0 }),
};
const faceFlip = {
  initial: { rotateY: -90, opacity: 0 },
  animate: { rotateY: 0, opacity: 1 },
  exit: { rotateY: 90, opacity: 0 },
  transition: { duration: 0.18, ease: "easeInOut" },
} as const;

// macOS small Music widget: autoplays muted after the boot screen; the speaker button unmutes.
export default function MusicPlayer() {
  // A <video> element plays the MP3: browsers only grant muted autoplay to video, not <audio>.
  const audioRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<number | null>(null);
  const doneRef = useRef<HTMLButtonElement>(null);
  const infoRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef(false);

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [status, setStatus] = useState<Status>("idle");
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState({ current: 0, duration: 0 });
  const [scrub, setScrub] = useState<number | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  // Why the next playback started; read in onPlay so only real starts are tracked
  const playTriggerRef = useRef<MusicTrigger>("autoplay");

  const track = tracks[index];
  const isPlaylist = tracks.length > 1;

  // Start muted after the boot screen, unless this visitor paused it last time.
  useEffect(() => {
    const timer = setTimeout(() => {
      const audio = audioRef.current;
      if (!audio || !window.matchMedia(DESKTOP_QUERY).matches) return;
      try {
        if (localStorage.getItem(PAUSED_KEY) === "1") return;
      } catch {
        // storage blocked: fall through and autoplay muted
      }
      audio.muted = true;
      playTriggerRef.current = "autoplay";
      audio.play().catch((err: DOMException) => {
        if (err.name !== "NotAllowedError") {
          setStatus((s) => (s === "unavailable" ? s : "paused"));
          return;
        }
        // Browser still blocked muted autoplay: start (muted) on the visitor's first interaction.
        const start = () => {
          removeListeners();
          if (!audio.paused) return;
          playTriggerRef.current = "first_interaction";
          audio.play().catch(() => setStatus((s) => (s === "unavailable" ? s : "paused")));
        };
        document.addEventListener("pointerdown", start, true);
        document.addEventListener("keydown", start, true);
        removeListeners = () => {
          document.removeEventListener("pointerdown", start, true);
          document.removeEventListener("keydown", start, true);
        };
      });
    }, AUTOPLAY_DELAY_MS);
    let removeListeners = () => {};
    return () => {
      clearTimeout(timer);
      removeListeners();
    };
  }, []);

  const rememberPaused = (paused: boolean) => {
    try {
      localStorage.setItem(PAUSED_KEY, paused ? "1" : "0");
    } catch {
      // storage blocked: preference just isn't remembered
    }
  };

  // Ramp volume so sound never starts or stops abruptly.
  const fadeTo = (target: number, ms: number, done?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    const from = audio.volume;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      audio.volume = from + (target - from) * p;
      if (p < 1) {
        fadeRef.current = requestAnimationFrame(step);
      } else {
        fadeRef.current = null;
        done?.();
      }
    };
    fadeRef.current = requestAnimationFrame(step);
  };

  const play = (trigger: MusicTrigger) => {
    const audio = audioRef.current;
    if (!audio) return;
    playTriggerRef.current = trigger;
    if (!audio.muted) {
      audio.volume = 0;
      fadeTo(1, 300);
    }
    audio.play().catch(() => setStatus("paused"));
    rememberPaused(false);
  };

  const pause = (trigger: "pause_button" | "media_key") => {
    const audio = audioRef.current;
    if (!audio) return;
    trackEvent("Paused Music", {
      track_title: track.title,
      trigger,
      seconds_into_track: Math.round(audio.currentTime),
    });
    setStatus("paused");
    rememberPaused(true);
    if (audio.muted) {
      audio.pause();
    } else {
      fadeTo(0, 200, () => {
        audio.pause();
        audio.volume = 1;
      });
    }
  };

  const togglePlay = () => (audioRef.current?.paused ? play("play_button") : pause("pause_button"));

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const seconds_into_track = Math.round(audio.currentTime);
    if (muted) {
      trackEvent("Unmuted Music", { track_title: track.title, seconds_into_track });
      setMuted(false);
      audio.volume = 0;
      audio.muted = false;
      if (audio.paused) {
        playTriggerRef.current = "unmute";
        audio.play().catch(() => setStatus("paused"));
        rememberPaused(false);
      }
      fadeTo(1, 400);
    } else {
      trackEvent("Muted Music", { track_title: track.title, seconds_into_track });
      setMuted(true);
      fadeTo(0, 250, () => {
        audio.muted = true;
        audio.volume = 1;
      });
    }
  };

  // Let React own the media src: setting it by hand here made React re-assign it on render,
  // which restarted the load and aborted play(). Play once the new src is committed instead.
  const pendingPlayRef = useRef(false);

  const goTo = (i: number, dir: number) => {
    setDirection(dir);
    setIndex((i + tracks.length) % tracks.length);
    setTime({ current: 0, duration: 0 });
    pendingPlayRef.current = true;
  };

  const playAfterTrackChange = useEffectEvent(() => play("track_change"));

  useEffect(() => {
    if (!pendingPlayRef.current) return;
    pendingPlayRef.current = false;
    playAfterTrackChange();
  }, [index]);

  const restart = (trigger: "button" | "media_key") => {
    const audio = audioRef.current;
    if (!audio) return;
    trackEvent("Restarted Track", { track_title: track.title, trigger });
    audio.currentTime = 0;
    setTime((t) => ({ ...t, current: 0 }));
    if (audio.paused) play("play_button");
  };

  const skip = (direction: "next" | "previous", trigger: "button" | "media_key") => {
    const step = direction === "next" ? 1 : -1;
    const toIndex = (index + step + tracks.length) % tracks.length;
    trackEvent("Skipped Track", { from_track: track.title, to_track: tracks[toIndex].title, direction, trigger });
    goTo(index + step, step);
  };

  // Like Apple Music: back restarts the song unless you're in its first 3 seconds.
  const previous = (trigger: "button" | "media_key" = "button") => {
    if (!isPlaylist || (audioRef.current?.currentTime ?? 0) > 3) restart(trigger);
    else skip("previous", trigger);
  };

  const next = (trigger: "button" | "media_key" = "button") =>
    isPlaylist ? skip("next", trigger) : restart(trigger);

  const handlePlay = () => {
    setStatus("playing");
    trackEvent("Played Music", { track_title: track.title, trigger: playTriggerRef.current });
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album ?? "",
        artwork: track.cover ? [{ src: track.cover, sizes: "512x512" }] : [],
      });
      navigator.mediaSession.setActionHandler("play", () => play("media_key"));
      navigator.mediaSession.setActionHandler("pause", () => pause("media_key"));
      navigator.mediaSession.setActionHandler("previoustrack", () => previous("media_key"));
      navigator.mediaSession.setActionHandler("nexttrack", () => next("media_key"));
    }
  };

  // --- Scrubbing ---
  const hasDuration = Number.isFinite(time.duration) && time.duration > 0;

  const timeAt = (clientX: number) => {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) * time.duration;
  };

  const seekTo = (seconds: number, method: "pointer" | "keyboard") => {
    const audio = audioRef.current;
    if (!audio || !hasDuration) return;
    const t = Math.min(time.duration - 0.25, Math.max(0, seconds));
    trackEvent("Seeked Track", {
      track_title: track.title,
      from_seconds: Math.round(audio.currentTime),
      to_seconds: Math.round(t),
      method,
    });
    audio.currentTime = t;
    setTime((prev) => ({ ...prev, current: t }));
  };

  const onBarPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hasDuration) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setScrub(timeAt(e.clientX));
  };

  const onBarPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (scrub !== null) setScrub(timeAt(e.clientX));
  };

  const onBarPointerUp = () => {
    if (scrub === null) return;
    seekTo(scrub, "pointer");
    setScrub(null);
  };

  const onBarKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const current = audioRef.current?.currentTime ?? 0;
    const target: Record<string, number> = {
      ArrowRight: current + SEEK_STEP_S,
      ArrowUp: current + SEEK_STEP_S,
      ArrowLeft: current - SEEK_STEP_S,
      ArrowDown: current - SEEK_STEP_S,
      Home: 0,
      End: time.duration,
    };
    if (!(e.key in target) || !hasDuration) return;
    e.preventDefault();
    seekTo(target[e.key], "keyboard");
  };

  // --- Product notes (back of the widget) ---
  const openNotes = () => {
    trackEvent("Opened Product Notes", { track_title: track.title });
    setShowNotes(true);
  };
  const closeNotes = (method: "done" | "escape") => {
    trackEvent("Closed Product Notes", { method });
    returnFocusRef.current = true;
    setShowNotes(false);
  };

  // Missing or broken file: hide on the live site, explain in dev.
  if (status === "unavailable" && process.env.NODE_ENV === "production") return null;

  const isPlaying = status === "playing";
  const shown = scrub ?? time.current;
  const progress = hasDuration ? Math.min(1, shown / time.duration) : 0;
  const subtitle = [track.artist, track.album].filter(Boolean).join(" • ");

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        className={styles.widget}
        aria-label="Music player"
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.4, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        onKeyDown={(e) => e.key === "Escape" && showNotes && closeNotes("escape")}
      >
        <video
          ref={audioRef}
          className={styles.media}
          aria-hidden="true"
          tabIndex={-1}
          src={track.src}
          loop={!isPlaylist}
          muted
          preload="none"
          playsInline
          onPlay={handlePlay}
          onPause={() => setStatus("paused")}
          onEnded={() => {
            trackEvent("Finished Track", { track_title: track.title });
            if (isPlaylist) goTo(index + 1, 1);
          }}
          onError={() => {
            trackEvent("Failed to Load Track", { track_title: track.title, src: track.src });
            setStatus("unavailable");
          }}
          onLoadedMetadata={(e) => {
            // Read now: React clears e.currentTarget before a functional update runs
            const duration = e.currentTarget.duration;
            setTime((t) => ({ ...t, duration }));
          }}
          onTimeUpdate={(e) => setTime({ current: e.currentTarget.currentTime, duration: e.currentTarget.duration })}
        />

        {status === "unavailable" ? (
          <p className={styles.hint}>
            No track at <code>public{track.src}</code>. Add it and list it in{" "}
            <code>src/data/music.ts</code>. (Dev only.)
          </p>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            {showNotes ? (
              <motion.div
                key="notes"
                className={styles.face}
                {...faceFlip}
                onAnimationComplete={() => doneRef.current?.focus()}
              >
                <div className={styles.notesHeader}>
                  <span className={styles.notesTitle}>Product notes</span>
                  <button ref={doneRef} type="button" className={styles.doneBtn} onClick={() => closeNotes("done")}>
                    Done
                  </button>
                </div>
                <ul className={styles.notesList}>
                  {playerNotes.map((note) => (
                    <li key={note.title}>
                      <strong>{note.title}</strong> {note.body}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <motion.div
                key="player"
                className={styles.face}
                {...faceFlip}
                onAnimationComplete={() => {
                  if (returnFocusRef.current) infoRef.current?.focus();
                  returnFocusRef.current = false;
                }}
              >
                <div className={styles.topRow}>
                  <div className={styles.coverSlot}>
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                      <motion.div
                        key={track.src}
                        className={styles.cover}
                        custom={direction}
                        variants={coverSlide}
                        initial="enter"
                        exit="exit"
                        animate={{ x: 0, opacity: 1, scale: isPlaying ? 1 : 0.88 }}
                        transition={spring}
                      >
                        {track.cover ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={track.cover} alt="" width={58} height={58} />
                        ) : (
                          <Music size={24} color="white" aria-hidden="true" />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className={styles.sideButtons}>
                    <motion.button
                      type="button"
                      className={`${styles.iconBtn} ${muted ? styles.muted : ""}`}
                      onClick={toggleMute}
                      whileTap={press}
                      aria-label={muted ? "Unmute music" : "Mute music"}
                      title={muted ? "Unmute" : "Mute"}
                    >
                      <SpeakerIcon muted={muted} />
                    </motion.button>
                    <motion.button
                      ref={infoRef}
                      type="button"
                      className={`${styles.iconBtn} ${styles.subtle}`}
                      onClick={openNotes}
                      whileTap={press}
                      aria-label="Product notes: why this player works the way it does"
                      title="Product notes"
                    >
                      <InfoIcon />
                    </motion.button>
                  </div>
                </div>

                <div className={styles.info}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={track.src}
                      className={styles.title}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                    >
                      {track.title}
                    </motion.p>
                  </AnimatePresence>
                  <p className={styles.subtitle}>{subtitle}</p>
                </div>

                <div className={styles.progress}>
                  <div
                    ref={barRef}
                    className={styles.bar}
                    data-scrubbing={scrub !== null}
                    role="slider"
                    tabIndex={0}
                    aria-label="Seek"
                    aria-valuemin={0}
                    aria-valuemax={hasDuration ? Math.round(time.duration) : 0}
                    aria-valuenow={Math.round(shown)}
                    aria-valuetext={`${formatTime(shown)} of ${hasDuration ? formatTime(time.duration) : "unknown"}`}
                    onPointerDown={onBarPointerDown}
                    onPointerMove={onBarPointerMove}
                    onPointerUp={onBarPointerUp}
                    onPointerCancel={() => setScrub(null)}
                    onKeyDown={onBarKeyDown}
                  >
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ transform: `scaleX(${progress})` }} />
                    </div>
                    <div className={styles.knob} style={{ left: `${progress * 100}%` }} />
                  </div>
                  <div className={styles.times} aria-hidden="true">
                    <span>{hasDuration ? formatTime(shown) : "0:00"}</span>
                    <span>{hasDuration ? `-${formatTime(time.duration - shown)}` : "--:--"}</span>
                  </div>
                </div>

                <div className={styles.controls}>
                  <motion.button
                    type="button"
                    className={styles.controlBtn}
                    onClick={() => previous()}
                    whileTap={press}
                    aria-label={isPlaylist ? "Previous track" : "Restart track"}
                  >
                    <BackwardIcon />
                  </motion.button>
                  <motion.button
                    type="button"
                    className={styles.controlBtn}
                    onClick={togglePlay}
                    whileTap={press}
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={isPlaying ? "pause" : "play"}
                        className={styles.iconSwap}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.12 }}
                      >
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                      </motion.span>
                    </AnimatePresence>
                  </motion.button>
                  <motion.button
                    type="button"
                    className={styles.controlBtn}
                    onClick={() => next()}
                    whileTap={press}
                    aria-label={isPlaylist ? "Next track" : "Restart track"}
                  >
                    <ForwardIcon />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.section>
    </MotionConfig>
  );
}
