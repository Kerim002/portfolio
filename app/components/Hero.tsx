"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const BlockBlastGame = dynamic(() => import("./BlockBlastGame"), { ssr: false });

const WORDS = ["React", "Next.js", "TypeScript", "Svelte", "PixiJS", "WebSockets"];

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIdx(i => (i + 1) % WORDS.length);
        setVisible(true);
      }, 300);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "3rem 2rem",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "3rem",
        alignItems: "center",
        minHeight: "calc(100vh - 60px)",
      }}
      className="hero-grid"
    >
      {/* Left: Bio */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--accent)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          🇹🇲 Frontend Developer · Turkmenistan
        </p>

        <div>
          <h1
            style={{
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Hi, I&apos;m<br />
            <span style={{ color: "var(--accent)" }}>Kerimberdi</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: "var(--text2)",
              marginTop: "0.75rem",
              letterSpacing: "0.05em",
            }}
          >
            &gt; building with{" "}
            <span
              style={{
                color: "var(--accent3)",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.3s",
                display: "inline-block",
                minWidth: 90,
              }}
            >
              {WORDS[wordIdx]}
            </span>
          </p>
        </div>

        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--text2)",
            lineHeight: 1.75,
            maxWidth: 440,
          }}
        >
          I build scalable web applications, real-time systems, browser games,
          and AI-powered products using modern frontend technologies.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <a
            href="#projects"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              padding: "0.7rem 1.5rem",
              borderRadius: 5,
              cursor: "pointer",
              letterSpacing: "0.05em",
              textDecoration: "none",
              display: "inline-block",
              fontWeight: 700,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => ((e.target as HTMLElement).style.opacity = "0.85")}
            onMouseLeave={e => ((e.target as HTMLElement).style.opacity = "1")}
          >
            View Projects
          </a>
          <a
            href="#contact"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              background: "transparent",
              color: "var(--text)",
              border: "1px solid var(--border2)",
              padding: "0.7rem 1.5rem",
              borderRadius: 5,
              cursor: "pointer",
              letterSpacing: "0.05em",
              textDecoration: "none",
              display: "inline-block",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.borderColor = "var(--accent)";
              (e.target as HTMLElement).style.color = "var(--accent)";
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.borderColor = "var(--border2)";
              (e.target as HTMLElement).style.color = "var(--text)";
            }}
          >
            Get in Touch
          </a>
        </div>

        <div style={{ display: "flex", gap: "2.5rem" }}>
          {[
            { num: "4+", label: "Years Exp" },
            { num: "10+", label: "Projects" },
            { num: "4", label: "Languages" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "var(--accent)",
                }}
              >
                {s.num}
              </span>
              <span style={{ fontSize: "0.72rem", color: "var(--text2)" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Game */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <BlockBlastGame />
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            padding: 2rem 1rem !important;
            min-height: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
