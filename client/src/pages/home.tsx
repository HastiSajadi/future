import MainLayout from "@/layouts/MainLayout";
import HeroSection from "@/components/HeroSection";
import CompanyServices from "@/components/FeaturedProducts"; // Using the same file, but it's now a services component
import CategoryShowcase from "@/components/CategoryShowcase";
import PopularProducts from "@/components/PopularProducts";
import StatsSection from "@/components/StatsSection";
import LatestOfferings from "@/components/LatestOfferings";
import FaqSection from "@/components/FaqSection";
import { useQuery } from "@tanstack/react-query";
import { Product, Category, Offering } from "@shared/schema";

// Helper function to ensure we always return an array
function ensureArray<T>(data: any): T[] {
  return Array.isArray(data) ? data as T[] : [];
}

export default function Home() {
  const { data: featuredProducts } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });
  
  const { data: popularProducts } = useQuery<Product[]>({
    queryKey: ["/api/products/popular"],
  });
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const { data: offerings } = useQuery<Offering[]>({
    queryKey: ["/api/offerings"],
  });

  return (
    <MainLayout>
      <HeroSection />
      <CompanyServices products={ensureArray<Product>(featuredProducts)} />
      <CategoryShowcase categories={ensureArray<Category>(categories)} />
      <StatsSection />
      <PopularProducts products={ensureArray<Product>(popularProducts)} />
      <LatestOfferings offerings={ensureArray<Offering>(offerings)} />
      <FaqSection />
    </MainLayout>
  );
}
