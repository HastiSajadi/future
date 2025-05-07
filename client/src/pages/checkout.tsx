import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Define schemas for different checkout steps
const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone number is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  postcode: z.string().min(1, "Postcode/ZIP is required"),
});

const billingInfoSchema = z.object({
  nameOnCard: z.string().min(1, "Name on card is required"),
  cardNumber: z.string().min(16, "Valid card number is required").max(16),
  expiryDate: z.string().min(1, "Expiry date is required"),
  cvv: z.string().min(3, "CVV is required").max(4),
  savePaymentMethod: z.boolean().optional(),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
type BillingInfoValues = z.infer<typeof billingInfoSchema>;

// Define the steps for the checkout process
enum CheckoutStep {
  Personal = "personal",
  Billing = "billing",
  Confirmation = "confirmation",
}

export default function CheckoutPage() {
  const [step, setStep] = useState<CheckoutStep>(CheckoutStep.Personal);
  const [, navigate] = useLocation();
  const { cartItems, cartTotal, clearCart } = useCart();

  // Form for personal information (Step 1)
  const personalInfoForm = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      streetAddress: "",
      city: "",
      country: "",
      postcode: "",
    },
  });

  // Form for billing information (Step 2)
  const billingInfoForm = useForm<BillingInfoValues>({
    resolver: zodResolver(billingInfoSchema),
    defaultValues: {
      nameOnCard: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      savePaymentMethod: false,
    },
  });

  const onPersonalInfoSubmit = (data: PersonalInfoValues) => {
    // Save personal info data and move to next step
    console.log("Personal Info:", data);
    setStep(CheckoutStep.Billing);
  };

  const onBillingInfoSubmit = (data: BillingInfoValues) => {
    // Save billing info data and move to next step
    console.log("Billing Info:", data);
    setStep(CheckoutStep.Confirmation);
    
    // In a real application, this would be the point to process the payment
    // and create the order in the backend before showing confirmation
    
    // For demo purposes, we'll just simulate a successful order after a delay
    setTimeout(() => {
      // Clear the cart after successful checkout
      clearCart();
      // Navigate to success page
      navigate("/checkout/success");
    }, 1000);
  };

  // Common animation props
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 sm:px-6">
        {/* Checkout Steps Indicator */}
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-0 bg-gray-200 rounded-lg overflow-hidden">
            <div 
              className={`py-3 px-4 text-center ${
                step === CheckoutStep.Personal ? "bg-gray-400" : ""
              }`}
            >
              Personal
            </div>
            <div 
              className={`py-3 px-4 text-center ${
                step === CheckoutStep.Billing ? "bg-gray-400" : ""
              }`}
            >
              Billing
            </div>
            <div 
              className={`py-3 px-4 text-center ${
                step === CheckoutStep.Confirmation ? "bg-gray-400" : ""
              }`}
            >
              Confirmation
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Form Steps */}
          <div className="md:col-span-2">
            {/* Step 1: Personal Information */}
            {step === CheckoutStep.Personal && (
              <motion.div
                variants={containerAnimation}
                initial="hidden"
                animate="visible"
              >
                <form onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div variants={itemAnimation}>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                        First Name*
                      </label>
                      <Input
                        id="firstName"
                        {...personalInfoForm.register("firstName")}
                        className="rounded-lg"
                      />
                      {personalInfoForm.formState.errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {personalInfoForm.formState.errors.firstName.message}
                        </p>
                      )}
                    </motion.div>

                    <motion.div variants={itemAnimation}>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                        Last Name*
                      </label>
                      <Input
                        id="lastName"
                        {...personalInfoForm.register("lastName")}
                        className="rounded-lg"
                      />
                      {personalInfoForm.formState.errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {personalInfoForm.formState.errors.lastName.message}
                        </p>
                      )}
                    </motion.div>

                    <motion.div variants={itemAnimation}>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email Address*
                      </label>
                      <Input
                        id="email"
                        type="email"
                        {...personalInfoForm.register("email")}
                        className="rounded-lg"
                      />
                      {personalInfoForm.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {personalInfoForm.formState.errors.email.message}
                        </p>
                      )}
                    </motion.div>

                    <motion.div variants={itemAnimation}>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">
                        Phone Number*
                      </label>
                      <Input
                        id="phone"
                        {...personalInfoForm.register("phone")}
                        className="rounded-lg"
                      />
                      {personalInfoForm.formState.errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {personalInfoForm.formState.errors.phone.message}
                        </p>
                      )}
                    </motion.div>

                    <motion.div variants={itemAnimation} className="sm:col-span-2">
                      <label htmlFor="streetAddress" className="block text-sm font-medium mb-1">
                        Street Address*
                      </label>
                      <Input
                        id="streetAddress"
                        {...personalInfoForm.register("streetAddress")}
                        className="rounded-lg"
                      />
                      {personalInfoForm.formState.errors.streetAddress && (
                        <p className="text-red-500 text-sm mt-1">
                          {personalInfoForm.formState.errors.streetAddress.message}
                        </p>
                      )}
                    </motion.div>

                    <motion.div variants={itemAnimation}>
                      <label htmlFor="city" className="block text-sm font-medium mb-1">
                        Town / City*
                      </label>
                      <Input
                        id="city"
                        {...personalInfoForm.register("city")}
                        className="rounded-lg"
                      />
                      {personalInfoForm.formState.errors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {personalInfoForm.formState.errors.city.message}
                        </p>
                      )}
                    </motion.div>

                    <motion.div variants={itemAnimation}>
                      <label htmlFor="country" className="block text-sm font-medium mb-1">
                        Country*
                      </label>
                      <Input
                        id="country"
                        {...personalInfoForm.register("country")}
                        className="rounded-lg"
                      />
                      {personalInfoForm.formState.errors.country && (
                        <p className="text-red-500 text-sm mt-1">
                          {personalInfoForm.formState.errors.country.message}
                        </p>
                      )}
                    </motion.div>

                    <motion.div variants={itemAnimation}>
                      <label htmlFor="postcode" className="block text-sm font-medium mb-1">
                        Postcode / ZIP*
                      </label>
                      <Input
                        id="postcode"
                        {...personalInfoForm.register("postcode")}
                        className="rounded-lg"
                      />
                      {personalInfoForm.formState.errors.postcode && (
                        <p className="text-red-500 text-sm mt-1">
                          {personalInfoForm.formState.errors.postcode.message}
                        </p>
                      )}
                    </motion.div>
                  </div>

                  <motion.div variants={itemAnimation} className="mt-6">
                    <Button 
                      type="submit" 
                      className="bg-black text-white hover:bg-gray-800 rounded-full px-6"
                    >
                      Proceed to Next Step
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            )}

            {/* Step 2: Billing Information */}
            {step === CheckoutStep.Billing && (
              <motion.div
                variants={containerAnimation}
                initial="hidden"
                animate="visible"
              >
                <form onSubmit={billingInfoForm.handleSubmit(onBillingInfoSubmit)}>
                  <div className="space-y-4">
                    <motion.div variants={itemAnimation}>
                      <label htmlFor="nameOnCard" className="block text-sm font-medium mb-1">
                        Name On Card*
                      </label>
                      <Input
                        id="nameOnCard"
                        {...billingInfoForm.register("nameOnCard")}
                        className="rounded-lg"
                      />
                      {billingInfoForm.formState.errors.nameOnCard && (
                        <p className="text-red-500 text-sm mt-1">
                          {billingInfoForm.formState.errors.nameOnCard.message}
                        </p>
                      )}
                    </motion.div>

                    <motion.div variants={itemAnimation}>
                      <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                        Card Number*
                      </label>
                      <Input
                        id="cardNumber"
                        {...billingInfoForm.register("cardNumber")}
                        placeholder="•••• •••• •••• ••••"
                        className="rounded-lg"
                      />
                      {billingInfoForm.formState.errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {billingInfoForm.formState.errors.cardNumber.message}
                        </p>
                      )}
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.div variants={itemAnimation}>
                        <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">
                          Valid Through*
                        </label>
                        <Input
                          id="expiryDate"
                          {...billingInfoForm.register("expiryDate")}
                          placeholder="MM/YY"
                          className="rounded-lg"
                        />
                        {billingInfoForm.formState.errors.expiryDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {billingInfoForm.formState.errors.expiryDate.message}
                          </p>
                        )}
                      </motion.div>

                      <motion.div variants={itemAnimation}>
                        <label htmlFor="cvv" className="block text-sm font-medium mb-1">
                          CVV*
                        </label>
                        <Input
                          id="cvv"
                          {...billingInfoForm.register("cvv")}
                          placeholder="•••"
                          className="rounded-lg"
                        />
                        {billingInfoForm.formState.errors.cvv && (
                          <p className="text-red-500 text-sm mt-1">
                            {billingInfoForm.formState.errors.cvv.message}
                          </p>
                        )}
                      </motion.div>
                    </div>

                    <motion.div variants={itemAnimation} className="flex items-center space-x-2">
                      <Checkbox
                        id="savePaymentMethod"
                        {...billingInfoForm.register("savePaymentMethod")}
                      />
                      <Label htmlFor="savePaymentMethod">Save As Default Payment Method</Label>
                    </motion.div>

                    <motion.div variants={itemAnimation} className="mt-6">
                      <Button 
                        type="submit" 
                        className="bg-black text-white hover:bg-gray-800 rounded-full px-6"
                      >
                        Proceed to Next Step
                      </Button>
                    </motion.div>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: Confirmation (this will redirect to checkout success page) */}
            {step === CheckoutStep.Confirmation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white rounded-lg shadow-sm p-8"
              >
                <div className="animate-spin mb-4 mx-auto w-12 h-12 border-4 border-gray-300 border-t-black rounded-full"></div>
                <p className="text-lg">Processing your order...</p>
              </motion.div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-gray-200 p-4 mb-4 rounded-lg">
              <h2 className="font-medium">Cart Details</h2>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span>PRODUCT</span>
                  <div className="flex space-x-8">
                    <span>Quantity</span>
                    <span>SUBTOTAL</span>
                  </div>
                </div>
                
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b">
                    <span>{item.name}</span>
                    <div className="flex space-x-12">
                      <span>0{item.quantity}</span>
                      <span>${Number(item.price).toFixed(2)}</span>
                    </div>
                  </div>
                ))}

                <div className="pt-4">
                  <div className="flex justify-between py-2">
                    <span>SUBTOTAL</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b">
                    <span>SHIPPING</span>
                    <span>$0.00</span>
                  </div>

                  <div className="flex justify-between py-4 font-semibold">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}