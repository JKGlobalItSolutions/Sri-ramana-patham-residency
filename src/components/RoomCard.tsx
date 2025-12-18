import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Wifi, Tv, Wind, Coffee, Phone, Bike } from "lucide-react";

interface RoomCardProps {
  name: string;
  images: string[];
  price: string;
  features: string[];
  index: number;
}

const RoomCard = ({ name, images, price, features, index }: RoomCardProps) => {
  const featureIcons: Record<string, any> = {
    "Wi-Fi": Wifi,
    "TV": Tv,
    "AC": Wind,
    "Room Service": Coffee,
    "Bike Rental ": Bike,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      <Card className="overflow-hidden hover:shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.3)] transition-all duration-500 group">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, idx) => (
              <CarouselItem key={idx}>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={image}
                    alt={`${name} - View ${idx + 1}`}
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

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-foreground">{name}</h3>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{price}</p>
              <p className="text-sm text-muted-foreground">per night</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {features.map((feature) => {
              const Icon = featureIcons[feature] || Coffee;
              return (
                <div key={feature} className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="w-4 h-4 text-secondary" />
                  <span className="text-sm">{feature}</span>
                </div>
              );
            })}
          </div>

          <Button 
            onClick={() => window.open("https://jkglobalitsolutions.github.io/Sri-ramana-padam-website-dynamic-link/", "_blank")}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 group-hover:shadow-[0_0_20px_hsl(var(--primary-glow)/0.5)]"
          >
            <Phone className="w-4 h-4 mr-2" />
            Book Now
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default RoomCard;
