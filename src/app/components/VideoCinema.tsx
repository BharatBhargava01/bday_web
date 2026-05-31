"use client";

import React, { useState, useRef, useEffect } from "react";

interface TributeVideo {
  id: number;
  title: string;
  sender: string;
  url: string;
  quote: string;
}

const TRIBUTES: TributeVideo[] = [
  {
    id: 1,
    title: "You :)",
    sender: "God",
    url: "/videos/you.mp4",
    quote: "May your path always be lit with sparkling joy, sudden laughter, and absolute love."
  },
  {
    id: 2,
    title: "Cousin Gang",
    sender: "Ariyan, Ayan, Arnav",
    url: "/videos/cousin_gang.mp4",
    quote: "Spells of laughter, memories and warmest birthday greetings."
  },
  {
    id: 3,
    title: "Council of Cool",
    sender: "Abhishek, Aman, Sudeepti, Arindam, Prathimesh, Shanky",
    url: "/videos/friends.mp4",
    quote: "Wishes of joy, cherished memories, and the heartfelt birthday greetings."
  },
  {
    id: 4,
    title: "Hera",
    sender: "Me",
    url: "/videos/me.mp4",
    quote: "To endless adventures, quiet late-night talks, and laughing until our stomachs hurt."
  },
];

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function VideoCinema() {
  const [activeVideo, setActiveVideo] = useState<TributeVideo>(TRIBUTES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [isMuted, setIsMuted] = useState(false);
  const [reactions, setReactions] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Synchronize playing states
  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Playback interrupted", err);
      });
    }
  };

  // Switch video tribute nodes
  const handleSelectTribute = (tribute: TributeVideo) => {
    setActiveVideo(tribute);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime("0:00");
    
    // Load new source and play
    setTimeout(() => {
      const video = videoRef.current;
      if (video) {
        video.load();
        video.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
    }, 50);
  };

  // Formatting time helper
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Video Events
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const current = video.currentTime;
    const dur = video.duration;
    if (dur > 0) {
      setProgress((current / dur) * 100);
    }
    setCurrentTime(formatTime(current));
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(formatTime(video.duration));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newProgress = parseFloat(e.target.value);
    const dur = video.duration;
    if (dur > 0) {
      const newTime = (newProgress / 100) * dur;
      video.currentTime = newTime;
      setProgress(newProgress);
    }
  };

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const handleSendHeart = () => {
    setReactions((prev) => prev + 1);
    
    // Attempt to burst confetti on the background canvas if it exists
    if (typeof window !== "undefined") {
      const clickEvent = new MouseEvent("click", {
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight * 0.8,
        bubbles: true
      });
      window.dispatchEvent(clickEvent);
    }
  };

  // Sync state if video naturally finishes
  const handleVideoEnded = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  return (
    <section
      style={{
        padding: "80px 20px 100px 20px",
        position: "relative",
        zIndex: 2,
        maxWidth: "1050px",
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h2
          className="heading-luxury"
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            marginBottom: "16px",
            textShadow: "0 0 25px rgba(212,175,55,0.18)",
          }}
        >
          The Mirror of Erised
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
          Peer into the golden mirror of memory to project warm birthday wishes and reflections of love from those who cherish you most.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "30px",
          alignItems: "stretch",
        }}
      >
        {/* Left Side: Ornate Gold Frame of Erised Video Screen */}
        <div
          className="glass-card"
          style={{
            flex: "2 1 600px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "4px double var(--primary-gold)", // majestic double gold frame
            boxShadow: "0 25px 60px rgba(0,0,0,0.8), var(--glass-glow)",
            borderRadius: "24px",
          }}
        >
          {/* Mirror of Erised Classic Inscription Banner */}
          <div
            style={{
              textAlign: "center",
              padding: "8px 16px",
              background: "rgba(139, 30, 43, 0.2)",
              borderBottom: "1px double var(--primary-gold)",
              fontSize: "12px",
              fontStyle: "italic",
              letterSpacing: "0.15em",
              color: "var(--primary-gold)",
              fontFamily: "var(--font-heading)",
              textShadow: "0 0 8px rgba(212,175,55,0.3)",
              fontWeight: "600",
            }}
          >
            " erised stra ehru oyt ube cafru oyt on wohsi "
          </div>

          {/* Main screen area */}
          <div style={{ position: "relative", backgroundColor: "#060408", aspectRatio: "16/9", overflow: "hidden" }}>
            <video
              ref={videoRef}
              src={`${basePath}${activeVideo.url}`}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleVideoEnded}
              onClick={handlePlayPause}
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                cursor: "pointer",
              }}
            />

            {/* Custom overlay quote (shows when paused) */}
            {!isPlaying && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(9, 6, 12, 0.65)", // magical dark fog
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px",
                  pointerEvents: "none",
                  animation: "fadeIn 0.4s ease",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(212,175,55,0.12)",
                    border: "1px solid var(--primary-gold)",
                    borderRadius: "50%",
                    width: "68px",
                    height: "68px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                    boxShadow: "0 0 25px rgba(212,175,55,0.3)",
                  }}
                >
                  {/* Glowing Play Icon */}
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--primary-gold)" style={{ marginLeft: "4px" }}>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                
                {activeVideo.quote ? (
                  <p
                    className="handwritten"
                    style={{
                      color: "var(--accent-cream)",
                      fontSize: "26px",
                      maxWidth: "460px",
                      lineHeight: "1.45",
                      textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                    }}
                  >
                    "{activeVideo.quote}"
                  </p>
                ) : (
                  <p
                    className="handwritten"
                    style={{
                      color: "var(--accent-cream)",
                      fontSize: "24px",
                      maxWidth: "460px",
                      lineHeight: "1.45",
                      textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                    }}
                  >
                    "Spells of laughter, memories and warmest birthday greetings."
                  </p>
                )}
                
                <span
                  style={{
                    color: "var(--primary-gold)",
                    fontSize: "13px",
                    marginTop: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  — {activeVideo.sender}
                </span>
              </div>
            )}
          </div>

          {/* Custom Controls Bar */}
          <div
            style={{
              padding: "16px 20px",
              background: "rgba(10, 6, 12, 0.95)",
              borderTop: "1px solid rgba(212, 175, 55, 0.15)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {/* Timeline Seeker */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", width: "35px" }}>{currentTime}</span>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress}
                onChange={handleSeek}
                style={{
                  flex: 1,
                  height: "5px",
                  borderRadius: "3px",
                  background: "linear-gradient(to right, var(--primary-gold) 0%, var(--primary-gold) ${progress}%, rgba(255,255,255,0.1) ${progress}%, rgba(255,255,255,0.1) 100%)",
                  outline: "none",
                  WebkitAppearance: "none",
                  cursor: "pointer",
                }}
                aria-label="Video Timeline Seeker"
              />
              <span style={{ fontSize: "12px", color: "var(--text-muted)", width: "35px" }}>{duration}</span>
            </div>

            {/* Sub control buttons */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {/* Play button */}
                <button
                  onClick={handlePlayPause}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--primary-gold)",
                    display: "flex",
                    alignItems: "center",
                  }}
                  aria-label={isPlaying ? "Pause Video" : "Play Video"}
                >
                  {isPlaying ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="5" y="4" width="4" height="16" rx="1" />
                      <rect x="15" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Mute button */}
                <button
                  onClick={handleToggleMute}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                  }}
                  aria-label={isMuted ? "Unmute Video" : "Mute Video"}
                >
                  {isMuted ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.63 3.63L2.37 4.89 7.48 10H3v4h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.03c1.38-.31 2.63-.95 3.69-1.81l2.42 2.42 1.27-1.27L3.63 3.63zM12 4L9.91 6.09 12 8.18V4zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71z" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>

                {/* Subtitle / Quote snippet */}
                <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600", letterSpacing: "0.02em" }}>
                  Projection: {activeVideo.title}
                </span>
              </div>

              {/* Fullscreen button */}
              <button
                onClick={handleFullscreen}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                }}
                aria-label="Fullscreen Video"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Navigation Deck & Transcript */}
        <div
          style={{
            flex: "1 1 350px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Tribute Selector */}
          <div
            className="glass-card"
            style={{
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              border: "1px solid var(--glass-border)",
            }}
          >
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "19px", color: "var(--primary-gold)", letterSpacing: "0.05em" }}>
              Memories inside the Pensieve
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {TRIBUTES.map((tribute) => {
                const isActive = tribute.id === activeVideo.id;
                return (
                  <button
                    key={tribute.id}
                    onClick={() => handleSelectTribute(tribute)}
                    style={{
                      background: isActive ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.02)",
                      border: isActive ? "1px solid var(--primary-gold)" : "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "12px",
                      padding: "14px 18px",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                      <span style={{ fontWeight: "700", fontSize: "14px", color: isActive ? "var(--primary-gold)" : "var(--text-white)" }}>
                        {tribute.title}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--primary-gold)", fontWeight: "700", letterSpacing: "0.03em" }}>
                        {tribute.sender}
                      </span>
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                      {tribute.quote ? `"${tribute.quote}"` : "Peeking into a beautiful reflection..."}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Sparkle Reaction Board */}
          <div
            className="glass-card"
            style={{
              padding: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid var(--glass-border)",
            }}
          >
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-white)", letterSpacing: "0.03em" }}>Cast a Lumos Spark! ⚡</h4>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                Tap to cast dazzling wand fireworks!
              </p>
            </div>
            
            <button
              onClick={handleSendHeart}
              style={{
                background: "linear-gradient(135deg, var(--primary-gold), var(--accent-pink))",
                border: "none",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 6px 16px rgba(212,175,55,0.35)",
                transition: "transform 0.2s",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.88)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              aria-label="Cast Wand Fireworks Spark"
            >
              {/* Magic Wand SVG */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--text-white)">
                <path d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8l-2.5-1.4-1.4 2.5 1.4 2.5 2.5-1.4 2.5 1.4-1.4-2.5zM22 2l-1.4 2.5L23 7l-2.5-1.4L18 7l1.4-2.5L18 2l2.5 1.4zM3.5 18.25l13.5-13.5 2.25 2.25-13.5 13.5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
