import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Dealer } from "@/services/api";
import { toast } from "sonner";

interface DealerHeaderProps {
  dealer: Dealer;
  onDelete: () => Promise<void>;
}

export function DealerHeader({ dealer, onDelete }: DealerHeaderProps) {
  const navigate = useNavigate();

  const handleDeleteDealer = async () => {
    if (!confirm("Are you sure you want to delete this dealer? This action cannot be undone.")) return;
    
    try {
      await onDelete();
      toast.success("Dealer deleted successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to delete dealer");
    }
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{dealer.name}</h1>
          <p className="text-muted-foreground">{dealer.personality}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="text-destructive" 
            onClick={handleDeleteDealer}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
