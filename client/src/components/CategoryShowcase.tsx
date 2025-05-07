import { Category } from "@shared/schema";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animation";

interface CategoryShowcaseProps {
  categories: Category[];
}

export default function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  return (
    <section className="section-medium w-full py-20">
      <div className="container">
        <motion.div 
          className="text-center mb-12"
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">View Our Range Of Dental Equipment</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Explore our complete collection of premium dental equipment, featuring cutting-edge technology
            for every aspect of modern dental practice.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-12 gap-4 md:gap-6 mt-8"
          variants={fadeIn("up", 0.3)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {categories && categories.length > 0 ? (
            <>
              {/* First large tile - Implant & Surgery */}
              <motion.div 
                className="col-span-12 md:col-span-5"
                variants={fadeIn("right", 0.4)}
              >
                <Link 
                  href={`/categories/${categories[0]?.id || 1}`}
                  className="block h-full"
                >
                  <div className="category-card relative aspect-[3/4] md:aspect-auto md:h-full bg-gray-100 rounded-lg overflow-hidden shadow-md group">
                    {categories[0]?.imageUrl ? (
                      <img 
                        src={categories[0]?.imageUrl} 
                        alt={categories[0]?.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-start p-6">
                      <h3 className="text-white text-xl font-medium">
                        {categories[0]?.name || "Implant & Surgery"}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
              
              {/* Middle column with two stacked tiles */}
              <motion.div 
                className="col-span-12 md:col-span-3 grid grid-rows-2 gap-4 h-full"
                variants={fadeIn("down", 0.45)}
              >
                {/* Sterilization tile */}
                <div className="h-full">
                  <Link 
                    href={`/categories/${categories[1]?.id || 2}`}
                    className="block h-full"
                  >
                    <div className="category-card relative h-full bg-gray-100 rounded-lg overflow-hidden shadow-md group">
                      {categories[1]?.imageUrl ? (
                        <img 
                          src={categories[1]?.imageUrl} 
                          alt={categories[1]?.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300"></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-start p-4">
                        <h3 className="text-white text-lg font-medium">
                          {categories[1]?.name || "Sterilization"}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
                
                {/* Digital Dentistry tile */}
                <div className="h-full">
                  <Link 
                    href={`/categories/${categories[2]?.id || 3}`}
                    className="block h-full"
                  >
                    <div className="category-card relative h-full bg-gray-100 rounded-lg overflow-hidden shadow-md group">
                      {categories[2]?.imageUrl ? (
                        <img 
                          src={categories[2]?.imageUrl} 
                          alt={categories[2]?.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300"></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-start p-4">
                        <h3 className="text-white text-lg font-medium">
                          {categories[2]?.name || "Digital Dentistry"}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
              </motion.div>
              
              {/* Last large tile - Restorative */}
              <motion.div 
                className="col-span-12 md:col-span-4"
                variants={fadeIn("left", 0.5)}
              >
                <Link 
                  href={`/categories/${categories[3]?.id || 4}`}
                  className="block h-full"
                >
                  <div className="category-card relative aspect-[3/4] md:aspect-auto md:h-full bg-gray-100 rounded-lg overflow-hidden shadow-md group">
                    {categories[3]?.imageUrl ? (
                      <img 
                        src={categories[3]?.imageUrl} 
                        alt={categories[3]?.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-start p-6">
                      <h3 className="text-white text-xl font-medium">
                        {categories[3]?.name || "Restorative"}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </>
          ) : (
            // Render empty state with appropriate layout
            <>
              <div className="col-span-12 md:col-span-5">
                <div className="aspect-[3/4] md:h-full bg-gray-300 rounded-lg animate-pulse" />
              </div>
              <div className="col-span-12 md:col-span-3 grid grid-rows-2 gap-4 h-full">
                <div className="h-full">
                  <div className="h-full bg-gray-300 rounded-lg animate-pulse" />
                </div>
                <div className="h-full">
                  <div className="h-full bg-gray-300 rounded-lg animate-pulse" />
                </div>
              </div>
              <div className="col-span-12 md:col-span-4">
                <div className="aspect-[3/4] md:h-full bg-gray-300 rounded-lg animate-pulse" />
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
