import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LucideHome, LucideTruck, LucidePackage, LucideHeadphones, LucideShield, LucideWallet } from "lucide-react";
import { Product } from "@shared/schema";
import { motion } from "framer-motion";
import { fadeIn, textVariant, staggerContainer, zoomIn } from "@/lib/animation";

// Services instead of products
interface CompanyServicesProps {
  products?: Product[];
}

export default function CompanyServices({products = []}: CompanyServicesProps) {
  // Define the company services
  const services = [
    {
      id: 1,
      name: "Interior Design",
      description: "Our expert designers create personalized spaces that reflect your style and needs.",
      icon: <LucideHome className="h-8 w-8" />
    },
    {
      id: 2,
      name: "Free Delivery",
      description: "Fast and free shipping on all orders above $500 across the country.",
      icon: <LucideTruck className="h-8 w-8" />
    },
    {
      id: 3,
      name: "Easy Returns",
      description: "30-day hassle-free returns policy for all products with original packaging.",
      icon: <LucidePackage className="h-8 w-8" />
    },
    {
      id: 4,
      name: "Customer Support",
      description: "Our dedicated team is available 24/7 to answer all your queries and concerns.",
      icon: <LucideHeadphones className="h-8 w-8" />
    },
    {
      id: 5,
      name: "Product Warranty",
      description: "Guaranteed quality with extended warranty options on all premium furniture.",
      icon: <LucideShield className="h-8 w-8" />
    },
    {
      id: 6,
      name: "Secure Payment",
      description: "Multiple payment options with secure checkout process for your peace of mind.",
      icon: <LucideWallet className="h-8 w-8" />
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <motion.div 
          className="text-center mb-12"
          variants={fadeIn("down")}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.h2 
            className="text-2xl md:text-3xl font-heading font-bold"
            variants={textVariant(0.1)}
          >
            Our Services
          </motion.h2>
          <motion.p 
            className="text-gray-500 text-sm mt-2 max-w-xl mx-auto"
            variants={textVariant(0.2)}
          >
            We offer a range of comprehensive services to ensure your shopping and furnishing experience is seamless.
          </motion.p>
        </motion.div>
        
        <div className="flex justify-center">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl"
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            {services.map((service, index) => (
              <motion.div 
                key={service.id}
                className="service-card bg-white rounded-lg border border-gray-100 p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:border-transparent"
                variants={fadeIn("up", 0.1 * index)}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div 
                  className="mb-4 p-3 bg-gray-50 rounded-full text-gray-800"
                  variants={zoomIn(0.1 * index, 0.5)}
                  whileHover={{ 
                    rotate: 360,
                    backgroundColor: "rgb(249, 250, 251)",
                    transition: { duration: 0.6 }
                  }}
                >
                  {service.icon}
                </motion.div>
                <h3 className="font-heading font-medium text-lg mb-2">{service.name}</h3>
                <p className="text-gray-500 text-sm">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-12 text-center"
          variants={fadeIn("up", 0.5)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <Link href="/services">
            <Button className="btn-primary">
              Learn More About Our Services
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
