import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Linkedin 
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log("Subscribing email:", email);
  };

  return (
    <footer className="bg-[#333333] text-white">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <a href="/" className="mb-4 inline-block">
              <img src="/assets/images/logo-future-white.png" alt="Futuremirates Logo" className="h-12" />
            </a>
            <p className="text-gray-400 text-sm mb-6">
              Subscribe to our newsletter to stay updated about discounts, new arrivals, and exclusive offers.
            </p>
            
            <form onSubmit={handleSubscribe} className="mb-6">
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-2 w-full rounded-l-full bg-black bg-opacity-30 border border-gray-700 focus:outline-none focus:border-white text-white"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button 
                  type="submit"
                  className="px-4 py-2 bg-white text-[#333333] rounded-r-full hover:bg-gray-200 transition duration-300"
                >
                  Subscribe
                </Button>
              </div>
            </form>
            
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white transition duration-300">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white transition duration-300">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white transition duration-300">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white transition duration-300">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition duration-300">Living Room</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Bedroom</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Kitchen</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Home Office</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Outdoor</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Lighting</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase mb-4">Help</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition duration-300">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Shipping</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Returns</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Order Tracking</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase mb-4">About</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition duration-300">Our Story</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Designers</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Sustainability</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Blog</a></li>
              <li><a href="#" className="hover:text-white transition duration-300">Careers</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Futuremirates. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-400 hover:text-white transition duration-300">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition duration-300">Terms of Service</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition duration-300">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
