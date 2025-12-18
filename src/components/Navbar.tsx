import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Rooms", href: "#rooms" },
    { name: "Gallery", href: "#gallery" },
    { name: "Tour", href: "#tour" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "glass-card shadow-lg py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-xl md:text-2xl font-bold text-primary-foreground">
                Sri Ramana Padam
              </h1>
              <p className="text-xs text-primary-foreground/80">Residency</p>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => scrollToSection(link.href)}
                  className="text-primary-foreground hover:text-accent font-medium cursor-pointer transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  onClick={() => window.open("https://jkglobalitsolutions.github.io/Sri-ramana-padam-website-dynamic-link/", "_blank")}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 animate-glow-pulse"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-primary-foreground"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          className="fixed top-0 right-0 bottom-0 w-64 bg-card z-50 shadow-2xl md:hidden"
        >
          <div className="flex flex-col h-full p-6">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="self-end text-foreground mb-8"
            >
              <X size={28} />
            </button>
            {navLinks.map((link) => (
              <a
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-foreground hover:text-primary font-medium py-3 cursor-pointer transition-colors border-b border-border"
              >
                {link.name}
              </a>
            ))}
            <Button 
              onClick={() => window.open("https://jkglobalitsolutions.github.io/Sri-ramana-padam-website-dynamic-link/", "_blank")}
              className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Phone className="w-4 h-4 mr-2" />
              Book Now
            </Button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Navbar;
