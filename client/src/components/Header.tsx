import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Search, 
  User, 
  ShoppingCart, 
  Menu 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { title: "Home", href: "/" },
  { title: "Products", href: "/products" },
  { title: "About Us", href: "/about" },
  { title: "Contact Us", href: "/contact" },
  { title: "Blog", href: "/blog" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { cartCount } = useCart();
  
  const isHomePage = location === "/";
  
  // Make header transparent only on home page
  useEffect(() => {
    setIsScrolled(!isHomePage);
  }, [isHomePage]);

  useEffect(() => {
    // Only handle scroll events on the home page
    if (!isHomePage) return;
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  // Dynamic classes based on scroll position
  const headerClass = isScrolled 
    ? "header-solid" 
    : "header-transparent";
    
  const logoSrc = isScrolled 
    ? "/assets/images/logo-future-black.png" 
    : "/assets/images/logo-future-white (1).png";
    
  const iconColor = isScrolled ? "text-black" : "text-white";
  const navLinkClass = `text-sm font-medium hover:opacity-80 transition-colors ${iconColor}`;
  const buttonClass = `${iconColor}`;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${headerClass}`}>
      <div className="container py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <img src={logoSrc} alt="Futuremirates" className="h-8" />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.title} 
                href={item.href}
                className={navLinkClass}
              >
                {item.title}
              </Link>
            ))}
          </nav>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className={`hidden md:flex ${buttonClass}`}>
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/auth">
              <Button variant="ghost" size="icon" className={`hidden md:flex ${buttonClass}`}>
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className={`hidden md:flex relative ${buttonClass}`}>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-black text-white"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={`md:hidden ${buttonClass}`}>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                <div className="flex justify-center mb-8">
                  <img src="/assets/images/logo-future-black.png" alt="Futuremirates" className="h-8" />
                </div>
                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link 
                      key={item.title} 
                      href={item.href}
                      className="text-sm font-medium hover:text-accent transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>
                <div className="flex space-x-4 mt-6">
                  <Button variant="ghost" size="icon">
                    <Search className="h-5 w-5" />
                  </Button>
                  <Link href="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/cart" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" size="icon" className="relative">
                      <ShoppingCart className="h-5 w-5" />
                      {cartCount > 0 && (
                        <Badge 
                          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-black text-white"
                        >
                          {cartCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
