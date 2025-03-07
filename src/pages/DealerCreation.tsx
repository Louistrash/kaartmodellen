import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { api } from "@/services/api";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

const AI_MODELS = [
  { id: "dall-e-3", name: "DALL·E 3" },
  { id: "stable-diffusion-xl", name: "Stable Diffusion XL" },
  { id: "midjourney", name: "Midjourney" },
  { id: "getimg-ai", name: "GetImg.ai" },
];

const PERSONALITY_TYPES = [
  "Elegant & Sophisticated",
  "Playful & Flirty",
  "Professional & Focused",
  "Mysterious & Alluring",
  "Friendly & Approachable",
  "Bold & Confident",
];

export default function DealerCreation() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    personality: "",
    model: "",
    customPrompt: "",
    isPremium: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormState(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formState.name || !formState.personality || !formState.model) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    setIsCreating(true);
    
    try {
      const newDealer = await api.createDealer({
        name: formState.name,
        personality: formState.personality,
        model: AI_MODELS.find(m => m.id === formState.model)?.name || formState.model,
        isActive: true,
        isPremium: formState.isPremium,
      });
      
      toast.success("Dealer created successfully");
      navigate(`/dealer/${newDealer.id}`);
    } catch (error) {
      console.error("Failed to create dealer", error);
      toast.error("Failed to create dealer");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 container pt-24 pb-16">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-6" 
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Create New Dealer</h1>
            <p className="text-muted-foreground mb-8">
              Define your dealer's characteristics before generating outfit images
            </p>
            
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Dealer Details</CardTitle>
                  <CardDescription>
                    These details will be used to create consistent AI-generated images
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Dealer Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter dealer name"
                      value={formState.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="personality">Personality Type</Label>
                    <Select
                      value={formState.personality}
                      onValueChange={(value) => handleSelectChange("personality", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select personality type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PERSONALITY_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="model">AI Image Model</Label>
                    <Select
                      value={formState.model}
                      onValueChange={(value) => handleSelectChange("model", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select AI model" />
                      </SelectTrigger>
                      <SelectContent>
                        {AI_MODELS.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      This determines which AI service will generate dealer images
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="customPrompt">Custom Prompt Template (Optional)</Label>
                    <Textarea
                      id="customPrompt"
                      name="customPrompt"
                      placeholder="Add specific details to maintain visual consistency..."
                      value={formState.customPrompt}
                      onChange={handleInputChange}
                      className="min-h-24"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Advanced: Add custom prompt details to ensure consistent appearance across all images
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPremium"
                      checked={formState.isPremium}
                      onCheckedChange={(checked) => handleSwitchChange("isPremium", checked)}
                    />
                    <Label htmlFor="isPremium">Premium Dealer</Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Dealer
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
