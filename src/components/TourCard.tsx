import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface TourCardProps {
  name: string;
  image: string;
  description: string;
  distance: string;
  index: number;
}

const TourCard = ({ name, image, description, distance, index }: TourCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ y: -10 }}
    >
      <Card className="overflow-hidden hover:shadow-[0_10px_40px_-10px_hsl(var(--secondary)/0.4)] transition-all duration-500 group cursor-pointer">
        <div className="relative h-56 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
            <div className="flex items-center gap-1 text-white/90">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{distance}</span>
            </div>
          </div>
        </div>
        <div className="p-5">
          <p className="text-muted-foreground">{description}</p>
        </div>
      </Card>
    </motion.div>
  );
};

export default TourCard;
