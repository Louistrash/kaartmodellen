import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { LucideLayoutDashboard, LucidePlus, LucideSettings, LucideLogOut } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LucideLayoutDashboard },
    { name: "New Dealer", path: "/dealer/new", icon: LucidePlus },
    { name: "Settings", path: "/settings", icon: LucideSettings },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xs",
        scrolled ? "bg-background/80 border-b" : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Flirty Dealers</span>
          </Link>
          
          {user && (
            <nav className="ml-10 hidden md:flex items-center space-x-1">
              {navLinks.map(({ name, path, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link to={path} key={path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className="relative group"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {name}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                          style={{ borderRadius: 2 }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
        
        {user ? (
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full h-9 w-9 p-0 overflow-hidden border"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>
                      {user.name?.[0]?.toUpperCase() || "A"}
                    </AvatarFallback>
                    {user.image && <AvatarImage src={user.image} alt={user.name || "User"} />}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium">{user.name || "Admin"}</p>
                  <p className="text-xs text-muted-foreground">{user.email || ""}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <LucideSettings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LucideLogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Button asChild variant="default" size="sm">
              <Link to="/login">Login</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
