import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isLanding ? "bg-transparent" : "bg-card/80 backdrop-blur-md border-b border-border"}`}>
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className={`font-heading font-bold text-xl ${isLanding ? "text-primary-foreground" : "text-foreground"}`}>
            ExamPrep
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {isLanding && (
            <>
              <a href="#features" className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium transition-colors">How It Works</a>
            </>
          )}
          <Link to="/login">
            <Button variant={isLanding ? "outline-hero" : "outline"} size="sm">Log In</Button>
          </Link>
          <Link to="/register">
            <Button variant={isLanding ? "gold" : "default"} size="sm">Get Started</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? (
            <X className={isLanding ? "text-primary-foreground" : "text-foreground"} />
          ) : (
            <Menu className={isLanding ? "text-primary-foreground" : "text-foreground"} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border p-4 space-y-3">
          <Link to="/login" onClick={() => setMobileOpen(false)}>
            <Button variant="outline" className="w-full">Log In</Button>
          </Link>
          <Link to="/register" onClick={() => setMobileOpen(false)}>
            <Button className="w-full">Get Started</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;