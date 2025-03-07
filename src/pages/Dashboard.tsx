import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import { Navbar } from "@/components/Navbar";
import { DealerCard } from "@/components/DealerCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dealer, api } from "@/services/api";
import { Plus, Search } from "lucide-react";

export default function Dashboard() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const data = await api.getDealers();
        setDealers(data);
      } catch (error) {
        console.error("Failed to fetch dealers", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDealers();
  }, []);

  // Filter dealers based on search query and active tab
  const filteredDealers = dealers.filter((dealer) => {
    const matchesSearch = dealer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        dealer.personality.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "premium") return matchesSearch && dealer.isPremium;
    if (activeTab === "incomplete") return matchesSearch && dealer.outfits.length < 5;
    
    return matchesSearch;
  });

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 container pt-24 pb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Dealers Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your AI-generated dealer models</p>
            </div>
            
            <Button asChild size="default">
              <Link to="/dealer/new">
                <Plus className="mr-2 h-4 w-4" />
                New Dealer
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search dealers..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="premium">Premium</TabsTrigger>
                <TabsTrigger value="incomplete">Incomplete</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-md aspect-[3/4]" />
                  <div className="mt-4 space-y-2">
                    <div className="h-5 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredDealers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredDealers.map((dealer, index) => (
                <DealerCard key={dealer.id} dealer={dealer} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No dealers found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search or create a new dealer</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/dealer/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Dealer
                </Link>
              </Button>
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
