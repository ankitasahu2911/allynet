import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Footer from "../components/Footer";
import PublicBlogList from "../components/PublicBlogList";
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <PublicBlogList />
      <Footer />
    </>
  );
}
