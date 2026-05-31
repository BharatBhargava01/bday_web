"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

export interface BackgroundCanvasRef {
  burst: (x?: number, y?: number) => void;
}

interface BackgroundCanvasProps {
  // Option to trigger a burst externally
}

const BackgroundCanvas = forwardRef<BackgroundCanvasRef, BackgroundCanvasProps>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // References for particles
  const sparklesRef = useRef<MagicSparkle[]>([]);
  const candlesRef = useRef<FloatingCandle[]>([]);
  const wandTrailsRef = useRef<WandSparkle[]>([]);
  const snitchesRef = useRef<GoldenSnitch[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  // Star drawing helper
  const drawStar = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number
  ) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  };

  // Magic Sparkle Class (Replaces Confetti)
  class MagicSparkle {
    x: number;
    y: number;
    size: number;
    color: string;
    speedX: number;
    speedY: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    decay: number;
    spikes: number;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 8 + 4;
      this.spikes = Math.random() > 0.5 ? 4 : 5; // 4 or 5 pointed stars

      const colors = [
        "#d4af37", // Wizarding Gold
        "#f4eedc", // Parchment Silver-White
        "#8b1e2b", // Hogwarts Burgundy/Scarlet
        "#d99a4e", // Candle Amber
        "#ffffff", // Brilliant Starlight
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];

      const angle = Math.random() * Math.PI * 2;
      const force = Math.random() * 7 + 3;
      this.speedX = Math.cos(angle) * force;
      this.speedY = Math.sin(angle) * force - 2.5; // shoot slightly upwards

      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 8;
      this.opacity = 1.0;
      this.decay = Math.random() * 0.012 + 0.007;
    }

    update() {
      this.speedY += 0.12; // gravity
      this.speedX *= 0.97; // air resistance
      this.speedY *= 0.97;

      // Magical drift wind
      this.speedX += Math.sin(Date.now() * 0.001 + this.y * 0.01) * 0.03;

      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      this.opacity -= this.decay;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;

      // Draw star shape instead of rectangles
      drawStar(ctx, 0, 0, this.spikes, this.size, this.size / 2.5);
      ctx.restore();
    }
  }

  // Floating Candle Class (Replaces Balloon)
  class FloatingCandle {
    x: number;
    y: number;
    width: number;
    height: number;
    speedY: number;
    swaySpeed: number;
    swayOffset: number;
    flickerOffset: number;

    constructor(width: number, height: number) {
      this.width = Math.random() * 4 + 7; // thin cylinder
      this.height = Math.random() * 25 + 35; // candle length
      this.x = Math.random() * (width - 60) + 30;
      this.y = height + this.height + Math.random() * height; // staggered start below screen

      this.speedY = Math.random() * 0.35 + 0.15; // very slow drift up
      this.swaySpeed = Math.random() * 0.006 + 0.002;
      this.swayOffset = Math.random() * Math.PI * 2;
      this.flickerOffset = Math.random() * 100;
    }

    update(width: number, height: number) {
      this.y -= this.speedY;
      // Sideways sway
      this.x += Math.sin(this.y * this.swaySpeed + this.swayOffset) * 0.15;

      // Recycle if it goes fully off the top
      if (this.y < -this.height - 25) {
        this.y = height + this.height + Math.random() * 100;
        this.x = Math.random() * (width - 60) + 30;
        this.speedY = Math.random() * 0.35 + 0.15;
      }
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();

      // 1. Draw candle wax body with 3D gradient
      const waxGrad = ctx.createLinearGradient(
        this.x - this.width / 2,
        this.y,
        this.x + this.width / 2,
        this.y
      );
      waxGrad.addColorStop(0, "rgba(220, 210, 185, 0.45)");
      waxGrad.addColorStop(0.3, "rgba(252, 250, 242, 0.6)");
      waxGrad.addColorStop(0.8, "rgba(223, 203, 160, 0.5)");
      waxGrad.addColorStop(1, "rgba(190, 175, 135, 0.4)");

      ctx.fillStyle = waxGrad;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(this.x - this.width / 2, this.y, this.width, this.height, 2);
      } else {
        ctx.rect(this.x - this.width / 2, this.y, this.width, this.height);
      }
      ctx.fill();

      // 2. Black tiny wick
      ctx.strokeStyle = "rgba(45, 30, 20, 0.6)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x, this.y - 5);
      ctx.stroke();

      // 3. Flickering flame
      const flicker = Math.sin(Date.now() * 0.015 + this.flickerOffset) * 0.12 + 1.0;
      const flameHeight = 11 * flicker;
      const flameWidth = 4.5 * flicker;

      // Faint radial flame halo glow
      const radialGlow = ctx.createRadialGradient(
        this.x,
        this.y - 5 - flameHeight / 2,
        1,
        this.x,
        this.y - 5 - flameHeight / 2,
        25
      );
      radialGlow.addColorStop(0, "rgba(255, 175, 55, 0.35)");
      radialGlow.addColorStop(0.4, "rgba(255, 120, 30, 0.12)");
      radialGlow.addColorStop(1, "rgba(255, 100, 10, 0)");

      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(this.x, this.y - 5 - flameHeight / 2, 25, 0, Math.PI * 2);
      ctx.fill();

      // Sharp flame core
      ctx.fillStyle = "rgba(255, 155, 35, 0.85)";
      ctx.beginPath();
      ctx.ellipse(
        this.x,
        this.y - 5 - flameHeight / 2,
        flameWidth,
        flameHeight,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // White inner hot core
      ctx.fillStyle = "rgba(255, 255, 230, 0.95)";
      ctx.beginPath();
      ctx.ellipse(
        this.x,
        this.y - 5 - (flameHeight * 0.6) / 2,
        flameWidth * 0.45,
        flameHeight * 0.6,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.restore();
    }
  }

  // Wand Sparkle Class (Mouse move Lumos trail, Replaces Sparkle)
  class WandSparkle {
    x: number;
    y: number;
    size: number;
    color: string;
    speedX: number;
    speedY: number;
    opacity: number;
    decay: number;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 4 + 3;
      this.color = Math.random() > 0.45 ? "#d4af37" : "#f4eedc"; // Gold and silver-white sparks
      this.speedX = (Math.random() - 0.5) * 1.8;
      this.speedY = (Math.random() - 0.5) * 1.8 - 0.4; // float upwards gently
      this.opacity = 1.0;
      this.decay = Math.random() * 0.02 + 0.015;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity -= this.decay;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;

      // Draw shiny star sparkles
      drawStar(ctx, this.x, this.y, 4, this.size, this.size / 2.5);
      ctx.restore();
    }
  }

  // Golden Snitch Class (Flashed Easter Egg)
  class GoldenSnitch {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    angle: number;
    waveSpeed: number;
    waveAmp: number;
    wingAngle: number;
    wingFlapSpeed: number;
    opacity: number;
    isDead: boolean;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.size = 10; // small golden ball
      this.speedX = Math.random() > 0.5 ? 4 : -4;
      this.speedY = -1.2;
      this.angle = Math.random() * Math.PI;
      this.waveSpeed = 0.06;
      this.waveAmp = 3.5;
      this.wingAngle = 0;
      this.wingFlapSpeed = 0.7;
      this.opacity = 1.0;
      this.isDead = false;
    }

    update(width: number, height: number) {
      this.x += this.speedX;
      this.angle += this.waveSpeed;
      this.y += Math.sin(this.angle) * this.waveAmp + this.speedY;

      // Wing flapping
      this.wingAngle += this.wingFlapSpeed;

      // Mark dead if it flies completely off boundaries
      if (this.x < -120 || this.x > width + 120 || this.y < -120) {
        this.isDead = true;
      }
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.globalAlpha = this.opacity;

      // Left fluttering wing
      ctx.save();
      ctx.translate(this.x - 3, this.y - 2);
      ctx.rotate(-Math.PI / 4.5 + Math.sin(this.wingAngle) * 0.65);
      ctx.fillStyle = "rgba(240, 240, 255, 0.7)";
      ctx.shadowBlur = 6;
      ctx.shadowColor = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Right fluttering wing
      ctx.save();
      ctx.translate(this.x + 3, this.y - 2);
      ctx.rotate(Math.PI / 4.5 - Math.sin(this.wingAngle) * 0.65);
      ctx.fillStyle = "rgba(240, 240, 255, 0.7)";
      ctx.shadowBlur = 6;
      ctx.shadowColor = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Snitch central gold ball
      const bodyGrad = ctx.createRadialGradient(
        this.x - 2,
        this.y - 2,
        1,
        this.x,
        this.y,
        this.size
      );
      bodyGrad.addColorStop(0, "#ffffff");
      bodyGrad.addColorStop(0.3, "#ffe875");
      bodyGrad.addColorStop(0.7, "#d4af37");
      bodyGrad.addColorStop(1, "#9e7811");

      ctx.shadowBlur = 12;
      ctx.shadowColor = "rgba(212, 175, 55, 0.95)";
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // Confetti Star Burst Trigger
  const triggerBurst = (x?: number, y?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const burstX = x !== undefined ? x : canvas.width / 2;
    const burstY = y !== undefined ? y : canvas.height / 2;

    // Spawn 70 magical star sparks
    for (let i = 0; i < 70; i++) {
      sparklesRef.current.push(new MagicSparkle(burstX, burstY));
    }

    // 20% Chance to spawn a Golden Snitch flying away from the burst!
    if (Math.random() < 0.22) {
      snitchesRef.current.push(new GoldenSnitch(burstX, burstY));
    }
  };

  // Expose burst function via ref
  useImperativeHandle(ref, () => ({
    burst: (x, y) => triggerBurst(x, y),
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle resizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initial Floating Candles setup (evokes Great Hall)
    const width = canvas.width;
    const height = canvas.height;
    const candles: FloatingCandle[] = [];
    // Spawn 12 floating candles across the background
    for (let i = 0; i < 12; i++) {
      candles.push(new FloatingCandle(width, height));
    }
    candlesRef.current = candles;

    // Event listeners
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;

      // Spawn 1-2 star sparkles (Lumos trail) on move
      if (Math.random() > 0.28) {
        wandTrailsRef.current.push(new WandSparkle(e.clientX, e.clientY));
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleClick = (e: MouseEvent) => {
      triggerBurst(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseRef.current.x = touch.clientX;
        mouseRef.current.y = touch.clientY;
        mouseRef.current.active = true;

        if (Math.random() > 0.28) {
          wandTrailsRef.current.push(new WandSparkle(touch.clientX, touch.clientY));
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("click", handleClick);
    window.addEventListener("touchmove", handleTouchMove);

    // Animation Loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Update & Draw Floating Candles
      const currentCandles = candlesRef.current;
      for (let i = 0; i < currentCandles.length; i++) {
        currentCandles[i].update(canvas.width, canvas.height);
        currentCandles[i].draw(ctx);
      }

      // 2. Update & Draw Wand Trails (Lumos mouse trail)
      const currentTrails = wandTrailsRef.current;
      for (let i = currentTrails.length - 1; i >= 0; i--) {
        const s = currentTrails[i];
        s.update();
        if (s.opacity <= 0) {
          currentTrails.splice(i, 1);
        } else {
          s.draw(ctx);
        }
      }

      // 3. Update & Draw Magical Burst Sparkles
      const currentSparkles = sparklesRef.current;
      for (let i = currentSparkles.length - 1; i >= 0; i--) {
        const p = currentSparkles[i];
        p.update();
        if (p.opacity <= 0) {
          currentSparkles.splice(i, 1);
        } else {
          p.draw(ctx);
        }
      }

      // 4. Update & Draw Golden Snitches
      const currentSnitches = snitchesRef.current;
      for (let i = currentSnitches.length - 1; i >= 0; i--) {
        const snitch = currentSnitches[i];
        snitch.update(canvas.width, canvas.height);
        if (snitch.isDead) {
          currentSnitches.splice(i, 1);
        } else {
          snitch.draw(ctx);
        }
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1, // behind all overlay items but ahead of background layers
        pointerEvents: "auto", // let clicking work to fire sparkles
      }}
    />
  );
});

BackgroundCanvas.displayName = "BackgroundCanvas";

export default BackgroundCanvas;
