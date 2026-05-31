"use client";

import React, { useState, useEffect, useRef } from "react";

// Note Frequencies mapping for Hedwig's Theme (Celesta bells)
const FREQS: Record<string, number> = {
  B3: 246.94,
  E4: 329.63,
  G4: 392.00,
  FS4: 369.99,
  B4: 493.88,
  A4: 440.00,
  D4: 293.66,
  F4: 349.23,
  D5: 587.33,
  CS5: 554.37,
  C5: 523.25,
  AS4: 466.16,
  DS4: 311.13,
  
  // backing chord pads
  E3: 164.81,
  G3: 196.00,
  B2: 123.47,
  C3: 130.81,
  D3: 146.83,
  F3: 174.61,
  A2: 110.00,
  FS3: 185.00,
  DS3: 155.56,
};

// Hedwig's Theme Melody Notes Array
interface MelodyNote {
  note: string;
  dur: number;
  chord?: string[];
}

const MELODY: MelodyNote[] = [
  // Phrase 1
  { note: "B3", dur: 0.5, chord: ["E3", "G3"] },
  { note: "E4", dur: 0.75 },
  { note: "G4", dur: 0.25 },
  { note: "FS4", dur: 0.5 },
  { note: "E4", dur: 1.0, chord: ["E3", "G3"] },
  { note: "B4", dur: 0.5 },
  { note: "A4", dur: 1.5, chord: ["A2", "C3"] },
  { note: "FS4", dur: 1.5 },

  // Phrase 2
  { note: "E4", dur: 0.75, chord: ["E3", "G3"] },
  { note: "G4", dur: 0.25 },
  { note: "FS4", dur: 0.5 },
  { note: "D4", dur: 1.0, chord: ["D3", "F3"] },
  { note: "F4", dur: 0.5 },
  { note: "B3", dur: 2.0, chord: ["B2", "FS3"] },

  // Phrase 3 (Main theme repeat/variation)
  { note: "B3", dur: 0.5, chord: ["E3", "G3"] },
  { note: "E4", dur: 0.75 },
  { note: "G4", dur: 0.25 },
  { note: "FS4", dur: 0.5 },
  { note: "E4", dur: 1.0, chord: ["E3", "G3"] },
  { note: "B4", dur: 0.5 },
  { note: "D5", dur: 1.0, chord: ["D3", "F3"] },
  { note: "CS5", dur: 0.5 },
  { note: "C5", dur: 1.5, chord: ["C3", "E3"] },
  { note: "G4", dur: 0.5 },

  // Phrase 4
  { note: "C5", dur: 0.75, chord: ["C3", "G3"] },
  { note: "B4", dur: 0.25 },
  { note: "AS4", dur: 0.5 },
  { note: "DS4", dur: 1.0, chord: ["B2", "DS3"] },
  { note: "FS4", dur: 0.5 },
  { note: "E4", dur: 2.0, chord: ["E3", "G3"] },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.45);

  const isPlayingRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mainVolumeRef = useRef<GainNode | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const schedulerTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const melodyIndexRef = useRef<number>(0);
  const noteRefsRef = useRef<AudioNode[]>([]);

  // Initialize Web Audio graph
  const initAudio = () => {
    if (audioCtxRef.current) return;

    // Create context compatible with all major browsers
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // Create Main Volume Gain Node
    const mainVol = ctx.createGain();
    mainVol.gain.value = volume;
    mainVol.connect(ctx.destination);
    mainVolumeRef.current = mainVol;

    // Create Beautiful Dreamy Echo Delay (Hogwarts arches ambient delay)
    const delay = ctx.createDelay(1.0);
    delay.delayTime.value = 0.38; // 380ms echo repeat

    const feedback = ctx.createGain();
    feedback.gain.value = 0.42; // 42% feedback volume

    // Connect delay feedback path loop
    delay.connect(feedback);
    feedback.connect(delay);

    // Route delay output into main output volume (wet channel)
    delay.connect(mainVol);
    delayNodeRef.current = delay;
  };

  // Play a single synthesized bell chime note
  const playSound = (freq: number, startTime: number, duration: number, isChord = false) => {
    const ctx = audioCtxRef.current;
    const mainVol = mainVolumeRef.current;
    if (!ctx || !mainVol) return;

    // Triangle Main Bell Oscillator (warm woodwind chime)
    const osc1 = ctx.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.value = freq;

    // Sparkling high-bell Sine Oscillator (1 octave higher for glass brilliance)
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 2;

    // Gain node for individual note decay envelope
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0, startTime);
    
    if (isChord) {
      // Soft backing atmospheric chords
      noteGain.gain.linearRampToValueAtTime(0.035, startTime + 0.06);
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 1.8);
    } else {
      // Plucked bell chime (Celesta style pluck)
      noteGain.gain.linearRampToValueAtTime(0.16, startTime + 0.01);
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 1.2);
    }

    // Connect oscillators to note envelope gain
    osc1.connect(noteGain);
    if (!isChord) {
      osc2.connect(noteGain);
    }
    
    // Route note output directly into dry channel (mainVol)
    noteGain.connect(mainVol);

    // Route note output directly into wet delay channel (delayNode) if active
    if (delayNodeRef.current) {
      noteGain.connect(delayNodeRef.current);
    }

    // Start & Stop
    osc1.start(startTime);
    if (!isChord) osc2.start(startTime);

    osc1.stop(startTime + duration * 2.5);
    if (!isChord) osc2.stop(startTime + duration * 2.5);

    // Save references to stop active notes instantly on click
    noteRefsRef.current.push(osc1);
    if (!isChord) noteRefsRef.current.push(osc2);
  };

  // The Scheduler Loop
  const tempo = 120; // Slightly faster BPM for mysterious drift
  const beatDuration = 60 / tempo; // 1 beat in seconds

  const scheduleNextNotes = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || !isPlayingRef.current) return;

    // Keep scheduling notes ahead to avoid click jitter
    while (nextNoteTimeRef.current < ctx.currentTime + 0.15) {
      const currentNote = MELODY[melodyIndexRef.current];
      const start = nextNoteTimeRef.current;
      const duration = currentNote.dur * beatDuration;

      // Play main chime
      const freq = FREQS[currentNote.note];
      if (freq) {
        playSound(freq, start, duration, false);
      }

      // Play backing chord pads if any
      if (currentNote.chord) {
        currentNote.chord.forEach((chordNote) => {
          const chordFreq = FREQS[chordNote];
          if (chordFreq) {
            playSound(chordFreq, start, duration * 1.8, true);
          }
        });
      }

      // Advance schedule
      nextNoteTimeRef.current += duration;
      melodyIndexRef.current = (melodyIndexRef.current + 1) % MELODY.length;
    }

    // Call scheduler recursively in 50ms
    schedulerTimeoutId.current = setTimeout(scheduleNextNotes, 50);
  };

  // Toggle playback
  const handleTogglePlay = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (isPlayingRef.current) {
      // Pause
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (schedulerTimeoutId.current) clearTimeout(schedulerTimeoutId.current);
      
      // Stop actively running oscillators
      noteRefsRef.current.forEach((osc: any) => {
        try {
          osc.stop();
        } catch (e) {}
      });
      noteRefsRef.current = [];
    } else {
      // Resume context if suspended by browser
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      setIsPlaying(true);
      isPlayingRef.current = true;
      nextNoteTimeRef.current = ctx.currentTime + 0.05;
      // Start scheduler loop
      setTimeout(scheduleNextNotes, 10);
    }
  };

  // Change volume handler
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (mainVolumeRef.current) {
      mainVolumeRef.current.gain.value = newVol;
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (schedulerTimeoutId.current) clearTimeout(schedulerTimeoutId.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Update volume node if volume changes externally
  useEffect(() => {
    if (mainVolumeRef.current) {
      mainVolumeRef.current.gain.value = volume;
    }
  }, [volume]);

  return (
    <div
      className="glass-card"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 100,
        padding: "16px 20px",
        width: "285px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        transition: "transform 0.3s ease, border-color 0.3s",
        border: "1px solid var(--glass-border)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7), var(--glass-glow)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyItems: "center", gap: "12px" }}>
        {/* Play/Pause Chime Toggle */}
        <button
          onClick={handleTogglePlay}
          style={{
            background: "linear-gradient(135deg, var(--primary-rose), var(--primary-gold))",
            border: "none",
            borderRadius: "50%",
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 5px 12px rgba(0,0,0,0.5)",
            transition: "transform 0.2s ease, filter 0.2s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.15)")}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.filter = "brightness(1)";
          }}
          aria-label={isPlaying ? "Pause Ambient Music" : "Play Ambient Music"}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--text-white)">
              <rect x="4" y="4" width="4" height="16" rx="1" />
              <rect x="16" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--text-white)" style={{ marginLeft: "2px" }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Info panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
          <p
            style={{
              fontSize: "10px",
              fontWeight: "700",
              color: "var(--primary-gold)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Hogwarts Radio
          </p>
          <p
            style={{
              fontSize: "13px",
              fontWeight: "500",
              color: "var(--text-white)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Hedwig's Theme (Celesta)
          </p>
        </div>

        {/* Micro Visualizer */}
        <div style={{ display: "flex", gap: "3px", height: "18px", alignItems: "flex-end" }}>
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              style={{
                width: "3px",
                backgroundColor: "var(--primary-gold)",
                borderRadius: "2px",
                height: isPlaying ? "100%" : "3px",
                animation: isPlaying ? `ribbonFloat ${0.55 + i * 0.12}s ease-in-out infinite alternate` : "none",
                transformOrigin: "bottom",
              }}
            />
          ))}
        </div>
      </div>

      {/* Control slider for volume */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--text-muted)">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
        </svg>
        <input
          type="range"
          min="0"
          max="0.8"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
          style={{
            flex: 1,
            height: "4px",
            borderRadius: "2px",
            background: "rgba(255,255,255,0.15)",
            outline: "none",
            WebkitAppearance: "none",
            cursor: "pointer",
          }}
          aria-label="Volume Slider"
        />
      </div>
    </div>
  );
}
