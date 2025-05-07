import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  SlidersHorizontal, 
  Heart, 
  Eye, 
  ArrowUpDown,
  ChevronDown
} from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product, Category } from "@shared/schema";
import { Link, useLocation } from "wouter";
import { useMobile } from "@/hooks/use-mobile";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose 
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Function to ensure we always return an array
function ensureArray<T>(data: any): T[] {
  return Array.isArray(data) ? data as T[] : [];
}

type PriceRange = {
  id: string;
  label: string;
  min: number;
  max: number;
  checked: boolean;
};

type SearchResponseData = {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

export default function ProductsPage() {
  const isMobile = useMobile();
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]); // Array of product IDs
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [productsToCompare, setProductsToCompare] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  const [priceRanges] = useState<PriceRange[]>([
    { id: "range1", label: "$0 - $500", min: 0, max: 500, checked: false },
    { id: "range2", label: "$500 - $1,000", min: 500, max: 1000, checked: false },
    { id: "range3", label: "$1,000 - $5,000", min: 1000, max: 5000, checked: false },
    { id: "range4", label: "$5,000 - $10,000", min: 5000, max: 10000, checked: false },
    { id: "range5", label: "$10,000+", min: 10000, max: 1000000, checked: false },
  ]);

  // Load recently viewed products from localStorage on initial render
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('recentlyViewed');
      if (storedProducts) {
        setRecentlyViewed(JSON.parse(storedProducts));
      }
      
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
    } catch (error) {
      console.error('Error loading stored products:', error);
    }
  }, []);

  // Build the search query parameters
  const buildSearchParams = () => {
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.append('q', searchQuery);
    }
    
    if (selectedCategory) {
      params.append('category', selectedCategory);
    }
    
    if (selectedPriceRange) {
      params.append('minPrice', selectedPriceRange.min.toString());
      params.append('maxPrice', selectedPriceRange.max.toString());
    }
    
    // Add sort parameter
    params.append('sort', sortBy);
    
    params.append('page', currentPage.toString());
    params.append('limit', '12');
    
    return params.toString();
  };
  
  // Handle sorting change
  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setCurrentPage(1); // Reset to first page
    refetchProducts();
  };
  
  // Handle quick view of a product
  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    
    // Add to recently viewed
    const updatedRecent = [product, ...recentlyViewed.filter(p => p.id !== product.id)].slice(0, 4);
    setRecentlyViewed(updatedRecent);
    
    try {
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecent));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };
  
  // Toggle product in wishlist
  const toggleWishlist = (productId: number) => {
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
    
    setWishlist(newWishlist);
    
    try {
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  };
  
  // Toggle product in comparison list
  const toggleCompare = (product: Product) => {
    if (productsToCompare.find(p => p.id === product.id)) {
      setProductsToCompare(productsToCompare.filter(p => p.id !== product.id));
    } else if (productsToCompare.length < 3) {
      setProductsToCompare([...productsToCompare, product]);
    } else {
      // Replace the first product if we already have 3
      setProductsToCompare([...productsToCompare.slice(1), product]);
    }
  };

  // Fetch filtered products
  const { 
    data: searchResponse, 
    isLoading: productsLoading, 
    refetch: refetchProducts 
  } = useQuery<SearchResponseData>({
    queryKey: ["/api/products/search", buildSearchParams()],
    queryFn: async () => {
      const response = await fetch(`/api/products/search?${buildSearchParams()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return await response.json();
    },
  });

  // Fetch categories for the filter
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset page number on new search
    refetchProducts();
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    setCurrentPage(1); // Reset page number on filter change
    refetchProducts();
  };

  // Handle price range selection
  const handlePriceRangeChange = (range: PriceRange) => {
    setSelectedPriceRange(selectedPriceRange?.id === range.id ? null : range);
    setCurrentPage(1); // Reset page number on filter change
    refetchProducts();
  };

  // Load more products
  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
    refetchProducts();
  };

  // Extract the products from the response
  const allProducts = searchResponse?.products || [];

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3">Our Collection Of Products</h1>
          <p className="text-sm text-gray-500">
            Showing {allProducts.length || 0} of {allProducts.length || 0} items
          </p>
          
          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative max-w-lg mx-auto mt-6">
            <Input
              type="text"
              placeholder="Search for items..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit"
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filters Button */}
          {isMobile && (
            <div className="mb-4">
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full flex items-center justify-between">
                    <span>Filters</span>
                    <SlidersHorizontal className="h-4 w-4 ml-2" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[80%] overflow-y-auto">
                  {/* Mobile Filter Content */}
                  <div className="py-4">
                    <h3 className="text-lg font-medium mb-4">Categories</h3>
                    <div className="space-y-3">
                      {/* Main categories */}
                      {ensureArray<Category>(categories)
                        .filter(cat => ["Implant & Surgery", "Sterilization", "Digital Dentistry", "Restorative"]
                          .includes(cat.name))
                        .map((category) => (
                          <div key={category.id} className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <div className="flex items-center">
                                <Checkbox 
                                  id={`mobile-category-${category.id}`} 
                                  checked={selectedCategory === category.id.toString()}
                                  onCheckedChange={() => handleCategoryChange(category.id.toString())}
                                />
                                <label 
                                  htmlFor={`mobile-category-${category.id}`}
                                  className="ml-2 text-sm font-medium cursor-pointer"
                                >
                                  {category.name}
                                </label>
                              </div>
                            </div>
                            
                            {/* Subcategories */}
                            <div className="pl-6 ml-1 border-l border-gray-200 space-y-2">
                              {ensureArray<Category>(categories)
                                .filter(subcat => {
                                  // Filter subcategories based on main category
                                  if (category.name === "Implant & Surgery") {
                                    return ["Implant", "Electrosurgery", "Piezosurgery", "Motor Implant", 
                                      "Implant Stability", "Quotient Meter", "Bone Graft", "Membrane"].includes(subcat.name);
                                  } else if (category.name === "Sterilization") {
                                    return ["Autoclave", "Sealing Machine", "Ultrasonic Cleaner", "Water Distiller", 
                                      "Veterinary", "Sealing Rolls", "Spare Test"].includes(subcat.name);
                                  } else if (category.name === "Digital Dentistry") {
                                    return ["Scanner", "Intraoral Scanner", "Laboratory Scanner", "Milling Machine", 
                                      "3D Printer", "Metal Printer", "Resin Printer", "Sintering Furnace", 
                                      "Zirconia Block", "Dental Burs"].includes(subcat.name);
                                  }
                                  return false;
                                })
                                .map(subcat => (
                                  <div key={subcat.id} className="flex items-center text-sm">
                                    <div className="flex items-center">
                                      <Checkbox 
                                        id={`mobile-subcategory-${subcat.id}`} 
                                        checked={selectedCategory === subcat.id.toString()}
                                        onCheckedChange={() => handleCategoryChange(subcat.id.toString())}
                                      />
                                      <label 
                                        htmlFor={`mobile-subcategory-${subcat.id}`}
                                        className="ml-2 text-xs cursor-pointer"
                                      >
                                        {subcat.name}
                                      </label>
                                    </div>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                      ))}
                    </div>

                    <h3 className="text-lg font-medium mt-6 mb-4">Price Range</h3>
                    <div className="space-y-3">
                      {priceRanges.map((range) => (
                        <div key={range.id} className="flex items-center">
                          <Checkbox 
                            id={`mobile-price-${range.id}`} 
                            checked={selectedPriceRange?.id === range.id}
                            onCheckedChange={() => handlePriceRangeChange(range)}
                          />
                          <label 
                            htmlFor={`mobile-price-${range.id}`}
                            className="ml-2 text-sm cursor-pointer"
                          >
                            {range.label}
                          </label>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className="w-full mt-6" 
                      onClick={() => {
                        refetchProducts();
                        setIsFilterOpen(false);
                      }}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}

          {/* Desktop Sidebar Filters */}
          <div className={`${isMobile ? 'hidden' : 'block'} w-full md:w-64 shrink-0`}>
            {/* Categories Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <span className="border-r-2 border-black pr-2 mr-2">|</span>
                Categories
              </h3>
              <div className="space-y-2">
                {/* Main categories */}
                {ensureArray<Category>(categories)
                  .filter(cat => ["Implant & Surgery", "Sterilization", "Digital Dentistry", "Restorative"]
                    .includes(cat.name))
                  .map((category) => (
                    <div key={category.id} className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span 
                          className={`font-medium text-gray-800 hover:text-black cursor-pointer ${selectedCategory === category.id.toString() ? 'font-bold text-black' : ''}`}
                          onClick={() => handleCategoryChange(category.id.toString())}
                        >
                          {category.name}
                        </span>
                      </div>
                      
                      {/* Subcategories for each main category */}
                      <div className="ml-4 border-l pl-2 space-y-1">
                        {ensureArray<Category>(categories)
                          .filter(subcat => {
                            // Filter subcategories based on main category
                            if (category.name === "Implant & Surgery") {
                              return ["Implant", "Electrosurgery", "Piezosurgery", "Motor Implant", 
                                "Implant Stability", "Quotient Meter", "Bone Graft", "Membrane"].includes(subcat.name);
                            } else if (category.name === "Sterilization") {
                              return ["Autoclave", "Sealing Machine", "Ultrasonic Cleaner", "Water Distiller", 
                                "Veterinary", "Sealing Rolls", "Spare Test"].includes(subcat.name);
                            } else if (category.name === "Digital Dentistry") {
                              return ["Scanner", "Intraoral Scanner", "Laboratory Scanner", "Milling Machine", 
                                "3D Printer", "Metal Printer", "Resin Printer", "Sintering Furnace", 
                                "Zirconia Block", "Dental Burs"].includes(subcat.name);
                            }
                            return false;
                          })
                          .map(subcat => (
                            <div key={subcat.id} className="flex items-center justify-between text-sm">
                              <span 
                                className={`text-gray-600 hover:text-black cursor-pointer text-xs ${selectedCategory === subcat.id.toString() ? 'font-medium text-black' : ''}`}
                                onClick={() => handleCategoryChange(subcat.id.toString())}
                              >
                                {subcat.name}
                              </span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <span className="border-r-2 border-black pr-2 mr-2">|</span>
                Price Range
              </h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <div key={range.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={range.id} 
                      checked={selectedPriceRange?.id === range.id}
                      onCheckedChange={() => handlePriceRangeChange(range)}
                    />
                    <label 
                      htmlFor={range.id} 
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="text-sm mr-2">Sort by:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center text-sm">
                      {sortBy === 'newest' && 'Newest'}
                      {sortBy === 'price_asc' && 'Price: Low to High'}
                      {sortBy === 'price_desc' && 'Price: High to Low'}
                      {sortBy === 'name_asc' && 'Name: A-Z'}
                      {sortBy === 'name_desc' && 'Name: Z-A'}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleSortChange('newest')}>
                      Newest
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSortChange('price_asc')}>
                      Price: Low to High
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSortChange('price_desc')}>
                      Price: High to Low
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSortChange('name_asc')}>
                      Name: A-Z
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSortChange('name_desc')}>
                      Name: Z-A
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {productsToCompare.length > 0 && (
                <div className="flex items-center">
                  <span className="text-sm mr-2">Compare ({productsToCompare.length})</span>
                  <Button variant="outline" size="sm">
                    View Comparison
                  </Button>
                </div>
              )}
            </div>
            
            {/* Product Category Tabs */}
            <Tabs value={activeTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setActiveTab('all')}>
                  All Products
                </TabsTrigger>
                <TabsTrigger value="featured" onClick={() => setActiveTab('featured')}>
                  Featured
                </TabsTrigger>
                <TabsTrigger value="bestsellers" onClick={() => setActiveTab('bestsellers')}>
                  Bestsellers
                </TabsTrigger>
                <TabsTrigger value="new" onClick={() => setActiveTab('new')}>
                  New Arrivals
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {productsLoading ? (
                // Loading skeleton
                Array(9).fill(0).map((_, index) => (
                  <div key={index} className="bg-gray-200 rounded-md animate-pulse h-64"></div>
                ))
              ) : (
                allProducts.map((product) => (
                  <div key={product.id} className="product-card border border-gray-200 rounded-md overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="relative bg-gray-200 aspect-square overflow-hidden">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                      
                      {/* Product Badges */}
                      {product.badge && (
                        <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                          {product.badge}
                        </div>
                      )}
                      
                      {/* Quick actions */}
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="secondary" 
                              size="icon" 
                              className="rounded-full" 
                              onClick={() => handleQuickView(product)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Quick view</span>
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                        
                        <Button 
                          variant={wishlist.includes(product.id) ? "default" : "secondary"} 
                          size="icon" 
                          className="rounded-full" 
                          onClick={() => toggleWishlist(product.id)}
                        >
                          <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-current" : ""}`} />
                          <span className="sr-only">Add to wishlist</span>
                        </Button>
                        
                        <Button 
                          variant={productsToCompare.some(p => p.id === product.id) ? "default" : "secondary"}
                          size="icon" 
                          className="rounded-full" 
                          onClick={() => toggleCompare(product)}
                        >
                          <ArrowUpDown className="h-4 w-4" />
                          <span className="sr-only">Compare</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-sm font-medium hover:underline line-clamp-2 h-10">{product.name}</h3>
                      </Link>
                      
                      {product.categoryId && (
                        <div className="mt-1 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {ensureArray<Category>(categories).find(c => c.id === product.categoryId)?.name || 'Uncategorized'}
                          </Badge>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mt-1">
                        <div>
                          <p className="text-sm font-medium">
                            ${Number(product.price).toFixed(2)}
                          </p>
                          {product.compareAtPrice && (
                            <p className="text-xs text-gray-500 line-through">
                              ${Number(product.compareAtPrice).toFixed(2)}
                            </p>
                          )}
                        </div>
                        <button 
                          className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <span className="sr-only">Add to cart</span>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Recently viewed products */}
            {recentlyViewed.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-medium mb-4">Recently Viewed</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {recentlyViewed.map((product) => (
                    <div key={`recent-${product.id}`} className="border border-gray-200 rounded-md overflow-hidden">
                      <div className="relative bg-gray-200 aspect-square">
                        {product.imageUrl && (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-3">
                        <Link href={`/products/${product.id}`}>
                          <h4 className="text-xs font-medium line-clamp-1">{product.name}</h4>
                        </Link>
                        <p className="text-xs mt-1">${Number(product.price).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-10 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing {allProducts.length || 0} of {searchResponse?.pagination?.total || 0} results
              </p>
              {searchResponse && currentPage < searchResponse.pagination.totalPages && (
                <Button 
                  className="bg-black text-white rounded-full px-4 py-2 hover:bg-gray-800"
                  onClick={handleLoadMore}
                  disabled={productsLoading}
                >
                  {productsLoading ? 'Loading...' : 'Load More'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Quick View Product Modal */}
      {quickViewProduct && (
        <Dialog open={!!quickViewProduct} onOpenChange={() => setQuickViewProduct(null)}>
          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle>{quickViewProduct.name}</DialogTitle>
              <DialogDescription>
                {quickViewProduct.categoryId && (
                  <Badge variant="outline" className="mr-2">
                    {ensureArray<Category>(categories).find(c => c.id === quickViewProduct.categoryId)?.name || 'Uncategorized'}
                  </Badge>
                )}
                {quickViewProduct.badge && (
                  <Badge variant="default">{quickViewProduct.badge}</Badge>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
                {quickViewProduct.imageUrl ? (
                  <img 
                    src={quickViewProduct.imageUrl} 
                    alt={quickViewProduct.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
              
              {/* Product Details */}
              <div>
                <h3 className="text-xl font-medium mb-2">{quickViewProduct.name}</h3>
                
                <div className="flex items-baseline mb-4">
                  <div className="text-xl font-bold">${Number(quickViewProduct.price).toFixed(2)}</div>
                  {quickViewProduct.compareAtPrice && (
                    <div className="ml-2 text-sm text-gray-500 line-through">
                      ${Number(quickViewProduct.compareAtPrice).toFixed(2)}
                    </div>
                  )}
                </div>
                
                <div className="prose prose-sm mb-4">
                  <p>{quickViewProduct.description || 'No description available.'}</p>
                </div>
                
                <div className="flex space-x-2 mt-6">
                  <Button className="flex-1">Add to Cart</Button>
                  <Button 
                    variant={wishlist.includes(quickViewProduct.id) ? "default" : "outline"} 
                    size="icon"
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                  >
                    <Heart className={`h-4 w-4 ${wishlist.includes(quickViewProduct.id) ? "fill-current" : ""}`} />
                  </Button>
                  <Button 
                    variant={productsToCompare.some(p => p.id === quickViewProduct.id) ? "default" : "outline"}
                    size="icon"
                    onClick={() => toggleCompare(quickViewProduct)}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
                
                <Link href={`/products/${quickViewProduct.id}`} className="block text-center underline mt-4">
                  View Full Details
                </Link>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Product Comparison Drawer */}
      {productsToCompare.length > 0 && (
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="default" 
              className="fixed bottom-4 right-4 z-50"
              size="sm"
            >
              Compare Products ({productsToCompare.length})
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh]">
            <div className="h-full overflow-auto py-6">
              <h3 className="text-lg font-medium mb-4">Product Comparison</h3>
              
              <div className="grid grid-cols-3 gap-4">
                {productsToCompare.map((product) => (
                  <div key={`compare-${product.id}`} className="relative">
                    <button 
                      className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1"
                      onClick={() => toggleCompare(product)}
                    >
                      <span className="sr-only">Remove</span>
                      &times;
                    </button>
                    
                    <div className="aspect-square bg-gray-100 mb-2 rounded-md overflow-hidden">
                      {product.imageUrl && (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    <h4 className="text-sm font-medium mb-1">{product.name}</h4>
                    <p className="text-sm mb-2">${Number(product.price).toFixed(2)}</p>
                    
                    {product.categoryId && (
                      <p className="text-xs text-gray-500 mb-1">
                        Category: {ensureArray<Category>(categories).find(c => c.id === product.categoryId)?.name || 'Uncategorized'}
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-500 mb-1">
                      {product.description ? product.description.substring(0, 100) + '...' : 'No description'}
                    </p>
                    
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      Add to Cart
                    </Button>
                  </div>
                ))}
                
                {productsToCompare.length < 3 && (
                  <div className="border border-dashed border-gray-300 rounded-md flex items-center justify-center aspect-square">
                    <span className="text-gray-400">Add another product to compare</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Comparison Table</h4>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Feature</th>
                        {productsToCompare.map((product) => (
                          <th key={`header-${product.id}`} className="px-4 py-2 text-left">
                            {product.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="px-4 py-2 font-medium">Price</td>
                        {productsToCompare.map((product) => (
                          <td key={`price-${product.id}`} className="px-4 py-2">
                            ${Number(product.price).toFixed(2)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-t bg-gray-50">
                        <td className="px-4 py-2 font-medium">Category</td>
                        {productsToCompare.map((product) => (
                          <td key={`category-${product.id}`} className="px-4 py-2">
                            {product.categoryId 
                              ? ensureArray<Category>(categories).find(c => c.id === product.categoryId)?.name || 'Uncategorized'
                              : 'N/A'
                            }
                          </td>
                        ))}
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-2 font-medium">Badge</td>
                        {productsToCompare.map((product) => (
                          <td key={`badge-${product.id}`} className="px-4 py-2">
                            {product.badge || 'None'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </MainLayout>
  );
}