"use client";
const skillCategories = [
  {
    name: "Frontend",
    icon: "⬡",
    skills: ["React", "Next.js", "TypeScript", "Svelte", "PixiJS", "HTML5", "CSS3"],
  },
  {
    name: "State Management",
    icon: "⟳",
    skills: ["TanStack Query", "Redux Toolkit", "RTK Query", "Zustand"],
  },
  {
    name: "APIs & Real-time",
    icon: "⚡",
    skills: ["GraphQL", "REST API", "WebSockets", "Socket.io"],
  },
  {
    name: "UI & Tooling",
    icon: "◈",
    skills: ["Tailwind CSS", "ShadCN UI", "MUI", "Ant Design", "Radix UI", "Bootstrap", "Vite", "Webpack", "Git", "GitHub", "GitLab"],
  },
  {
    name: "Mapping & Geo",
    icon: "◎",
    skills: ["Leaflet", "OpenStreetMap", "GeoJSON"],
  },
  {
    name: "Package & Build",
    icon: "▣",
    skills: ["npm", "Yarn", "Vite", "Webpack", "Next.js build"],
  },
];

export default function Skills() {
  return (
    <section id="skills" style={{ maxWidth: 1200, margin: "0 auto", padding: "5rem 2rem" }}>
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
        // 002 · expertise
      </p>
      <h2
        style={{
          fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
          fontWeight: 800,
          marginBottom: "2.5rem",
          letterSpacing: "-0.02em",
        }}
      >
        Tech Stack
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {skillCategories.map(cat => (
          <div
            key={cat.name}
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "1.5rem",
              transition: "border-color 0.25s",
            }}
            onMouseEnter={e =>
              ((e.currentTarget as HTMLElement).style.borderColor = "var(--border2)")
            }
            onMouseLeave={e =>
              ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")
            }
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "1rem", color: "var(--accent)" }}>{cat.icon}</span>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  color: "var(--accent)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {cat.name}
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {cat.skills.map(skill => (
                <span
                  key={skill}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    color: "var(--text2)",
                    border: "1px solid var(--border)",
                    padding: "3px 10px",
                    borderRadius: 3,
                    transition: "border-color 0.2s, color 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={e => {
                    (e.target as HTMLElement).style.borderColor = "var(--accent)";
                    (e.target as HTMLElement).style.color = "var(--accent)";
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLElement).style.borderColor = "var(--border)";
                    (e.target as HTMLElement).style.color = "var(--text2)";
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
