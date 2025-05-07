import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { Product } from "@shared/schema";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer, textVariant } from "@/lib/animation";

interface PopularProductsProps {
  products: Product[];
}

export default function PopularProducts({ products }: PopularProductsProps) {
  return (
    <section className="section-large">
      <div className="container h-full flex flex-col">
        <motion.div 
          className="flex justify-between items-center mb-10"
          variants={fadeIn("down")}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.h2 
            className="text-2xl md:text-3xl font-heading font-bold"
            variants={textVariant(0.1)}
          >
            Most Popular Products
          </motion.h2>
          <div className="hidden md:block">
            <Link href="/products">
              <Button variant="link" className="text-sm font-medium hover:underline">
                View All
              </Button>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 flex-1"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {products && products.length > 0 ? (
            products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          ) : (
            // Render empty state if no products
            Array(8).fill(0).map((_, index) => (
              <motion.div 
                key={index} 
                className="bg-[hsl(var(--theme-light))] rounded-lg aspect-square animate-pulse"
                variants={fadeIn("up", 0.1 * index)}
              />
            ))
          )}
        </motion.div>
        
        <motion.div 
          className="mt-8 text-center"
          variants={fadeIn("up", 0.5)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <Link href="/products">
            <Button className="btn-primary rounded-full">
              Shop All Products
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
