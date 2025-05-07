import { Product } from "@shared/schema";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { scaleOnHover, fadeIn } from "@/lib/animation";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  // Handle price formatting safely
  const formatPrice = (price: any): string => {
    if (!price) return "0.00";
    
    try {
      const numPrice = typeof price === 'number' ? price : parseFloat(price);
      return numPrice.toFixed(2);
    } catch (error) {
      console.error("Error formatting price:", error);
      return "0.00";
    }
  };

  return (
    <motion.div
      variants={fadeIn("up", 0.1 * index)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      <Link href={`/products/${product.id}`} className="card-link block">
        <motion.div 
          className="product-card group cursor-pointer"
          whileHover="hover"
          variants={scaleOnHover}
        >
          <div className="relative bg-[hsl(var(--theme-light))] aspect-square rounded-lg overflow-hidden mb-4">
            <motion.img 
              src={product.imageUrl || 'https://via.placeholder.com/600x600?text=No+Image'} 
              alt={product.name} 
              className="product-image transition-transform duration-500"
              whileHover={{ scale: 1.1 }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/600x600?text=Image+Error';
              }}
            />
            {product.badge && (
              <motion.div 
                className="absolute top-3 left-3 bg-[hsl(var(--theme-primary))] text-white text-xs px-2 py-1 rounded-full"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {product.badge}
              </motion.div>
            )}
          </div>
          <h3 className="text-sm font-medium group-hover:text-[hsl(var(--theme-primary))] transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-[hsl(var(--theme-secondary))]">
            Starting at ${formatPrice(product.price)}
            {product.compareAtPrice && (
              <span className="line-through text-gray-400 ml-2">
                ${formatPrice(product.compareAtPrice)}
              </span>
            )}
          </p>
        </motion.div>
      </Link>
    </motion.div>
  );
}
