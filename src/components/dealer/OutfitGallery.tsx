import { Button } from "@/components/ui/button";
import { ImageStagePreview } from "@/components/ImageStagePreview";
import { ImagePlus } from "lucide-react";
import { Dealer, DealerOutfit, OutfitStage } from "@/services/api";

// Define the outfit stages
export const OUTFIT_STAGES = [
  { stage: 1, name: "Casino Uniform" },
  { stage: 2, name: "Relaxed Attire" },
  { stage: 3, name: "Casual/Formal" },
  { stage: 4, name: "Cocktail Attire" },
  { stage: 5, name: "Swimsuit/Lingerie" },
];

interface OutfitGalleryProps {
  dealer: Dealer;
  generatingStage: OutfitStage | null;
  onApproveOutfit: (outfitId: string) => Promise<void>;
  onGenerateImage: (stage: OutfitStage) => Promise<void>;
}

export function OutfitGallery({
  dealer,
  generatingStage,
  onApproveOutfit,
  onGenerateImage,
}: OutfitGalleryProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">Outfit Progression</h2>
        <Button variant="outline" size="sm">
          <ImagePlus className="mr-2 h-4 w-4" />
          Batch Generate All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {OUTFIT_STAGES.map(({ stage, name }) => {
          const existingOutfit = dealer.outfits.find(o => o.stage === stage);
          const isGenerating = generatingStage === stage;
          
          return (
            <ImageStagePreview
              key={stage}
              stage={stage as OutfitStage}
              stageName={name}
              outfit={existingOutfit}
              onApprove={onApproveOutfit}
              onRegenerate={() => onGenerateImage(stage as OutfitStage)}
              isGenerating={isGenerating}
            />
          );
        })}
      </div>
    </div>
  );
}
