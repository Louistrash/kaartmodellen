import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dealer } from "@/services/api";
import { Star, User, Cpu, Calendar, ImagePlus } from "lucide-react";

interface DealerInfoProps {
  dealer: Dealer;
  isPremiumChecked: boolean;
  isActiveChecked: boolean;
  onPremiumChange: () => Promise<void>;
  onActiveChange: () => Promise<void>;
}

export function DealerInfo({ 
  dealer, 
  isPremiumChecked, 
  isActiveChecked, 
  onPremiumChange, 
  onActiveChange 
}: DealerInfoProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span>Premium Dealer</span>
            </div>
            <Switch 
              checked={isPremiumChecked} 
              onCheckedChange={onPremiumChange} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Active Status</span>
            </div>
            <Switch 
              checked={isActiveChecked} 
              onCheckedChange={onActiveChange} 
            />
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Cpu className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">AI Model</span>
            </div>
            <p className="font-medium">{dealer.model}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created</span>
            </div>
            <p className="font-medium">
              {new Date(dealer.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <ImagePlus className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Outfit Progress</span>
            </div>
            <div className="flex items-center">
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-primary rounded-full h-2.5" 
                  style={{ width: `${(dealer.outfits.length / 5) * 100}%` }}
                />
              </div>
              <span className="ml-2 text-sm font-medium">{dealer.outfits.length}/5</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">API Access</h3>
        <p className="text-sm text-muted-foreground">
          Access this dealer's images through the API using the following endpoint:
        </p>
        <code className="block p-3 bg-muted text-sm rounded-md overflow-auto">
          GET /api/dealer/{dealer.id}/outfit/[stage]
        </code>
      </div>
    </div>
  );
}
