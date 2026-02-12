import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X, GraduationCap, Users, BarChart3, FileText, Home, LogOut } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === "/";
  
  useEffect(() => {
    // Check if user is logged in and get user info from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );

        const userData = JSON.parse(jsonPayload);
        setUser({
          name: userData.user?.name,
          role: userData.user?.role,
          id: userData.user?.id
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const renderAuthButtons = () => {
    if (user) {
      return (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              isLanding ? "text-primary-foreground hover:bg-white/10" : "text-foreground hover:bg-gray-100"
            }`}
          >
            <span>{user.name}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg origin-top-right z-50 ${
              isLanding ? "bg-white" : "bg-white"
            }`}>
              <div className="py-1">
                {user.role === 'Teacher' && (
                  <>
                    <Link
                      to="/teacher/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Home className="w-4 h-4" />
                      Teacher Dashboard
                    </Link>
                    <Link
                      to="/teacher/questions"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FileText className="w-4 h-4" />
                      Manage Questions
                    </Link>
                    <Link
                      to="/teacher/classes"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Users className="w-4 h-4" />
                      Manage Classes
                    </Link>
                    <Link
                      to="/teacher/analytics"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <BarChart3 className="w-4 h-4" />
                      Analytics
                    </Link>
                  </>
                )}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <GraduationCap className="w-4 h-4" />
                  Student Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return (
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
    );
  };

  const renderMobileAuthButtons = () => {
    if (user) {
      return (
        <div className="space-y-3">
          {user.role === 'Teacher' && (
            <>
              <Link to="/teacher/dashboard" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full flex items-center justify-start gap-2">
                  <Home className="w-4 h-4" />
                  Teacher Dashboard
                </Button>
              </Link>
              <Link to="/teacher/questions" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full flex items-center justify-start gap-2">
                  <FileText className="w-4 h-4" />
                  Manage Questions
                </Button>
              </Link>
              <Link to="/teacher/classes" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full flex items-center justify-start gap-2">
                  <Users className="w-4 h-4" />
                  Manage Classes
                </Button>
              </Link>
              <Link to="/teacher/analytics" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full flex items-center justify-start gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </Button>
              </Link>
            </>
          )}
          <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
            <Button variant="outline" className="w-full flex items-center justify-start gap-2">
              <GraduationCap className="w-4 h-4" />
              Student Dashboard
            </Button>
          </Link>
          <Button 
            variant="destructive" 
            className="w-full flex items-center justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-3">
        <Link to="/login" onClick={() => setMobileOpen(false)}>
          <Button variant="outline" className="w-full">Log In</Button>
        </Link>
        <Link to="/register" onClick={() => setMobileOpen(false)}>
          <Button className="w-full">Get Started</Button>
        </Link>
      </div>
    );
  };

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
        {renderAuthButtons()}

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
        <div className="md:hidden bg-card border-b border-border p-4">
          {renderMobileAuthButtons()}
        </div>
      )}
    </nav>
  );
};

export default Navbar;