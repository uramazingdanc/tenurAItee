
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-brand-blue to-brand-green-dark bg-clip-text text-transparent">
            tenurAItee
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-medium hover:text-brand-blue transition-colors">
            Home
          </Link>
          <Link to="/features" className="font-medium hover:text-brand-blue transition-colors">
            Features
          </Link>
          <Link to="/pricing" className="font-medium hover:text-brand-blue transition-colors">
            Pricing
          </Link>
          <Link to="/about" className="font-medium hover:text-brand-blue transition-colors">
            About
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button className="bg-brand-blue hover:bg-brand-blue-dark" asChild>
            <Link to="/register">Try Free</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
