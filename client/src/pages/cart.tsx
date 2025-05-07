import React from 'react';
import { Link } from 'wouter';
import { Minus, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';

import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { useCart, CartItem } from '@/contexts/CartContext';
import { Product } from '@shared/schema';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animation variants for items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(item.id, newQuantity);
    }
  };

  // Function to display similar products
  const SimilarProducts = () => {
    // In a real implementation, you might fetch these from an API
    // based on the current cart items' categories
    const products: Product[] = [
      {
        id: 10,
        name: 'Double Bed & Side Tables',
        price: '450.00',
        description: 'Comfortable double bed with side tables',
        imageUrl: '/placeholder.jpg',
        categoryId: 1,
        createdAt: new Date(),
        compareAtPrice: null,
        badge: 'SALE',
        isFeatured: false,
        isPopular: true
      },
      {
        id: 11,
        name: 'Double Bed & Side Tables',
        price: '550.00',
        description: 'Comfortable double bed with side tables',
        imageUrl: '/placeholder.jpg', 
        categoryId: 1,
        createdAt: new Date(),
        compareAtPrice: null,
        badge: 'SALE',
        isFeatured: false,
        isPopular: true
      },
      {
        id: 12,
        name: 'Double Bed & Side Tables',
        price: '650.00',
        description: 'Comfortable double bed with side tables',
        imageUrl: '/placeholder.jpg',
        categoryId: 1,
        createdAt: new Date(),
        compareAtPrice: null,
        badge: 'SALE',
        isFeatured: false,
        isPopular: true
      },
      {
        id: 13,
        name: 'Double Bed & Side Tables',
        price: '750.00',
        description: 'Comfortable double bed with side tables',
        imageUrl: '/placeholder.jpg',
        categoryId: 1,
        createdAt: new Date(),
        compareAtPrice: null,
        badge: 'SALE',
        isFeatured: false,
        isPopular: true
      }
    ];

    return (
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map(product => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative bg-gray-200 rounded-lg p-4 flex flex-col"
            >
              <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                SALE
              </div>
              <div className="h-48 bg-gray-300 mb-3 rounded-lg"></div>
              <h3 className="font-medium">{product.name}</h3>
              <div className="flex justify-between mt-2">
                <p className="line-through text-gray-500">${(Number(product.price) * 1.2).toFixed(2)}</p>
                <p className="font-semibold">${Number(product.price).toFixed(2)}</p>
              </div>
              <div className="mt-2 flex justify-center">
                <Link href={`/products/${product.id}`}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-8 w-8 border-gray-300"
                  >
                    <div className="h-1 w-1 bg-black rounded-full"></div>
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto my-10 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Cart Items Section */}
          <div className="col-span-2">
            <div className="bg-gray-200 p-4 grid grid-cols-4 gap-4 mb-4 font-medium rounded-lg">
              <div className="col-span-1">Product</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-center">Total</div>
            </div>

            {cartItems.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className="text-center py-10 bg-white rounded-lg"
              >
                <p className="text-lg text-gray-500">Your cart is empty</p>
                <Link href="/products">
                  <Button className="mt-4 bg-black text-white hover:bg-gray-800 rounded-full">
                    Continue Shopping
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <>
                {cartItems.map(item => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="grid grid-cols-4 gap-4 p-4 border-b items-center"
                  >
                    <div className="col-span-1 flex items-center gap-3">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={18} />
                      </button>
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-100 flex-shrink-0 mr-3 rounded-lg"></div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                    </div>
                    <div className="text-center">${Number(item.price).toFixed(2)}</div>
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        className="p-1 border rounded-full"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="mx-2 w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        className="p-1 border rounded-full"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="text-center font-medium">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </div>

          {/* Cart Summary Section */}
          <div className="col-span-1">
            <div className="bg-gray-200 p-4 mb-4 rounded-lg">
              <h2 className="font-medium">Cart Total</h2>
            </div>

            <div className="p-4 border border-gray-200 space-y-4 rounded-lg">
              <div className="flex justify-between py-2 border-b">
                <span>SUBTOTAL</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span>DISCOUNT</span>
                <span>$0.00</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="font-medium">TOTAL</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>

              <Link href="/checkout">
                <Button className="w-full mt-4 bg-black text-white hover:bg-gray-800 rounded-full">
                  Proceed To Checkout
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Similar Products Section */}
        {cartItems.length > 0 && <SimilarProducts />}
      </div>
    </MainLayout>
  );
}