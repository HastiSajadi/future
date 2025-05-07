import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animation";

export default function StatsSection() {
  return (
    <section className="section-medium text-black py-24">
      <div className="container h-full flex flex-col justify-center">
        <motion.div 
          className="flex flex-col items-center justify-center text-center mb-16"
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">
            Have a Look at Our Unique Styling Department
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our expert dental specialists are ready to help you transform your practice with personalized recommendations and equipment solutions that match your unique professional needs.
          </p>
          <Link href="/styling">
            <Button className="text-sm font-medium px-6 py-3 border border-black text-black rounded-full hover:bg-black hover:text-white transition duration-300">
              Learn More
            </Button>
          </Link>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-8 md:gap-16 max-w-3xl mx-auto">
          <motion.div 
            className="flex flex-col items-center justify-center h-40"
            variants={fadeIn("up", 0.3)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <h3 className="text-5xl md:text-6xl font-bold mb-3">99%</h3>
            <p className="text-gray-600">Customer Satisfaction Rate</p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center justify-center h-40"
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <h3 className="text-5xl md:text-6xl font-bold mb-3">100%</h3>
            <p className="text-gray-600">Quality Materials</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
