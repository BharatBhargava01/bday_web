"use client";

import React, { useRef, useState } from "react";
import BackgroundCanvas, { BackgroundCanvasRef } from "./components/BackgroundCanvas";
import MusicPlayer from "./components/MusicPlayer";
import EnvelopeLetter from "./components/EnvelopeLetter";
import PolaroidGallery from "./components/PolaroidGallery";
import VideoCinema from "./components/VideoCinema";

export default function Home() {
  const [isRevealed, setIsRevealed] = useState(false);
  const canvasRef = useRef<BackgroundCanvasRef | null>(null);

  const handleEnvelopeOpen = () => {
    setIsRevealed(true);

    // Coordinate a series of confetti bursts!
    setTimeout(() => {
      canvasRef.current?.burst(window.innerWidth / 2, window.innerHeight * 0.4);
    }, 100);

    setTimeout(() => {
      canvasRef.current?.burst(window.innerWidth * 0.3, window.innerHeight * 0.5);
    }, 400);

    setTimeout(() => {
      canvasRef.current?.burst(window.innerWidth * 0.7, window.innerHeight * 0.5);
    }, 700);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* 1. Magical Background Particles and Interactive Canvas */}
      <BackgroundCanvas ref={canvasRef} />

      {/* 2. Cozy Ambient Web Audio Music Player Box */}
      <MusicPlayer />

      {/* Floating Sparkle Stars background decorations */}
      <div
        className="animate-pulse-slow"
        style={{
          position: "absolute",
          top: "10%",
          left: "8%",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "var(--primary-gold)",
          boxShadow: "0 0 15px 4px var(--primary-gold)",
          pointerEvents: "none",
        }}
      />
      <div
        className="animate-pulse-slow"
        style={{
          position: "absolute",
          top: "30%",
          right: "12%",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "var(--accent-pink)",
          boxShadow: "0 0 12px 3px var(--accent-pink)",
          pointerEvents: "none",
          animationDelay: "1.5s",
        }}
      />

      {/* Main Content container */}
      <main
        style={{
          position: "relative",
          zIndex: 5,
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        {/* Step A: Envelope letter reveals first */}
        <div style={{ width: "100%", maxWidth: "800px", zIndex: 10 }}>
          <EnvelopeLetter onOpen={handleEnvelopeOpen} />
        </div>

        {/* Step B: Memories & Videos fade in gracefully once the envelope is opened */}
        {isRevealed && (
          <div
            className="animate-fade-in"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "40px",
            }}
          >
            {/* Divider line style */}
            <div
              style={{
                width: "140px",
                height: "1px",
                background: "linear-gradient(to right, transparent, var(--primary-gold), transparent)",
                margin: "40px 0 10px 0",
              }}
            />

            {/* 3. Polaroid picture deck gallery */}
            <PolaroidGallery />

            {/* Divider line style */}
            <div
              style={{
                width: "140px",
                height: "1px",
                background: "linear-gradient(to right, transparent, var(--primary-gold), transparent)",
                margin: "30px 0 10px 0",
              }}
            />

            {/* 4. Glassmorphism Custom styled Video Cinema Player */}
            <VideoCinema />

            {/* Magical Closing Footer */}
            <footer
              style={{
                padding: "60px 20px 120px 20px",
                textAlign: "center",
                width: "100%",
                maxWidth: "600px",
              }}
            >
              <h3
                className="handwritten"
                style={{
                  fontSize: "34px",
                  color: "var(--primary-gold)",
                  marginBottom: "8px",
                  textShadow: "0 0 15px rgba(212,175,55,0.25)",
                }}
              >
                Mischief Managed! ⚡🧙‍♂️
              </h3>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  letterSpacing: "0.03em",
                }}
              >
                Made with warm butterbeer, countless wizarding wishes, and a little spark of genuine wand magic. Enjoy your special day!
              </p>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
}
