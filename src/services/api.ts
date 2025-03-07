import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Types
export interface Dealer {
  id: string;
  name: string;
  personality: string;
  model: string;
  isActive: boolean;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  outfits: DealerOutfit[];
}

export interface DealerOutfit {
  id: string;
  stage: number;
  name: string;
  imageUrl: string;
  approved: boolean;
}

export type OutfitStage = 1 | 2 | 3 | 4 | 5;

export interface GenerateImageParams {
  prompt: string;
  model: string;
  apiKey?: string;
  referenceImageUrl?: string;
}

// Mock data
const MOCK_DEALERS: Dealer[] = [
  {
    id: "1",
    name: "Sophia",
    personality: "Elegant & Sophisticated",
    model: "Stable Diffusion XL",
    isActive: true,
    isPremium: true,
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-06-10T14:45:00Z",
    outfits: [
      {
        id: "o1",
        stage: 1,
        name: "Casino Uniform",
        imageUrl: "https://images.unsplash.com/photo-1589135006062-5b7e4a749194?q=80&w=300&h=400&auto=format&fit=crop",
        approved: true
      },
      {
        id: "o2",
        stage: 2,
        name: "Relaxed Attire",
        imageUrl: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?q=80&w=300&h=400&auto=format&fit=crop",
        approved: true
      },
      {
        id: "o3",
        stage: 3,
        name: "Formal Look",
        imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=300&h=400&auto=format&fit=crop",
        approved: true
      },
    ]
  },
  {
    id: "2",
    name: "Isabella",
    personality: "Playful & Charming",
    model: "DALL·E 3",
    isActive: true,
    isPremium: false,
    createdAt: "2023-07-20T08:15:00Z",
    updatedAt: "2023-08-05T11:30:00Z",
    outfits: [
      {
        id: "o4",
        stage: 1,
        name: "Casino Uniform",
        imageUrl: "https://images.unsplash.com/photo-1618400954958-b93e73cbacde?q=80&w=300&h=400&auto=format&fit=crop",
        approved: true
      },
      {
        id: "o5",
        stage: 2,
        name: "Relaxed Attire",
        imageUrl: "https://images.unsplash.com/photo-1546975554-31053113e977?q=80&w=300&h=400&auto=format&fit=crop",
        approved: true
      },
    ]
  }
];

