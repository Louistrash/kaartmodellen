import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function NotFoundState() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Dealer Not Found</h2>
      <p className="text-muted-foreground mb-4">The dealer you're looking for doesn't exist</p>
      <Button onClick={() => navigate("/dashboard")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
    </div>
  );
}
