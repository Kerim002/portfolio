"use client";
const links = [
  { label: "✉ Email", href: "mailto:kerimberdi2002@gmail.com" },
  { label: "in LinkedIn", href: "#" },
  { label: "⌥ GitHub", href: "#" },
  { label: "◈ Portfolio", href: "#" },
];

export default function Contact() {
  return (
    <section id="contact" style={{ maxWidth: 1200, margin: "0 auto", padding: "5rem 2rem" }}>
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
        // 005 · connect
      </p>
      <h2
        style={{
          fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
          fontWeight: 800,
          marginBottom: "2.5rem",
          letterSpacing: "-0.02em",
        }}
      >
        Get in Touch
      </h2>

      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "3rem 2.5rem",
          maxWidth: 580,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>
          Let&apos;s build something great together
        </p>
        <p
          style={{
            color: "var(--text2)",
            lineHeight: 1.75,
            marginBottom: "2rem",
            fontSize: "0.9rem",
          }}
        >
          I&apos;m open to new opportunities, collaborations, and interesting
          frontend challenges. Whether it&apos;s a full product, a game, or a
          real-time system — drop me a message.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          {links.map(l => (
            <a
              key={l.label}
              href={l.href}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                color: "var(--text)",
                textDecoration: "none",
                border: "1px solid var(--border2)",
                padding: "0.6rem 1.25rem",
                borderRadius: 5,
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
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
