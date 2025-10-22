import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, Mic, Briefcase, Home } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/content-creation", label: "Content Creation", icon: Video },
    { to: "/public-speaking", label: "Public Speaking", icon: Mic },
    { to: "/interview-prep", label: "Interview Prep", icon: Briefcase },
  ];

  return (
    <nav className="border-b bg-card sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            SkillForge
          </Link>
          
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              
              return (
                <Button
                  key={item.to}
                  variant={isActive ? "default" : "ghost"}
                  asChild
                  className="gap-2"
                >
                  <Link to={item.to}>
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
