"use client";

import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import Image from "next/image";

interface PolaroidItem {
  id: number;
  src: string;
  caption: string;
  date: string;
  story: string;
  tilt: string;
}

const MEMORIES: PolaroidItem[] = [
  {
    id: 1,
    src: "/images/young.jpg",
    caption: "A young Anisha",
    date: "A long time back!",
    story: "We were talking about our childhood pictures and you sent me this, now this is my chat wallpaper :)",
    tilt: "-3deg",
  },
  {
    id: 2,
    src: "/images/you_boo.jpg",
    caption: "Boo and You",
    date: "27th Dec 2025",
    story: "Boo and you have the cutest and strongest bond I have ever seen. ",
    tilt: "4deg",
  },
  {
    id: 3,
    src: "/images/first_date.jpg",
    caption: "Our First Date ✨",
    date: "5th Nov 2025",
    story: "Our first date we went to CP and visted the oxford bookstore, walked all the way to NGMA, explored all the art pieces and then walked back to CP for having food. After having food we decided to go Agrasen ki Baoli, although we both knew it had closed by then, still we thought of going and I popped the question there. And you said yes :) Oh and thank you for waiting :p",
    tilt: "4deg",
  },
  {
    id: 4,
    src: "/images/council_of_cool.jpg",
    caption: "Council of Cool",
    date: "1st March 2026 ",
    story: "It was Aman's Birthday, and all of you guys went to Sundar Nursery first for cake cutting and then went to Hauz Khas where you guys clicked this picture, although you had to leave early you looked like you had so much fun!",
    tilt: "4deg",
  },
  {
    id: 5,
    src: "/images/first_concert.jpg",
    caption: "First Concert Together 🎁",
    date: "22nd Feb 2026",
    story: "Going to the Northeast Music Festival with you was an amazing experience. We saw Reble perform live and you introduced me to northeastern music and food. Oh and we had ice cream after that to top it off :) ",
    tilt: "-2deg",
  },
  {
    id: 6,
    src: "/images/books_you.jpg",
    caption: "You and Books",
    date: "2nd Jan 2026 ",
    story: "Visiting the bookstore is the most important hehe. ",
    tilt: "3deg",
  },
  {
    id: 7,
    src: "/images/cousin.jpg",
    caption: "Cousins Gang",
    date: "No idea :p",
    story: "You guys were playing uno together, oh and I heard you shout XD. I could not find anything of you guys together and I really wanted to have a picture of you and your cousins together",
    tilt: "-2deg",
  },
  {
    id: 8,
    src: "/images/bihu.jpg",
    caption: "Celebrating Bihu Together 🥂",
    date: "17th April 2026",
    story: "First time celebrating Bihu in Delhi. Although it wasn't the same as celebrating back home in Assam, but it was still special celebrating with you.",
    tilt: "3deg",
  },
  {
    id: 9,
    src: "/images/cutest.jpg",
    caption: "Cutest",
    date: "Forever and Always ",
    story: "All I can say is that you're the cutest ;)",
    tilt: "-2deg",
  }
];

const basePath = process.env.__NEXT_ROUTER_BASEPATH || "";

