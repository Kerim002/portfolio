import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <hr style={{ border: "none", borderTop: "1px solid var(--border)", maxWidth: 1200, margin: "0 auto" }} />
        <Skills />
        <hr style={{ border: "none", borderTop: "1px solid var(--border)", maxWidth: 1200, margin: "0 auto" }} />
        <Projects />
        <hr style={{ border: "none", borderTop: "1px solid var(--border)", maxWidth: 1200, margin: "0 auto" }} />
        <About />
        <hr style={{ border: "none", borderTop: "1px solid var(--border)", maxWidth: 1200, margin: "0 auto" }} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
