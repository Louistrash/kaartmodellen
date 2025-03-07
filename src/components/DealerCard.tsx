import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dealer } from "@/services/api";
import { Loader2, AlertTriangle } from "lucide-react";

interface DealerCardProps {
  dealer: Dealer;
  index: number;
}

export function DealerCard({ dealer, index }: DealerCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Get the first outfit image or use a placeholder
  const coverImage = dealer.outfits.length > 0
    ? dealer.outfits[0].imageUrl
    : "/placeholder.svg";

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error(`Failed to load image for dealer ${dealer.name}. Image URL: ${coverImage}`);
    setIsImageLoading(false);
    setImageError(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link to={`/dealer/${dealer.id}`}>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] h-full">
          <div className="relative aspect-[3/4] overflow-hidden bg-muted">
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            
            {imageError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="flex flex-col items-center space-y-2 text-center p-4">
                  <AlertTriangle className="h-8 w-8 text-amber-500" />
                  <p className="text-sm text-muted-foreground">Image not available</p>
                </div>
              </div>
            ) : (
              <img
                src={coverImage}
                alt={dealer.name}
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
            
            {dealer.isPremium && (
              <Badge className="absolute top-2 right-2 bg-primary/90 hover:bg-primary">
                Premium
              </Badge>
            )}
          </div>
          <CardContent className="pt-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{dealer.name}</h3>
                <p className="text-sm text-muted-foreground">{dealer.personality}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4 text-sm text-muted-foreground">
            <span>{dealer.model}</span>
            <span>{dealer.outfits.length}/5 Outfits</span>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
