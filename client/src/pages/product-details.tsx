import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import MainLayout from "@/layouts/MainLayout";
import { Product, Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Minus, Plus, Share2, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

type ProductParams = {
  id: string;
};

export default function ProductDetailsPage() {
  const { toast } = useToast();
  const params = useParams();
  const productId = params.id;
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  // Fetch product details
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      return await response.json();
    },
    enabled: !!productId,
  });

  // Fetch related products
  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ["/api/products/related", productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/related/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch related products');
      }
      return await response.json();
    },
    enabled: !!productId,
  });

  // Check if product is in wishlist (from localStorage)
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist && productId) {
        const wishlist = JSON.parse(storedWishlist);
        setIsInWishlist(wishlist.includes(Number(productId)));
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  }, [productId]);

  // Add to recently viewed
  useEffect(() => {
    if (!product) return;
    
    try {
      const storedProducts = localStorage.getItem('recentlyViewed');
      let recentlyViewed = storedProducts ? JSON.parse(storedProducts) : [];
      
      // Add current product to the beginning and remove duplicates
      recentlyViewed = [product, ...recentlyViewed.filter((p: Product) => p.id !== product.id)].slice(0, 4);
      
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    } catch (error) {
      console.error('Error saving to recently viewed:', error);
    }
  }, [product]);

  // Handle adding to cart
  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product?.name} added to your cart`,
    });
  };

  // Handle buy now
  const handleBuyNow = () => {
    toast({
      title: "Proceeding to checkout",
      description: `Preparing ${quantity} × ${product?.name} for checkout`,
    });
  };

  // Toggle wishlist
  const toggleWishlist = () => {
    if (!product) return;
    
    try {
      const storedWishlist = localStorage.getItem('wishlist');
      let wishlist: number[] = storedWishlist ? JSON.parse(storedWishlist) : [];
      
      if (isInWishlist) {
        wishlist = wishlist.filter((id: number) => id !== product.id);
      } else {
        wishlist.push(product.id);
      }
      
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsInWishlist(!isInWishlist);
      
      toast({
        title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
        description: isInWishlist 
          ? `${product.name} has been removed from your wishlist`
          : `${product.name} has been added to your wishlist`,
      });
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  // Get placeholder images for gallery demo
  const getGalleryImages = () => {
    if (product?.imageUrl) {
      // If we have a real image, use it plus placeholders
      return [
        product.imageUrl,
        "https://placehold.co/600x600/gray/white?text=Image+1",
        "https://placehold.co/600x600/gray/white?text=Image+2",
        "https://placehold.co/600x600/gray/white?text=Image+3"
      ];
    }
    
    // Otherwise just use placeholders
    return [
      "https://placehold.co/600x600/gray/white?text=Main+Image",
      "https://placehold.co/600x600/gray/white?text=Image+1",
      "https://placehold.co/600x600/gray/white?text=Image+2",
      "https://placehold.co/600x600/gray/white?text=Image+3"
    ];
  };

  const galleryImages = getGalleryImages();

  // Breadcrumb links
  const breadcrumbs = [
    { label: "Products", href: "/products" },
    { label: "/", href: "#", isSeperator: true },
    { label: product?.name || "Product Details", href: "#" }
  ];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center">
                {item.isSeperator ? (
                  <span className="text-gray-400 mx-1">{item.label}</span>
                ) : (
                  <Link href={item.href} className={index === breadcrumbs.length - 1 ? "font-medium" : "text-gray-500 hover:text-gray-900"}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Product Detail Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div className="flex gap-4">
            {/* Thumbnail Navigation */}
            <div className="w-1/5 space-y-3">
              {galleryImages.map((src, index) => (
                <div 
                  key={index}
                  className={`aspect-square cursor-pointer border ${index === activeImageIndex ? 'border-black' : 'border-gray-200'}`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img 
                    src={src} 
                    alt={`Product thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="w-4/5 aspect-square border border-gray-200">
              <img 
                src={galleryImages[activeImageIndex]} 
                alt={product?.name || "Product"} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          {/* Product Information */}
          <div>
            <h1 className="text-3xl font-medium mb-2">{product?.name}</h1>
            <div className="flex items-center mb-4">
              <div className="text-xl font-medium">${Number(product?.price).toFixed(2)}</div>
              {product?.compareAtPrice && (
                <div className="ml-2 text-gray-500 line-through">
                  ${Number(product?.compareAtPrice).toFixed(2)}
                </div>
              )}
              <div className="flex items-center ml-auto">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                    </svg>
                  ))}
                </div>
                <div className="text-xs text-gray-500 ml-1">(12 reviews)</div>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              {product?.description || "No description available"}
            </p>

            {/* Product Features */}
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Premium quality materials for durability</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Ergonomic design for comfort and style</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Easy to clean and maintain surface</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Perfect dimensions for versatile use</span>
              </li>
            </ul>

            {/* Quantity selector */}
            <div className="flex items-center mb-6">
              <div className="flex border border-gray-300 rounded-md">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-12 flex items-center justify-center">
                  {quantity}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setQuantity(prev => prev + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <Button 
                className="flex items-center justify-center rounded-full" 
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-center rounded-full"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>

            {/* Additional Info */}
            <div className="text-sm space-y-3 mt-6">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 hover:text-gray-900 p-0 rounded-full"
                  onClick={toggleWishlist}
                >
                  <Heart className={`h-5 w-5 mr-2 ${isInWishlist ? 'fill-current text-red-500' : ''}`} />
                  <span>{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
                </Button>
              </div>
              <div>
                <strong>Free worldwide shipping</strong> on all orders over $100
              </div>
              <div>
                <strong>Returns in 14 Days</strong> (Shipping & Return)
              </div>
            </div>
          </div>
        </div>

        {/* Product Description and Reviews */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="py-6">
            <div className="prose max-w-none">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              
              <ul>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="py-6">
            <div className="prose max-w-none">
              <h3>Customer Reviews</h3>
              
              <div className="grid gap-6">
                {[1, 2, 3].map((review) => (
                  <div key={review} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 font-medium">Customer Name</span>
                      <span className="ml-auto text-sm text-gray-500">3 months ago</span>
                    </div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Similar Products */}
        <div className="mb-16">
          <h2 className="text-2xl font-medium mb-6">Similar Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts?.slice(0, 4).map((relatedProduct) => (
              <div key={relatedProduct.id} className="relative group">
                <div className="absolute top-2 left-2 z-10">
                  <Badge variant="default" className="bg-black text-white rounded-full">NEW</Badge>
                </div>
                <Link href={`/products/${relatedProduct.id}`}>
                  <div className="aspect-square bg-gray-200 mb-3 overflow-hidden">
                    {relatedProduct.imageUrl ? (
                      <img 
                        src={relatedProduct.imageUrl} 
                        alt={relatedProduct.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm line-clamp-1">{relatedProduct.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <div className="font-medium">${Number(relatedProduct.price).toFixed(2)}</div>
                    {relatedProduct.compareAtPrice && (
                      <div className="text-sm text-gray-500 line-through">
                        ${Number(relatedProduct.compareAtPrice).toFixed(2)}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}