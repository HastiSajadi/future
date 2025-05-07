import { Button } from "@/components/ui/button";
import { Offering } from "@shared/schema";
import { formatDate } from "@/lib/utils";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animation";

interface LatestOfferingsProps {
  offerings: Offering[];
}

export default function LatestOfferings({ offerings }: LatestOfferingsProps) {
  return (
    <section className="section-large w-full py-16 md:py-24">
      <div className="container h-full flex flex-col">
        <motion.div 
          className="flex justify-between items-center mb-12"
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <h2 className="text-2xl md:text-3xl font-heading font-bold">Latest Articles & News</h2>
          <div className="hidden md:block">
            <Link href="/blog">
              <Button variant="link" className="text-sm font-medium hover:underline">
                View All
              </Button>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-6 md:gap-8 flex-1"
          variants={fadeIn("up", 0.3)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {offerings && offerings.length > 0 ? (
            offerings.map((offering, index) => (
              <motion.div
                key={offering.id}
                variants={fadeIn("up", 0.2 + (index * 0.1))}
              >
                <Link 
                  href={`/blog/${offering.id}`}
                  className="card-link"
                >
                  <div className="blog-card rounded-lg overflow-hidden shadow-md h-full bg-white hover:shadow-lg transition-shadow duration-300">
                    <div className="relative aspect-video bg-gray-100 overflow-hidden">
                      {offering.imageUrl ? (
                        <img 
                          src={offering.imageUrl} 
                          alt={offering.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300"></div>
                      )}
                    </div>
                    <div className="p-6">
                      <span className="text-xs text-gray-500 font-medium">
                        {formatDate(offering.createdAt)}
                      </span>
                      <h3 className="text-lg font-medium mt-3 mb-2">{offering.title}</h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {offering.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            // Render empty state if no offerings
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-video bg-gray-200 animate-pulse" />
                <div className="p-4">
                  <div className="h-3 w-24 bg-gray-200 rounded-full animate-pulse mb-2" />
                  <div className="h-5 w-full bg-gray-200 rounded-full animate-pulse mb-2" />
                  <div className="h-4 w-full bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded-full animate-pulse mt-1" />
                </div>
              </div>
            ))
          )}
        </motion.div>
        
        <motion.div 
          className="mt-10 text-center md:hidden"
          variants={fadeIn("up", 0.5)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <Link href="/blog">
            <Button className="btn-secondary rounded-full">
              View All Articles
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