export default function PolaroidGallery() {
  const [activePhoto, setActivePhoto] = useState<PolaroidItem | null>(null);
  const [heartsCount, setHeartsCount] = useState<Record<number, number>>({ 1: 5, 2: 12, 3: 8, 4: 15, 5: 1, 6: 8, 7: 12, 8: 24, 9: 10 });
  
  const modalCardRef = useRef<HTMLDivElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    if (activePhoto && modalCardRef.current && leftSideRef.current && !isClosing) {
      const gridItem = document.getElementById(`polaroid-grid-item-${activePhoto.id}`);
      const finalElement = modalCardRef.current;
      const leftElement = leftSideRef.current;
      
      if (gridItem) {
        // Force complete global layout calculation so all rects are accurate
        const _reflow = document.body.offsetHeight;

        const startRect = gridItem.getBoundingClientRect();
        const finalRect = finalElement.getBoundingClientRect();
        const leftRect = leftElement.getBoundingClientRect();
        
        // Scale parent based on the ratio of grid polaroid vs modal polaroid width
        const scaleX = startRect.width / leftRect.width;
        const scaleY = startRect.height / leftRect.height;
        
        // Translate so that the left-side polaroid container overlaps the grid card perfectly
        const tx = startRect.left - finalRect.left - (leftRect.left - finalRect.left) * scaleX;
        const ty = startRect.top - finalRect.top - (leftRect.top - finalRect.top) * scaleY;
        
        // Initial First State: perfectly centered and matched to grid card
        finalElement.style.transform = `translate(${tx}px, ${ty}px) scale(${scaleX}, ${scaleY}) rotate(${activePhoto.tilt})`;
        finalElement.style.transformOrigin = "top left";
        finalElement.style.borderRadius = "2px";
        finalElement.style.transition = "none";
        
        // Force reflow
        const _unused = finalElement.offsetHeight;
        
        // Exquisite slow and premium transition to the center
        finalElement.style.transition = "transform 1.5s cubic-bezier(0.16, 1, 0.3, 1), border-radius 1.5s ease";
        finalElement.style.transform = "none";
        finalElement.style.borderRadius = "20px";
      }
    }
  }, [activePhoto, isClosing]);

  const handleClose = () => {
    if (isClosing || !activePhoto) return;
    
    setIsClosing(true);
    const gridItem = document.getElementById(`polaroid-grid-item-${activePhoto.id}`);
    const finalElement = modalCardRef.current;
    const leftElement = leftSideRef.current;
    
    if (gridItem && finalElement && leftElement) {
      const startRect = gridItem.getBoundingClientRect();
      const finalRect = finalElement.getBoundingClientRect();
      const leftRect = leftElement.getBoundingClientRect();
      
      const scaleX = startRect.width / leftRect.width;
      const scaleY = startRect.height / leftRect.height;
      
      const tx = startRect.left - finalRect.left - (leftRect.left - finalRect.left) * scaleX;
      const ty = startRect.top - finalRect.top - (leftRect.top - finalRect.top) * scaleY;
      
      // Slow and premium exit flight back to the grid item
      finalElement.style.transition = "transform 1.5s cubic-bezier(0.25, 1, 0.5, 1), border-radius 1.5s ease";
      finalElement.style.transform = `translate(${tx}px, ${ty}px) scale(${scaleX}, ${scaleY}) rotate(${activePhoto.tilt})`;
      finalElement.style.borderRadius = "2px";
    }
    
    setTimeout(() => {
      setActivePhoto(null);
      setIsClosing(false);
    }, 1500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, isClosing]);

  const handleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartsCount((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  return (
    <section
      style={{
        padding: "80px 20px",
        position: "relative",
        zIndex: 2,
        maxWidth: "1100px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: "50px" }}>
        <h2
          className="heading-luxury"
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            marginBottom: "16px",
            textShadow: "0 0 25px rgba(212,175,55,0.18)",
          }}
        >
          Wizarding Photo Album
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
          Hover over each moving wizard photo to steady it, and click to peer into the Pensieve to reveal the memory behind the frame.
        </p>
      </div>

      {/* Grid Canvas */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "40px",
          padding: "20px",
        }}
      >
        {MEMORIES.map((photo) => (
          <div
            key={photo.id}
            id={`polaroid-grid-item-${photo.id}`}
            onClick={() => setActivePhoto(photo)}
            style={{
              position: "relative",
              background: "linear-gradient(135deg, #f5eedc, #eddcb9)", // gorgeous aged parchment
              padding: "16px 16px 44px 16px",
              width: "240px",
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.65), 0 2px 8px rgba(0, 0, 0, 0.2)",
              transform: `rotate(${photo.tilt}) translateY(0px)`,
              transformOrigin: "center",
              cursor: "pointer",
              transition: "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.4s",
              zIndex: 10,
              borderRadius: "4px",
              border: "1px solid rgba(212, 175, 55, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "rotate(0deg) translateY(-12px) scale(1.05)";
              e.currentTarget.style.boxShadow = "0 25px 45px rgba(0, 0, 0, 0.75), 0 8px 20px rgba(212,175,55,0.22)";
              e.currentTarget.style.zIndex = "20";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = `rotate(${photo.tilt}) translateY(0px)`;
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.4), 0 2px 5px rgba(0, 0, 0, 0.2)";
              e.currentTarget.style.zIndex = "10";
            }}
          >
            {/* Top Washi Tape Deco (Styled as a premium gold foil tape) */}
            <div
              style={{
                position: "absolute",
                top: "-12px",
                left: "50%",
                transform: "translateX(-50%) rotate(-1deg)",
                width: "75px",
                height: "20px",
                backgroundColor: "rgba(212, 175, 55, 0.45)", // shiny vintage gold tape
                backdropFilter: "blur(1px)",
                borderLeft: "1px dashed rgba(255,255,255,0.4)",
                borderRight: "1px dashed rgba(255,255,255,0.4)",
                boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                pointerEvents: "none",
              }}
            />

            {/* Polaroid Image Box */}
            <div
              style={{
                position: "relative",
                width: "210px",
                height: "208px",
                minWidth: "100%",
                background: "#ffffff",
                overflow: "hidden",
                border: "2px double rgba(212,175,55,0.45)", // ornate gold double-line border
                borderRadius: "1px",
              }}
            >
              <Image
                src={`${basePath}${photo.src}`}
                alt={photo.caption}
                fill
                sizes="240px"
                style={{
                  objectFit: "contain",
                  filter: "sepia(0.24) contrast(1.05) brightness(0.95)", // wizard moving photo tint
                  transition: "transform 0.4s",
                }}
              />
            </div>

            {/* Polaroid Bottom Caption Text */}
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "16px",
                right: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p
                className="handwritten"
                style={{
                  color: "#3a2512", // dark walnut brown ink
                  fontSize: "20px",
                  fontWeight: "600",
                  textAlign: "center",
                  lineHeight: "1.2",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: "100%",
                }}
              >
                {photo.caption}
              </p>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "9px",
                  color: "rgba(58, 37, 18, 0.6)",
                  marginTop: "2px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: "600",
                }}
              >
                {photo.date}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Lightbox Modal - Spellbook styling */}
      {activePhoto && (
        <div
          ref={backdropRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(6, 4, 8, 0.94)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            animation: isClosing ? "none" : "backdropFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            opacity: isClosing ? 0 : undefined,
            backdropFilter: isClosing ? "blur(0px)" : undefined,
            transition: isClosing ? "opacity 0.45s ease, backdrop-filter 0.45s ease" : "none",
          }}
          onClick={handleClose}
        >
          {/* Custom transition keyframes */}
          <style>{`
            @keyframes backdropFadeIn {
              from { opacity: 0; backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px); }
              to { opacity: 1; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
            }
            @keyframes slideOutStory {
              from { opacity: 0; transform: translateX(-30px); }
              to { opacity: 1; transform: translateX(0); }
            }
          `}</style>

          {/* Lightbox Spellbook Frame */}
          <div
            ref={modalCardRef}
            className="glass-card"
            style={{
              width: "100%",
              maxWidth: "840px",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              overflow: "hidden",
              border: "3px double #d4af37", // elegant double gold border
              boxShadow: "0 35px 80px rgba(0,0,0,0.9)",
              borderRadius: "16px",
            }}
            onClick={(e) => e.stopPropagation()} // prevent close
          >
            {/* Left side: Polaroid Frame inside Spellbook */}
            <div
              ref={leftSideRef}
              style={{
                flex: "1 1 370px",
                background: "linear-gradient(135deg, #f5eedc, #eddcb9)", // aged parchment page
                padding: "28px 28px 60px 28px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "0px",
                boxShadow: "5px 0 15px rgba(0,0,0,0.15)", // shadow of page fold
                zIndex: 10,
                borderRight: "2px double rgba(139,30,43,0.15)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1/1",
                  borderRadius: "2px",
                  overflow: "hidden",
                  boxShadow: "inset 0 0 12px rgba(0,0,0,0.15)",
                  border: "3px double rgba(212,175,55,0.4)", // gold frame inside page
                }}
              >
                <Image
                  src={`${basePath}${activePhoto.src}`}
                  alt={activePhoto.caption}
                  fill
                  sizes="(max-width: 768px) 100vw, 350px"
                  style={{ objectFit: "contain", filter: "sepia(0.18)" }}
                />
              </div>
              <p
                className="handwritten"
                style={{
                  color: "#3a2512",
                  fontSize: "26px",
                  marginTop: "20px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {activePhoto.caption}
              </p>
              <span style={{ fontSize: "11px", color: "rgba(58,37,18,0.55)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>
                {activePhoto.date}
              </span>
            </div>

            {/* Right side: Magical Story notes (Spellbook Dark Binding Page) */}
            <div
              ref={rightSideRef}
              style={{
                flex: "1 1 370px",
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "linear-gradient(135deg, #1b120c, #0a0705)", // gorgeous dark rich mahogany wood binding
                opacity: isClosing ? 0 : 0,
                animation: isClosing ? "none" : "slideOutStory 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards",
                transform: isClosing ? "translateX(-20px)" : undefined,
                transition: isClosing ? "opacity 0.4s ease, transform 0.4s ease" : "none",
                borderLeft: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {/* Top Text content */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "22px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "23px",
                      color: "var(--primary-gold)",
                      lineHeight: "1.2",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Pensieve Memory
                  </h3>
                  <button
                    onClick={handleClose}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--text-muted)",
                      fontSize: "26px",
                      cursor: "pointer",
                      lineHeight: "1",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-gold)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                  >
                    &times;
                  </button>
                </div>

                <p
                  style={{
                    color: "#ebdca8", // warm glowing golden cream starlight print
                    fontSize: "15px",
                    lineHeight: "1.75",
                    marginBottom: "24px",
                    letterSpacing: "0.03em",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {activePhoto.story}
                </p>
              </div>

              {/* Bottom Heart Reaction Panel */}
              <div
                style={{
                  borderTop: "1px solid rgba(212,175,55,0.15)",
                  paddingTop: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button
                    onClick={(e) => handleLike(activePhoto.id, e)}
                    style={{
                      background: "rgba(212, 175, 55, 0.12)",
                      border: "1px solid rgba(212, 175, 55, 0.4)",
                      borderRadius: "50%",
                      width: "48px",
                      height: "48px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "transform 0.2s, background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.12)";
                      e.currentTarget.style.backgroundColor = "rgba(212, 175, 55, 0.22)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.backgroundColor = "rgba(212, 175, 55, 0.12)";
                    }}
                    aria-label="Cast Patronus Heart"
                  >
                    {/* Magical glow star/wand heart */}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--primary-gold)">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600", letterSpacing: "0.03em" }}>
                    {heartsCount[activePhoto.id]} Patronus Casts
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    color: "var(--primary-gold)",
                    letterSpacing: "0.08em",
                    fontWeight: "700",
                    textTransform: "uppercase",
                  }}
                >
                  Spells of Love
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
