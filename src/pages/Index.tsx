import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import { motion } from "framer-motion";

export default function Index() {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container flex items-center justify-center py-24">
          <div className="max-w-4xl w-full">
            <div className="text-center space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                  Flirty Dealers Dashboard
                </h1>
                <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
                  Create, manage, and train AI-generated dealer images for your Blackjack application
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
              >
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link to="/dashboard">
                    Go to Dashboard
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link to="/login">
                    Admin Login
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="pt-12"
              >
                <div className="bg-muted/50 border backdrop-blur-sm rounded-xl overflow-hidden shadow-lg">
                  <div className="aspect-video relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-background/0 to-background/80 flex items-end">
                      <div className="p-8 text-left">
                        <h2 className="text-2xl font-bold mb-2">AI-Powered Dealer Images</h2>
                        <p className="text-muted-foreground">
                          Create consistent dealer personalities with progressive outfit stages
                        </p>
                      </div>
                    </div>
                    <div className="p-4 grid grid-cols-5 gap-4 h-full">
                      {[1, 2, 3, 4, 5].map((stage) => (
                        <div key={stage} className="bg-background rounded-lg shadow-sm overflow-hidden">
                          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                            Stage {stage}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
        
        <footer className="border-t py-6">
          <div className="container flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Flirty Blackjack. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                API
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
