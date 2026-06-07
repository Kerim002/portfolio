"use client";
const languages = [
  { name: "Turkmen", level: "Native", pct: 100 },
  { name: "Turkish", level: "Bilingual", pct: 95 },
  { name: "English", level: "Conversational", pct: 75 },
  { name: "Russian", level: "Basics", pct: 35 },
];

export default function About() {
  return (
    <section id="about" style={{ maxWidth: 1200, margin: "0 auto", padding: "5rem 2rem" }}>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          color: "var(--accent)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: "0.5rem",
        }}
      >
        // 004 · background
      </p>
      <h2
        style={{
          fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
          fontWeight: 800,
          marginBottom: "2.5rem",
          letterSpacing: "-0.02em",
        }}
      >
        About Me
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "3.5rem",
          alignItems: "start",
        }}
        className="about-grid"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            fontSize: "0.95rem",
            color: "var(--text2)",
            lineHeight: 1.8,
          }}
        >
          <p>
            Frontend Developer from Turkmenistan with a passion for building
            products that feel <em style={{ color: "var(--text)", fontStyle: "normal" }}>alive</em> — real-time, interactive, and fast.
            My core stack is React and Next.js with TypeScript, but I reach for
            Svelte when performance is critical and PixiJS when I need the canvas
            to do something extraordinary.
          </p>
          <p>
            I&apos;ve shipped everything from multiplayer quiz games using WebSockets
            to cadastral GIS dashboards with live map layers. I&apos;m equally at home
            wiring up a complex Redux state tree as I am fine-tuning a Pixi.js
            animation pipeline.
          </p>
          <p>
            Currently exploring AI-powered application interfaces and conversational
            UX patterns — always looking to push what a browser can do. When I&apos;m
            not coding, I&apos;m thinking about game mechanics, interaction design, and
            how maps tell stories.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              flexWrap: "wrap",
              marginTop: "0.5rem",
            }}
          >
            {[
              { label: "React Ecosystem", icon: "⚛" },
              { label: "Real-time Apps", icon: "⚡" },
              { label: "Browser Games", icon: "🎮" },
              { label: "AI Interfaces", icon: "🤖" },
              { label: "Geospatial", icon: "🗺️" },
            ].map(item => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  color: "var(--text2)",
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  padding: "5px 12px",
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              color: "var(--text2)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Languages
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {languages.map(lang => (
              <div
                key={lang.name}
                style={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "0.9rem 1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", fontWeight: 700 }}>
                    {lang.name}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text2)" }}>
                    {lang.level}
                  </span>
                </div>
                <div
                  style={{
                    height: 3,
                    background: "var(--bg3)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${lang.pct}%`,
                      height: "100%",
                      background: "var(--accent)",
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
