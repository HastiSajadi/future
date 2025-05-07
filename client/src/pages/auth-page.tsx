import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Redirect } from "wouter";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

// Login form validation schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

// Register form validation schema
const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      terms: false
    }
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    registerMutation.mutate({
      name: data.fullName,
      username: data.username,
      password: data.password
    });
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column (Login/Signup form) */}
          <div className="bg-white p-8 md:p-12 rounded-2xl">
            {/* Login Form */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Login</h2>
              <p className="text-gray-500 mb-6">
                Do not have an account? <Link href="/auth?tab=signup" className="text-blue-600 hover:underline">Create a new one.</Link>
              </p>

              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="login-username" className="block text-sm font-medium mb-1">
                    Enter Your Email Or Phone
                  </label>
                  <Input
                    id="login-username"
                    type="text"
                    placeholder="michael.joe@email.com"
                    className="rounded-full"
                    {...loginForm.register("username")}
                  />
                  {loginForm.formState.errors.username && (
                    <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium mb-1">
                    Enter Your Password
                  </label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="••••••"
                      className="rounded-full"
                      {...loginForm.register("password")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full py-6"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>

                <div className="text-center mt-4">
                  <Link href="#forgot-password" className="text-sm text-gray-600 hover:text-gray-900">
                    Forgot Your Password?
                  </Link>
                </div>
              </form>
            </div>

            {/* Signup Form */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-2">Signup</h2>
              <p className="text-gray-500 mb-6">
                Already Have An Account? <Link href="/auth" className="text-blue-600 hover:underline">Login</Link>
              </p>

              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="full-name" className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <Input
                    id="full-name"
                    type="text"
                    placeholder="Michael Joe"
                    className="rounded-full"
                    {...registerForm.register("fullName")}
                  />
                  {registerForm.formState.errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="michael.joe@email.com"
                    className="rounded-full"
                    {...registerForm.register("username")}
                  />
                  {registerForm.formState.errors.username && (
                    <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="••••••"
                      className="rounded-full"
                      {...registerForm.register("password")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    >
                      {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••"
                      className="rounded-full"
                      {...registerForm.register("confirmPassword")}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex items-start">
                  <Checkbox
                    id="terms"
                    className="mt-1"
                    {...registerForm.register("terms")}
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    I have read and agreed to the Terms of Service and Privacy Policy
                  </label>
                </div>
                {registerForm.formState.errors.terms && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.terms.message}</p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full py-6"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </div>
          </div>
          
          {/* Right Column (Image) */}
          <div className="hidden md:block bg-gray-300 rounded-2xl">
            {/* This is where the image would go in the screenshot */}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}