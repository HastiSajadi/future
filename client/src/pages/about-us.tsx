import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { ArrowRight, Award, Clock, Globe, Users } from 'lucide-react';
import { Link } from 'wouter';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

const timelineData: TimelineItem[] = [
  {
    year: '2010',
    title: 'Company Foundation',
    description: 'Our company was founded with a vision to bring high-quality furniture and design solutions to customers worldwide.',
  },
  {
    year: '2012',
    title: 'Expanded Product Line',
    description: 'We expanded our product catalog to include a wider range of home decor and furniture items to meet diverse customer needs.',
  },
  {
    year: '2015',
    title: 'International Expansion',
    description: 'We began shipping our products internationally, reaching customers across Europe, Asia, and North America.',
  },
  {
    year: '2018',
    title: 'Sustainability Initiative',
    description: 'Launched our sustainability program, committed to using eco-friendly materials and reducing our environmental footprint.',
  },
  {
    year: '2020',
    title: 'Online Platform Launch',
    description: 'Developed our comprehensive e-commerce platform to provide a seamless shopping experience for customers everywhere.',
  },
  {
    year: '2023',
    title: 'Design Innovation Hub',
    description: 'Created our design innovation center where we develop next-generation furniture concepts and explore new materials.',
  },
];

const FadeInSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}> = ({ children, className, delay = 0, direction = 'up' }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const getDirectionalVariants = () => {
    switch (direction) {
      case 'up':
        return {
          hidden: { y: 20 }, // Reduced from 50 to 20
          visible: { y: 0 }
        };
      case 'down':
        return {
          hidden: { y: -20 }, // Reduced from -50 to -20
          visible: { y: 0 }
        };
      case 'left':
        return {
          hidden: { x: 20 }, // Reduced from 50 to 20
          visible: { x: 0 }
        };
      case 'right':
        return {
          hidden: { x: -20 }, // Reduced from -50 to -20
          visible: { x: 0 }
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { 
          ...getDirectionalVariants().hidden,
          opacity: 0 
        },
        visible: { 
          ...getDirectionalVariants().visible,
          opacity: 1,
          transition: {
            duration: 0.3, // Faster transition (was 0.5)
            delay: delay * 0.6, // Reduced delays by 40%
            ease: [0.25, 0.1, 0.25, 1.0]
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StatItem: React.FC<{
  icon: React.ReactNode;
  number: string;
  text: string;
  delay: number;
}> = ({ icon, number, text, delay }) => (
  <FadeInSection delay={delay} className="text-center p-6">
    <div className="flex justify-center mb-4">
      <div className="bg-gray-100 p-4 rounded-full">
        {icon}
      </div>
    </div>
    <h3 className="text-4xl font-bold mb-2">{number}</h3>
    <p className="text-gray-600">{text}</p>
  </FadeInSection>
);

const TimelineItem: React.FC<{
  item: TimelineItem;
  index: number;
  isLast: boolean;
}> = ({ item, index, isLast }) => {
  const isEven = index % 2 === 0;
  
  return (
    <div className="relative mb-16 md:mb-8">
      {/* Vertical line for all except mobile */}
      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 h-full w-0.5 bg-gray-300 z-0" />
      
      {/* Mobile view - more linear/vertical */}
      <div className="md:hidden relative pl-8 border-l-2 border-gray-300 mb-12">
        <FadeInSection delay={index * 0.03}>
          <div className="absolute left-[-8px] top-0 w-3 h-3 bg-gray-800 rounded-full border-2 border-white"></div>
          <div className="bg-gray-800 text-white inline-block py-1 px-3 rounded mb-2 text-sm">
            {item.year}
          </div>
          <h3 className="text-xl font-bold mb-2">{item.title}</h3>
          <p className="text-gray-600">{item.description}</p>
        </FadeInSection>
      </div>
      
      {/* Desktop view - horizontal timeline */}
      <div className="hidden md:flex items-center justify-center">
        {/* Left Content */}
        {isEven ? (
          <FadeInSection
            direction="left"
            delay={index * 0.02}
            className="w-5/12 text-right pr-8"
          >
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </FadeInSection>
        ) : (
          <div className="w-5/12"></div>
        )}
        
        {/* Center timeline dot and year */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-gray-800 text-white py-1 px-3 rounded mb-2 text-sm">
            {item.year}
          </div>
          <div className="w-4 h-4 bg-gray-800 rounded-full border-2 border-white"></div>
        </div>
        
        {/* Right Content */}
        {!isEven ? (
          <FadeInSection
            direction="right"
            delay={index * 0.02}
            className="w-5/12 pl-8"
          >
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </FadeInSection>
        ) : (
          <div className="w-5/12"></div>
        )}
      </div>
    </div>
  );
};

export default function AboutUs() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gray-100 py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <FadeInSection>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About Our Company</h1>
            </FadeInSection>
            <FadeInSection delay={0.1}>
              <p className="text-lg text-gray-700 mb-8">
                We're dedicated to bringing innovative, high-quality furniture solutions to homes worldwide.
                Our mission is to transform living spaces with beautiful, functional designs that stand the test of time.
              </p>
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <Link href="/products">
                <Button className="rounded-full">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16">
        <div className="container">
          <FadeInSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do, from design to customer service.
            </p>
          </FadeInSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FadeInSection delay={0.05} className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3">Quality Craftsmanship</h3>
              <p className="text-gray-600">
                We're committed to excellent craftsmanship in every piece we create, using premium materials and techniques.
              </p>
            </FadeInSection>
            
            <FadeInSection delay={0.1} className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3">Sustainable Practices</h3>
              <p className="text-gray-600">
                Environmental responsibility is at the heart of our production processes and material selection.
              </p>
            </FadeInSection>
            
            <FadeInSection delay={0.15} className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3">Customer Focus</h3>
              <p className="text-gray-600">
                We prioritize our customers' needs, providing personalized service and attentive support.
              </p>
            </FadeInSection>
            
            <FadeInSection delay={0.2} className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3">Design Innovation</h3>
              <p className="text-gray-600">
                We constantly push boundaries with forward-thinking design that balances aesthetics and functionality.
              </p>
            </FadeInSection>
            
            <FadeInSection delay={0.25} className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3">Global Perspective</h3>
              <p className="text-gray-600">
                We draw inspiration from global design traditions while creating solutions for modern living.
              </p>
            </FadeInSection>
            
            <FadeInSection delay={0.3} className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3">Ethical Business</h3>
              <p className="text-gray-600">
                We maintain the highest standards of ethics in our business relationships and practices.
              </p>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="bg-gray-100 py-16">
        <div className="container">
          <FadeInSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Numbers that reflect our growth and commitment to excellence over the years.
            </p>
          </FadeInSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatItem 
              icon={<Globe className="h-6 w-6" />}
              number="35+"
              text="Countries Served"
              delay={0.05}
            />
            <StatItem 
              icon={<Users className="h-6 w-6" />}
              number="150k+"
              text="Happy Customers"
              delay={0.1}
            />
            <StatItem 
              icon={<Award className="h-6 w-6" />}
              number="25+"
              text="Design Awards"
              delay={0.15}
            />
            <StatItem 
              icon={<Clock className="h-6 w-6" />}
              number="13"
              text="Years of Excellence"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16">
        <div className="container">
          <FadeInSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The key milestones that have shaped our company's history and growth through the years.
            </p>
          </FadeInSection>
          
          <div className="relative py-8">
            {timelineData.map((item, index) => (
              <TimelineItem 
                key={item.year} 
                item={item} 
                index={index}
                isLast={index === timelineData.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container">
          <div className="bg-gray-800 text-white rounded-lg p-8 md:p-12 text-center">
            <FadeInSection className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
              <p className="text-lg mb-8">
                Ready to transform your space with our beautifully crafted furniture? Browse our collections today
                or reach out to our team for personalized assistance.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/products">
                  <Button variant="outline" className="bg-transparent border-white hover:bg-white hover:text-gray-800">
                    Browse Products
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="bg-white text-gray-800 hover:bg-gray-100">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}