export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "1.5rem 2rem",
        textAlign: "center",
        fontFamily: "var(--font-mono)",
        fontSize: "0.68rem",
        color: "var(--text2)",
        letterSpacing: "0.05em",
      }}
    >
      <p>Built with ♥ by Kerimberdi · {new Date().getFullYear()} · KRB.DEV</p>
    </footer>
  );
}