// API Service
class ApiService {
  // Get all dealers
  async getDealers(): Promise<Dealer[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...MOCK_DEALERS];
  }

  // Get dealer by ID
  async getDealer(id: string): Promise<Dealer | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if this is one of our new dealers (with "new-" prefix)
    if (id.startsWith('new-')) {
      // Find the dealer in the temporary storage
      const newDealerJson = localStorage.getItem(`dealer:${id}`);
      if (newDealerJson) {
        return JSON.parse(newDealerJson);
      }
    }
    
    const dealer = MOCK_DEALERS.find(d => d.id === id);
    return dealer ? { ...dealer } : null;
  }

  // Create a new dealer
  async createDealer(dealer: Omit<Dealer, 'id' | 'createdAt' | 'updatedAt' | 'outfits'>): Promise<Dealer> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newId = `new-${Math.floor(Math.random() * 10000)}`;
    const createdDate = new Date().toISOString();
    
    const newDealer: Dealer = {
      id: newId,
      ...dealer,
      outfits: [],
      createdAt: createdDate,
      updatedAt: createdDate,
    };
    
    // Store the new dealer in localStorage to persist between page reloads
    localStorage.setItem(`dealer:${newId}`, JSON.stringify(newDealer));
    
    // Also add to our in-memory array for listings
    MOCK_DEALERS.push(newDealer);
    
    return newDealer;
  }

  // Update a dealer
  async updateDealer(id: string, updates: Partial<Dealer>): Promise<Dealer> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find the dealer
    let dealer;
    let isNewDealer = false;
    
    if (id.startsWith('new-')) {
      const dealerJson = localStorage.getItem(`dealer:${id}`);
      if (dealerJson) {
        dealer = JSON.parse(dealerJson);
        isNewDealer = true;
      }
    } else {
      dealer = MOCK_DEALERS.find(d => d.id === id);
    }
    
    if (!dealer) {
      throw new Error("Dealer not found");
    }
    
    const updatedDealer = { ...dealer, ...updates, updatedAt: new Date().toISOString() };
    
    // Update the dealer in the appropriate storage
    if (isNewDealer) {
      localStorage.setItem(`dealer:${id}`, JSON.stringify(updatedDealer));
      
      // Also update in mock array
      const index = MOCK_DEALERS.findIndex(d => d.id === id);
      if (index >= 0) {
        MOCK_DEALERS[index] = updatedDealer;
      }
    } else {
      // Update in mock array
      const index = MOCK_DEALERS.findIndex(d => d.id === id);
      if (index >= 0) {
        MOCK_DEALERS[index] = updatedDealer;
      }
    }
    
    return updatedDealer;
  }

  // Delete a dealer
  async deleteDealer(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    if (id.startsWith('new-')) {
      localStorage.removeItem(`dealer:${id}`);
    }
    
    // Remove from mock array
    const index = MOCK_DEALERS.findIndex(d => d.id === id);
    if (index >= 0) {
      MOCK_DEALERS.splice(index, 1);
    }
    
    return true;
  }

  // Generate an image using AI
  async generateImage(params: GenerateImageParams): Promise<string> {
    try {
      console.log('Generating image with params:', {
        prompt: params.prompt,
        model: params.model
      });
      
      // Only use the two supported models
      let modelToUse = params.model;
      if (!['DALL·E 3', 'GetImg.ai'].includes(modelToUse)) {
        console.log(`Unsupported model ${modelToUse}, defaulting to DALL·E 3`);
        modelToUse = 'DALL·E 3';
      }
      
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          prompt: params.prompt,
          model: modelToUse,
        },
      });

      if (error) {
        console.error('Error from Supabase function:', error);
        throw new Error(error.message || 'Failed to generate image');
      }

      console.log('Response from Supabase function:', data);

      if (!data?.imageUrl) {
        console.error('No image URL returned from function:', data);
        throw new Error(data?.error || 'No image URL returned');
      }

      // Validate the image URL
      if (!this.isValidUrl(data.imageUrl)) {
        console.error('Invalid image URL returned:', data.imageUrl);
        throw new Error('Invalid image URL returned');
      }

      return data.imageUrl;
    } catch (error) {
      console.error('Image generation error:', error);
      toast.error(`Failed to generate image: ${error.message || 'Unknown error'}`);
      throw error;
    }
  }

  // Helper to validate URLs
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Add a new outfit to a dealer
  async addOutfit(dealerId: string, outfit: Omit<DealerOutfit, 'id'>): Promise<DealerOutfit> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const newOutfit: DealerOutfit = {
      id: `outfit-${Math.floor(Math.random() * 10000)}`,
      ...outfit,
    };
    
    // Find the dealer and add the outfit
    const dealer = await this.getDealer(dealerId);
    if (dealer) {
      // Filter out any existing outfits with the same stage
      const updatedOutfits = dealer.outfits.filter(o => o.stage !== outfit.stage);
      updatedOutfits.push(newOutfit);
      
      // Update the dealer
      await this.updateDealer(dealerId, { outfits: updatedOutfits });
    }
    
    return newOutfit;
  }

  // Approve an outfit
  async approveOutfit(dealerId: string, outfitId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the dealer
    const dealer = await this.getDealer(dealerId);
    if (dealer) {
      // Find and update the outfit
      const updatedOutfits = dealer.outfits.map(outfit => 
        outfit.id === outfitId ? { ...outfit, approved: true } : outfit
      );
      
      // Update the dealer
      await this.updateDealer(dealerId, { outfits: updatedOutfits });
    }
    
    return true;
  }
}

// Create and export a singleton instance
export const api = new ApiService();
