import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DealerOutfit, OutfitStage } from "@/services/api";
import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";

interface ImageStagePreviewProps {
  outfit?: DealerOutfit;
  stage: OutfitStage;
  stageName: string;
  onApprove?: (outfitId: string) => Promise<void>;
  onRegenerate?: (stage: OutfitStage) => Promise<void>;
  isGenerating?: boolean;
}

const stageColors: Record<OutfitStage, string> = {
  1: "bg-blue-100 text-blue-800",
  2: "bg-green-100 text-green-800",
  3: "bg-purple-100 text-purple-800",
  4: "bg-amber-100 text-amber-800",
  5: "bg-rose-100 text-rose-800",
};

export function ImageStagePreview({
  outfit,
  stage,
  stageName,
  onApprove,
  onRegenerate,
  isGenerating = false,
}: ImageStagePreviewProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleApprove = async () => {
    if (outfit && onApprove) {
      await onApprove(outfit.id);
    }
  };

  const handleRegenerate = async () => {
    if (onRegenerate) {
      setIsImageLoading(true);
      setImageError(false);
      await onRegenerate(stage);
    }
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error(`Failed to load image for stage ${stage}. Image URL: ${outfit?.imageUrl}`);
    setIsImageLoading(false);
    setImageError(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: stage * 0.05 }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="p-3 border-b flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge className={stageColors[stage]}>Stage {stage}</Badge>
            <h3 className="font-medium text-sm">{stageName}</h3>
          </div>
          {outfit?.approved && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="mr-1 h-3 w-3" />
              Approved
            </Badge>
          )}
        </div>
        
        <div className="relative flex-grow aspect-[3/4] bg-muted">
          {isGenerating ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-xs">
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium">Generating image...</p>
              </div>
            </div>
          ) : outfit?.imageUrl ? (
            <>
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {imageError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="flex flex-col items-center space-y-2 text-center p-4">
                    <AlertTriangle className="h-8 w-8 text-amber-500" />
                    <p className="text-sm font-medium">Image failed to load</p>
                    <p className="text-xs text-muted-foreground">Try regenerating the image</p>
                  </div>
                </div>
              ) : (
                <img
                  src={outfit.imageUrl}
                  alt={`Stage ${stage}: ${stageName}`}
                  className="object-cover w-full h-full"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <p className="text-muted-foreground text-sm">No image generated yet</p>
            </div>
          )}
        </div>
        
        <CardContent className="pt-3 pb-3 flex justify-between gap-2">
          {outfit && !outfit.approved && onApprove && !imageError && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={handleApprove}
            >
              <CheckCircle className="mr-1 h-3.5 w-3.5" />
              Approve
            </Button>
          )}
          
          {onRegenerate && (
            <Button
              variant={outfit && !outfit.approved && !imageError ? "outline" : "default"}
              size="sm"
              className="flex-1 text-xs"
              onClick={handleRegenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              ) : (
                <XCircle className="mr-1 h-3.5 w-3.5" />
              )}
              {imageError ? "Try Again" : "Regenerate"}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
