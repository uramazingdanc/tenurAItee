
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, BookOpen, Video, BarChart, Menu } from "lucide-react";
import MainNavigation from "@/components/MainNavigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();

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

  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden p-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-brand-blue to-brand-green-dark bg-clip-text text-transparent">
            tenurAItee
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col space-y-4 mt-8">
          <Link to="/" className="text-lg font-medium">
            Home
          </Link>
          <Link to="/features" className="text-lg font-medium">
            Features
          </Link>
          <Link to="/pricing" className="text-lg font-medium">
            Pricing
          </Link>
          <Link to="/about" className="text-lg font-medium">
            About
          </Link>

          {user && (
            <>
              <hr className="my-2" />
              <Link to="/dashboard" className="text-lg font-medium">
                Dashboard
              </Link>
              <Link to="/knowledge" className="text-lg font-medium">
                Knowledge Base
              </Link>
              <Link to="/videos" className="text-lg font-medium">
                Videos
              </Link>
              <Button onClick={() => signOut()} variant="destructive" className="mt-4">
                Log out
              </Button>
            </>
          )}

          {!user && (
            <div className="flex flex-col space-y-2 mt-4">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button className="bg-brand-blue hover:bg-brand-blue-dark" asChild>
                <Link to="/login?tab=signup">Try Free</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

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
        
        {/* Desktop Navigation */}
        <MainNavigation />
        
        {/* Mobile Menu Button */}
        <MobileMenu />

        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="rounded-full w-10 h-10 p-0 hidden md:flex"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer flex items-center">
                    <BarChart className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/knowledge" className="cursor-pointer flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Knowledge Base</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/videos" className="cursor-pointer flex items-center">
                    <Video className="mr-2 h-4 w-4" />
                    <span>Videos</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" asChild className="hidden md:inline-flex">
                <Link to="/login">Login</Link>
              </Button>
              <Button className="bg-brand-blue hover:bg-brand-blue-dark hidden md:inline-flex" asChild>
                <Link to="/login?tab=signup">Try Free</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
