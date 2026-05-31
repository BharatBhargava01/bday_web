"use client";
import React, { useState } from "react";

interface EnvelopeLetterProps {
  onOpen: () => void;
}

export default function EnvelopeLetter({ onOpen }: EnvelopeLetterProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleFlip = () => {
    if (isFlipped) return;
    setIsFlipped(true);
  };

  const handleOpenEnvelope = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid double triggering
    if (isOpen || !isFlipped) return;
    setIsOpen(true);
    onOpen(); // Trigger external callback (e.g. fire confetti!)

    // Smoothly show the expanded scrollable letter modal after the envelope open animation completes
    setTimeout(() => {
      setShowModal(true);
    }, 1400);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsOpen(false);
    setIsFlipped(false); // Reset so they can flip it again!
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "65vh",
        position: "relative",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "30px", animation: "fadeIn 1.2s ease" }}>
        <h1
          className="heading-luxury"
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
            marginBottom: "12px",
            textShadow: "0 0 25px rgba(212,175,55,0.2)",
          }}
        >
          Hogwarts Acceptance Letter
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "15px", letterSpacing: "0.06em" }}>
          {!isFlipped
            ? "An owl has delivered a letter! Click the envelope to flip it over"
            : "Click the Hogwarts crest wax seal to open your letter"}
        </p>
      </div>

      {/* 3D Envelope Container Wrapper */}
      <div
        style={{
          width: "360px",
          height: "240px",
          perspective: "1000px",
          zIndex: 10,
        }}
      >
        {/* Flipping card */}
        <div
          onClick={handleFlip}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            transition: "transform 1.1s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            cursor: isOpen ? "default" : "pointer",
          }}
        >
          {/* ================= FRONT SIDE (Address & Stamps) ================= */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              background: "linear-gradient(135deg, #f5eedc, #eddcb9)",
              borderRadius: "14px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.55), inset 0 0 20px rgba(180,150,110,0.15)",
              border: "1px double rgba(212,175,55,0.4)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {/* Vintage Owl Post Stamp */}
            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "55px",
                height: "65px",
                border: "2px dashed #8b1e2b",
                borderRadius: "4px",
                padding: "2px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(139,30,43,0.04)",
                transform: "rotate(3deg)",
              }}
            >
              <span style={{ fontSize: "7px", fontWeight: "bold", color: "#8b1e2b", letterSpacing: "0.1em" }}>OWL POST</span>
              {/* Simple stylized owl icon SVG */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b1e2b" strokeWidth="1.5">
                <path d="M12 2a4 4 0 0 0-4 4v12a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z" />
                <circle cx="10" cy="8" r="1.5" fill="#8b1e2b" />
                <circle cx="14" cy="8" r="1.5" fill="#8b1e2b" />
                <path d="M8 12h8" />
                <path d="M10 18l2 2 2-2" />
              </svg>
              <span style={{ fontSize: "6px", color: "var(--primary-gold)", marginTop: "2px", fontWeight: "600" }}>ONE SICKLE</span>
            </div>

            {/* Circular faint wizarding postmark */}
            <div
              style={{
                position: "absolute",
                top: "35px",
                right: "60px",
                width: "48px",
                height: "48px",
                border: "1px dashed rgba(40,20,10,0.3)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "7px",
                color: "rgba(40,20,10,0.45)",
                transform: "rotate(-10deg)",
                fontWeight: "600",
                letterSpacing: "0.05em",
                textAlign: "center",
              }}
            >
              HOGWARTS<br />SEP 30
            </div>

            {/* Cursive Address in Emerald Green Quill Ink */}
            <div
              className="handwritten"
              style={{
                color: "#134e34", // Hogwarts green ink
                fontSize: "23px",
                lineHeight: "1.4",
                letterSpacing: "0.02em",
                marginTop: "30px",
                paddingLeft: "15px",
                fontWeight: "500",
                textShadow: "0.3px 0.3px 0px rgba(19,78,52,0.2)",
              }}
            >
              <p style={{ fontStyle: "italic" }}>Ms. Anisha (Aoni),</p>
              <p style={{ paddingLeft: "18px", fontSize: "20px" }}>The Cozy Room full of (Boo)ks,</p>
              <p style={{ paddingLeft: "36px", fontSize: "19px", color: "#0d3624", fontWeight: "bold" }}>Delhi.</p>
            </div>
            
            {/* Click helper overlay on front */}
            <div
              style={{
                position: "absolute",
                bottom: "12px",
                left: "0",
                right: "0",
                textAlign: "center",
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "rgba(139,30,43,0.6)",
                fontWeight: "700",
              }}
            >
              ⚡ Click to Flip Over ⚡
            </div>
          </div>

          {/* ================= BACK SIDE (Wax Seal & Opening Flaps) ================= */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "linear-gradient(135deg, #ebd8af, #dec89c)",
              borderRadius: "14px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.55)",
              border: "1px solid rgba(212,175,55,0.3)",
              perspective: "1000px",
            }}
          >
            {/* Inside Letter Sheet (Rising animation from back envelope body) */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "20px",
                right: "20px",
                height: "180px",
                background: "#faf6ed",
                borderRadius: "6px",
                boxShadow: "0 5px 12px rgba(0,0,0,0.15)",
                transform: isOpen ? "translateY(-90px) scale(0.95)" : "translateY(0) scale(0.9)",
                transition: "transform 1s cubic-bezier(0.25, 1, 0.5, 1) 0.6s, z-index 0s 0.9s",
                zIndex: isOpen ? 5 : 2,
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px double rgba(139,30,43,0.2)",
              }}
            >
              <div style={{ width: "35px", height: "2px", backgroundColor: "#8b1e2b", marginBottom: "8px" }} />
              {/* Tiny Preview letterhead */}
              <span style={{ fontSize: "6px", fontWeight: "bold", color: "#8b1e2b", letterSpacing: "0.1em", marginBottom: "6px" }}>
                HOGWARTS SCHOOL
              </span>
              <p
                className="handwritten"
                style={{
                  color: "#134e34",
                  fontSize: "17px",
                  textAlign: "center",
                  lineHeight: "1.3",
                  fontWeight: "600",
                }}
              >
                Dear Ms. Anisha... <br />
                Your acceptance is waiting!
              </p>
            </div>

            {/* Envelope Top Flap (Rotates open) */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "0",
                height: "0",
                borderLeft: "180px solid transparent",
                borderRight: "180px solid transparent",
                borderTop: "120px solid #d4be92", // parchment color
                transformOrigin: "top",
                transform: isOpen ? "rotateX(180deg) translateY(-2px)" : "rotateX(0deg)",
                transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                zIndex: isOpen ? 1 : 4,
              }}
            />

            {/* Envelope Bottom & Side Flaps (Overlay paper cuts) */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "0",
                height: "0",
                borderLeft: "180px solid #dec89c",
                borderRight: "180px solid #dec89c",
                borderBottom: "125px solid #e3ceab",
                borderRadius: "0 0 14px 14px",
                zIndex: 3,
              }}
            />

            {/* Wax Seal - Clicking this triggers opening */}
            {!isOpen && (
              <div
                onClick={handleOpenEnvelope}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -30%) scale(1)",
                  width: "60px",
                  height: "60px",
                  background: "radial-gradient(circle, #a81c1c 20%, #680d0d 100%)",
                  borderRadius: "50%",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.65), inset 0 2px 6px rgba(255,255,255,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 6,
                  cursor: "pointer",
                  transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translate(-50%, -30%) scale(1.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translate(-50%, -30%) scale(1)")}
              >
                {/* Hogwarts medieval crest H engraving in stamp */}
                <svg width="34" height="34" viewBox="0 0 100 100" style={{ pointerEvents: "none" }}>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f4eedc" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.3" />
                  <path
                    d="M32 26 h8 v18 h20 v-18 h8 v48 h-8 v-22 h-20 v22 h-8 z"
                    fill="#f4eedc"
                    opacity="0.8"
                  />
                  <path
                    d="M50 15 C62 15 70 23 70 35 C70 54 50 78 50 78 C50 78 30 54 30 35 C30 23 38 15 50 15 Z"
                    fill="none"
                    stroke="#f4eedc"
                    strokeWidth="1.5"
                    opacity="0.25"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= Expanded Elegant Scrollable Hogwarts Letter Modal ================= */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(6, 4, 8, 0.92)",
            backdropFilter: "blur(12px)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            animation: "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Parchment Stationary Sheet */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "640px",
              maxHeight: "84vh",
              background: "#f4eedc", // genuine vintage cream parchment
              backgroundImage: "radial-gradient(rgba(139,30,43,0.05) 0.5px, transparent 0.5px)",
              backgroundSize: "28px 28px",
              boxShadow: "0 30px 80px rgba(0,0,0,0.85), 0 0 0 10px rgba(212, 175, 55, 0.08)",
              borderRadius: "16px",
              padding: "48px 36px 36px 36px",
              display: "flex",
              flexDirection: "column",
              border: "3px double #d4af37",
              animation: "float 6s ease-in-out infinite",
            }}
          >
            {/* Elegant double-line crest border */}
            <div
              style={{
                position: "absolute",
                top: "14px",
                bottom: "14px",
                left: "14px",
                right: "14px",
                border: "1px double rgba(139, 30, 43, 0.25)",
                borderRadius: "10px",
                pointerEvents: "none",
              }}
            />

            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              style={{
                position: "absolute",
                top: "22px",
                right: "26px",
                background: "none",
                border: "none",
                fontSize: "30px",
                color: "#8b1e2b",
                cursor: "pointer",
                transition: "transform 0.2s, color 0.2s",
                zIndex: 10,
                fontWeight: "300",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.18) rotate(90deg)";
                e.currentTarget.style.color = "#d4af37";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                e.currentTarget.style.color = "#8b1e2b";
              }}
              aria-label="Close Letter"
            >
              &times;
            </button>

            {/* Scrollable Letter Area */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                paddingRight: "14px",
                color: "#1e2c1e", // dark green/black aged ink tone
                fontFamily: "var(--font-handwritten)",
                fontSize: "25px",
                lineHeight: "1.6",
                textAlign: "left",
              }}
            >
              {/* Hogwarts official crest letterhead */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "26px",
                  textAlign: "center",
                  borderBottom: "2px double rgba(139,30,43,0.15)",
                  paddingBottom: "16px",
                }}
              >
                {/* Large styled medieval Hogwarts text */}
                <h2
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "23px",
                    fontWeight: "bold",
                    color: "#8b1e2b",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  Hogwarts School
                </h2>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "14px",
                    color: "#d4af37",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginTop: "2px",
                  }}
                >
                  of Witchcraft and Wizardry
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "8px",
                    color: "rgba(30,30,30,0.6)",
                    letterSpacing: "0.05em",
                    marginTop: "6px",
                    lineHeight: "1.2",
                  }}
                >
                  Headmaster: Albus Dumbledore <br />
                  (Order of Merlin, First Class, Grand Sorc., Chf. Warlock, Supreme Mugwump)
                </p>
              </div>

              {/* Personal Letter Text (emerald ink style) */}
              <div style={{ color: "#11452c", textShadow: "0.2px 0.2px 0px rgba(17,69,44,0.1)" }}>
                <p style={{ marginBottom: "20px", fontWeight: "bold" }}>Dearest Anisha,</p>

                <p style={{ marginBottom: "20px" }}>
                  Tumar janmadin, tumar boys 23 kintu tumi matra mor kechuwa :). 
                  Amar etiya pri 7 mah ho'la aaru aapuni mok upolobdhi koraise je bastow jibonot soundorjya aaru mogojur astitto kenekoi aaru seyao mor jibon. 
                  Tumak lag powar pisore pora mor jibonto aasorit, tumar ma-deutai tumak powar siddhanto lowat moi aanondit hoiso😘.
                </p>

                <p style={{ marginBottom: "20px" }}>
                  Mor jibonot tumak pai moi emanei kritagya, tumi mok ejon bhal manuh karila. 
                  Aapuni mok sei somoyot lag paisil jetiya moi iyar aasa kam aasilo aaru etiya aapuni iyar ataitkoi gurutwopurn ansh. 
                  30 septemborot tumak basot dekhar dintor pora etiya aaru sirdinor babe tumi mor lag powa ataitkoi dhuniya, sexy, chotur, shakttisali mohila.
                </p>

                <p style={{ marginBottom: "20px" }}>
                  Janmadinor subhessa mor prem❤️. Moi bhabaa nasilo je moi karobar eman jatn la’bo parim. 
                  Axakoru moi aaponar sakalo kalpona kari hocha karim aaru aaponar jiman mandand aase, sei sakalo mandandot uponit ho'ma. 
                  Mor lagat howa ataitkoi bhal kam tumiyei. 
                  Moi tumak chini paboloi sikiso, tumak bhal paboloi, tumar dore, aaru tumi mor best frend jar oparat moi jikono somoyote pisuwai jab paro buli jano.
                </p>

                <p style={{ marginBottom: "20px" }}>
                  Moi aaponar babe saday thakim, sakalo kamote aaponar ataitkoi dangor samarthok howar babe, aaponar uss-neechor majere moi thakim. 
                  Subh janmadinor hikhu. 
                </p>

                <p style={{ marginBottom: "20px" }}>
                  Moi tumak bohut bhal paon Aoni!❤️
                </p>
              </div>

              <div
                style={{
                  marginTop: "40px",
                  borderTop: "1px dashed rgba(139,30,43,0.18)",
                  paddingTop: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <div>
                  <p style={{ fontSize: "16px", fontFamily: "var(--font-body)", color: "rgba(30,30,30,0.65)", fontStyle: "italic" }}>
                    Sent via owl post by your favorite wizard,
                  </p>
                  <p style={{ fontSize: "38px", color: "#8b1e2b", marginTop: "6px", textShadow: "0.5px 0.5px 0px rgba(139,30,43,0.15)" }}>
                    Your Hera ❤️
                  </p>
                </div>
                
                {/* Tiny Dumbledore signature style stamp */}
                <div
                  style={{
                    border: "1px solid rgba(212,175,55,0.4)",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "9px",
                    fontFamily: "var(--font-body)",
                    color: "#d4af37",
                    transform: "rotate(-5deg)",
                    fontWeight: "600",
                    textTransform: "uppercase",
                  }}
                >
                  Approved Hogwarts Seal
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
