"use client";
const projects = [
  {
    icon: "🎮",
    name: "Quiz Masters",
    desc: "Real-time multiplayer learning game platform. Players compete live, answer questions, and climb leaderboards — powered entirely by WebSockets.",
    tags: ["Svelte", "WebSockets", "Real-time", "Multiplayer"],
    accent: "#6c5ce7",
  },
  {
    icon: "🤖",
    name: "AI Chat Application",
    desc: "ChatGPT-style application with streaming responses, multi-turn conversation history, and a polished conversational UI with dark/light modes.",
    tags: ["React", "TypeScript", "Streaming API", "AI"],
    accent: "#00cec9",
  },
  {
    icon: "🗺️",
    name: "Cadastral Dashboard",
    desc: "Interactive geospatial platform for land registry data. Built with Leaflet, OpenStreetMap, and rich GeoJSON visualization layers.",
    tags: ["Leaflet", "OpenStreetMap", "GeoJSON", "Next.js"],
    accent: "#fdcb6e",
  },
  {
    icon: "📱",
    name: "Short Video Platform",
    desc: "TikTok-inspired content platform with infinite scroll, content moderation pipeline, admin dashboard, and role-based access control.",
    tags: ["Next.js", "Redux Toolkit", "RTK Query", "Admin"],
    accent: "#fd79a8",
  },
];

export default function Projects() {
  return (
    <section id="projects" style={{ maxWidth: 1200, margin: "0 auto", padding: "5rem 2rem" }}>
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
        // 003 · work
      </p>
      <h2
        style={{
          fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
          fontWeight: 800,
          marginBottom: "2.5rem",
          letterSpacing: "-0.02em",
        }}
      >
        Featured Projects
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {projects.map(p => (
          <div
            key={p.name}
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "1.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              transition: "border-color 0.25s, transform 0.25s",
              cursor: "default",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = p.accent;
              el.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--border)";
              el.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
              }}
            >
              {p.icon}
            </div>

            <div>
              <p style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                {p.name}
              </p>
              <p style={{ fontSize: "0.875rem", color: "var(--text2)", lineHeight: 1.65 }}>
                {p.desc}
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "auto" }}>
              {p.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.62rem",
                    color: p.accent,
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    padding: "2px 9px",
                    borderRadius: 3,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
