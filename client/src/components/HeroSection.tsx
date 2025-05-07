import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animation";

export default function HeroSection() {
  const [typedText, setTypedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const fullText = "We Are the Futuremirates";
  const typingSpeed = 100; // milliseconds per character
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Function to simulate typewriter effect
    const typeWriter = () => {
      let currentIndex = 0;
      
      const typing = setInterval(() => {
        if (currentIndex < fullText.length) {
          setTypedText(fullText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typing);
          setIsTypingComplete(true);
        }
      }, typingSpeed);
      
      // Clean up function
      return () => clearInterval(typing);
    };
    
    // Start typing after a short delay
    const startTypingTimeout = setTimeout(() => {
      typeWriter();
    }, 1000);
    
    return () => clearTimeout(startTypingTimeout);
  }, []);
  
  useEffect(() => {
    // Ensure video plays and loops
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <section className="h-screen w-full relative overflow-hidden" style={{minHeight: "calc(100vh + 20px)", height: "calc(100vh + 20px)", marginTop: "-80px", marginBottom: "-20px"}}>
      {/* Video Background that sticks to the top */}
      <div className="absolute top-0 left-0 w-full h-full z-0 bg-black">
        <video 
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/images/logo-future-black.png"
          style={{objectFit: "cover", width: "100vw", height: "calc(100vh + 30px)"}}
        >
          <source src="/assets/videos/hero-video.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>
      </div>
      
      {/* Only showing the typewriter heading */}
      <motion.div 
        className="relative z-10 container h-full flex flex-col justify-center items-center text-white text-center"
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-medium min-h-[50px]">
          {typedText}
          {!isTypingComplete && <span className="typewriter-cursor"></span>}
        </h1>
      </motion.div>
    </section>
  );
}
