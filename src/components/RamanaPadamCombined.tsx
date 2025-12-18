import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Menu, X, Wifi, Tv, Wind, Coffee, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import heroImage from "@/assets/hero-arunachala.png";
import hotelExterior from "@/assets/hotel-exterior.jpeg";
import roomDeluxe from "@/assets/room-deluxe.jpeg";
import roomDeluxe2 from "@/assets/room-deluxe-2.jpeg";
import roomDeluxe3 from "@/assets/room-deluxe-3.jpeg";
import roomStandard from "@/assets/room-standard.jpeg";
import roomStandard2 from "@/assets/room-standard-2.jpeg";
import roomStandard3 from "@/assets/room-standard-3.jpeg";
import templeImage from "@/assets/temple.jpg";
import ashramImage from "@/assets/ashram.jpg";
import caveImage from "@/assets/cave.jpg";
import mandalaLoader from "@/assets/logo.jpg";
import familyRoom1 from "@/assets/104.jpeg";
import familyRoom2 from "@/assets/104 (3)_imresizer.jpg";
import familyRoom3 from "@/assets/104 (2)_imresizer.jpg";

const RamanaPadamCombined = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle preloader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Navigation links
  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Rooms", href: "#rooms" },
    { name: "Gallery", href: "#gallery" },
    { name: "Tour", href: "#tour" },
    { name: "Contact", href: "#contact" },
  ];

  // Room data
  const rooms = [
    {
      name: "Deluxe Suite",
      images: [roomDeluxe, roomDeluxe2, roomDeluxe3],
      price: "₹2,500",
      features: ["Wi-Fi", "AC", "TV", "Room Service"],
    },
    {
      name: "Standard Room",
      images: [roomStandard, roomStandard2, roomStandard3],
      price: "₹1,800",
      features: ["Wi-Fi", "AC", "TV", "Room Service"],
    },
    {
      name: "Family Room",
      images: [familyRoom1, familyRoom2, familyRoom3],
      price: "₹3,200",
      features: ["Wi-Fi", "AC", "TV", "Room Service", "Extra Space"],
    },
  ];

  // Attractions data
  const attractions = [
    {
      name: "Arunachaleswarar Temple",
      image: templeImage,
      description: "Ancient temple dedicated to Lord Shiva, one of the largest in South India.",
      distance: "2 km away",
    },
    {
      name: "Sri Ramana Ashram",
      image: ashramImage,
      description: "Peaceful ashram where Sri Ramana Maharshi lived and taught for decades.",
      distance: "1.5 km away",
    },
    {
      name: "Yogi Ram Ashram",
      image: caveImage,
      description: "Sri Yogi Ramsuratkumar Ashram is a serene place to visit in tiruvannamalai. It has a huge samadhi hall where Bhajans and Pooja go on every day. ",
      distance: "1 km away",
    },
  ];

  // Feature icons
  const featureIcons: Record<string, any> = {
    "Wi-Fi": Wifi,
    "TV": Tv,
    "AC": Wind,
    "Room Service": Coffee,
    "Bike Rental ": Bike,
    "Extra Space": MapPin,
  };

  // Scroll to section function
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Preloader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-secondary"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.img
                src={mandalaLoader}
                alt="Loading..."
                className="w-32 h-32 mb-6 animate-spin-slow"
                style={{ filter: "drop-shadow(0 0 30px rgba(255, 255, 255, 0.5))" }}
              />
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-bold text-primary-foreground glow-text"
              >
                Sri Ramana Padam Residency
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-2 text-primary-foreground/80"
              >
                A Peaceful Retreat Awaits
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
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
                  onClick={() => scrollToSection("#contact")}
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
              onClick={() => scrollToSection("#contact")}
              className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Phone className="w-4 h-4 mr-2" />
              Book Now
            </Button>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 parallax-bg"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-10 text-center px-4"
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 glow-text"
          >
            Sri Ramana Padam Residency
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto"
          >
            A Peaceful Stay Near the Holy Arunachala Hill
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Button
              onClick={() => scrollToSection("#contact")}
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 animate-glow-pulse"
            >
              <Phone className="w-5 h-5 mr-2" />
              Book Your Stay
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-primary-foreground/50 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                src={hotelExterior}
                alt="Sri Ramana Padam Residency"
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div>
              <motion.h2
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold mb-6 text-foreground"
              >
                Welcome to Sri Ramana Padam Residency
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-muted-foreground mb-6 leading-relaxed"
              >
                Located in the heart of Tiruvannamalai, our residency offers a perfect blend of comfort and spirituality. 
                Just minutes away from the sacred Arunachala Hill and Sri Ramana Ashram, we provide a peaceful sanctuary 
                for pilgrims and travelers seeking divine experiences.
              </motion.p>
              <motion.blockquote
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="border-l-4 border-primary pl-6 py-4 italic text-foreground/80 text-lg"
              >
                "Peace begins where silence speaks."
                <footer className="text-sm mt-2 text-muted-foreground">— Sri Ramana Maharshi</footer>
              </motion.blockquote>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Our Comfortable Rooms
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our range of well-appointed rooms, designed for your comfort and peace of mind
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {rooms.map((room, index) => (
              <motion.div
                key={room.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="overflow-hidden hover:shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.3)] transition-all duration-500 group h-full flex flex-col">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {room.images.map((image, idx) => (
                        <CarouselItem key={idx}>
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={image}
                              alt={`${room.name} - View ${idx + 1}`}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </Carousel>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-foreground">{room.name}</h3>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">{room.price}</p>
                        <p className="text-xs text-muted-foreground">per night</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-6 flex-1">
                      {room.features.map((feature) => {
                        const Icon = featureIcons[feature] || Coffee;
                        return (
                          <div key={feature} className="flex items-center gap-2 text-muted-foreground">
                            <Icon className="w-3 h-3 text-secondary flex-shrink-0" />
                            <span className="text-xs truncate">{feature}</span>
                          </div>
                        );
                      })}
                    </div>

                    <Button 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 group-hover:shadow-[0_0_20px_hsl(var(--primary-glow)/0.5)] mt-auto"
                      onClick={() => scrollToSection("#contact")}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Gallery
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore our beautiful accommodations and surroundings
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[roomDeluxe, roomStandard, hotelExterior, templeImage, ashramImage, caveImage].map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative h-64 overflow-hidden rounded-lg cursor-pointer group"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Section */}
      <section id="tour" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Nearby Sacred Places
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the spiritual treasures surrounding our residency
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {attractions.map((attraction, index) => (
              <motion.div
                key={attraction.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -10 }}
              >
                <Card className="overflow-hidden hover:shadow-[0_10px_40px_-10px_hsl(var(--secondary)/0.4)] transition-all duration-500 group cursor-pointer">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{attraction.name}</h3>
                      <div className="flex items-center gap-1 text-white/90">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{attraction.distance}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-muted-foreground">{attraction.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Get in Touch
            </h2>
            <p className="text-lg text-muted-foreground">
              We're here to help make your stay memorable
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Address</h3>
                  <p className="text-muted-foreground">
                    Mathalangula St., Mathalangulam<br />
                    Tiruvannamalai, Tamil Nadu 606601
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-secondary/10 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Phone</h3>
                  <a href="tel:09943177729" className="text-muted-foreground hover:text-primary transition-colors">
                    09361737316
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Email</h3>
                  <a href="mailto:info@sriramanapadam.com" className="text-muted-foreground hover:text-primary transition-colors">
                    sriramanapadamresidency@gmail.com
                  </a>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => window.location.href = "tel:09943177729"}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => window.open("https://maps.google.com/?q=Mathalangula+St+Tiruvannamalai", "_blank")}
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Get Directions
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="h-96 rounded-lg overflow-hidden shadow-2xl"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.0!2d79.0747!3d12.2253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDEzJzMxLjEiTiA3OcKwMDQnMjguOSJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-primary via-primary/90 to-secondary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Sri Ramana Padam Residency</h3>
              <p className="text-primary-foreground/80">
                A peaceful sanctuary near the holy Arunachala Hill, offering comfort and tranquility for spiritual seekers.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {["Home", "About", "Rooms", "Gallery", "Tour", "Contact"].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      onClick={() => scrollToSection(`#${link.toLowerCase()}`)}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="bg-primary-foreground/10 p-3 rounded-full hover:bg-primary-foreground/20 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="bg-primary-foreground/10 p-3 rounded-full hover:bg-primary-foreground/20 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="bg-primary-foreground/10 p-3 rounded-full hover:bg-primary-foreground/20 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-8 text-center">
            <p className="text-primary-foreground/80">
              © 2025 Sri Ramana Padam Residency — Designed with ❤️ in Tiruvannamalai
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default RamanaPadamCombined;
