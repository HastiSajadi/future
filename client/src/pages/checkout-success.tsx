import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  // Use effect to scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4 sm:px-6">
        <div className="max-w-lg mx-auto">
          <motion.div
            className="bg-white p-8 text-center rounded-lg shadow"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Success Icon */}
            <motion.div
              className="mx-auto flex items-center justify-center w-16 h-16 bg-black rounded-full mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Check className="text-white" size={30} />
            </motion.div>

            {/* Success Message */}
            <motion.h1
              className="text-2xl font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Thank you!
            </motion.h1>

            <motion.p
              className="text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Your order has been confirmed & is on its way. Check your email for the details.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/">
                <Button 
                  className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 rounded-full"
                >
                  Go to Homepage
                </Button>
              </Link>
              <Link href="/products">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto border-black text-black hover:bg-gray-100 rounded-full"
                >
                  Check Order Details
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}