import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { Dealer, OutfitStage, api } from "@/services/api";

// Import our new components
import { DealerHeader } from "@/components/dealer/DealerHeader";
import { DealerInfo } from "@/components/dealer/DealerInfo";
import { OutfitGallery, OUTFIT_STAGES } from "@/components/dealer/OutfitGallery";
import { LoadingState } from "@/components/dealer/LoadingState";
import { NotFoundState } from "@/components/dealer/NotFoundState";

export default function DealerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremiumChecked, setIsPremiumChecked] = useState(false);
  const [isActiveChecked, setIsActiveChecked] = useState(false);
  const [generatingStage, setGeneratingStage] = useState<OutfitStage | null>(null);

  useEffect(() => {
    const fetchDealer = async () => {
      if (!id) return;
      
      try {
        const data = await api.getDealer(id);
        setDealer(data);
        if (data) {
          setIsPremiumChecked(data.isPremium);
          setIsActiveChecked(data.isActive);
        }
      } catch (error) {
        console.error("Failed to fetch dealer", error);
        toast.error("Failed to load dealer details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDealer();
  }, [id]);

  const handlePremiumChange = async () => {
    if (!dealer) return;
    
    const newValue = !isPremiumChecked;
    setIsPremiumChecked(newValue);
    
    try {
      await api.updateDealer(dealer.id, { isPremium: newValue });
      toast.success(`Dealer is ${newValue ? 'now' : 'no longer'} premium`);
    } catch (error) {
      setIsPremiumChecked(!newValue); // Revert on failure
      toast.error("Failed to update premium status");
    }
  };

  const handleActiveChange = async () => {
    if (!dealer) return;
    
    const newValue = !isActiveChecked;
    setIsActiveChecked(newValue);
    
    try {
      await api.updateDealer(dealer.id, { isActive: newValue });
      toast.success(`Dealer is ${newValue ? 'now active' : 'now inactive'}`);
    } catch (error) {
      setIsActiveChecked(!newValue); // Revert on failure
      toast.error("Failed to update active status");
    }
  };

  const handleDeleteDealer = async () => {
    if (!dealer) return;
    
    try {
      await api.deleteDealer(dealer.id);
      // The actual navigation happens in the DealerHeader component
    } catch (error) {
      toast.error("Failed to delete dealer");
    }
  };

  const handleApproveOutfit = async (outfitId: string) => {
    if (!dealer) return;
    
    try {
      await api.approveOutfit(dealer.id, outfitId);
      setDealer(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          outfits: prev.outfits.map(outfit => 
            outfit.id === outfitId ? { ...outfit, approved: true } : outfit
          )
        };
      });
      
      toast.success("Outfit approved");
    } catch (error) {
      toast.error("Failed to approve outfit");
    }
  };

  const handleGenerateImage = async (stage: OutfitStage) => {
    if (!dealer) return;
    
    setGeneratingStage(stage);
    const stageInfo = OUTFIT_STAGES.find(s => s.stage === stage);
    
    try {
      const stagePrompt = stageInfo?.name || `Stage ${stage}`;
      const detailedPrompt = `${dealer.personality} dealer in ${stagePrompt} outfit, high quality, detailed, professional, casino setting, blackjack table, clear face, good lighting`;
      
      const imageUrl = await api.generateImage({
        prompt: detailedPrompt,
        model: dealer.model,
      });
      
      const newOutfit = await api.addOutfit(dealer.id, {
        stage,
        name: stageInfo?.name || `Stage ${stage}`,
        imageUrl,
        approved: false,
      });
      
      setDealer(prev => {
        if (!prev) return null;
        
        const outfits = prev.outfits.filter(o => o.stage !== stage);
        
        return {
          ...prev,
          outfits: [...outfits, newOutfit],
        };
      });
      
      toast.success(`Generated ${stageInfo?.name} image`);
    } catch (error) {
      console.error("Image generation error:", error);
      toast.error(`Failed to generate image: ${error.message || "Unknown error"}`);
    } finally {
      setGeneratingStage(null);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 container pt-24 pb-16">
          {isLoading ? (
            <LoadingState />
          ) : !dealer ? (
            <NotFoundState />
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3 space-y-6">
                <DealerHeader 
                  dealer={dealer} 
                  onDelete={handleDeleteDealer} 
                />
                
                <DealerInfo 
                  dealer={dealer}
                  isPremiumChecked={isPremiumChecked}
                  isActiveChecked={isActiveChecked}
                  onPremiumChange={handlePremiumChange}
                  onActiveChange={handleActiveChange}
                />
              </div>
              
              <div className="lg:w-2/3">
                <OutfitGallery 
                  dealer={dealer}
                  generatingStage={generatingStage}
                  onApproveOutfit={handleApproveOutfit}
                  onGenerateImage={handleGenerateImage}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
