import React, { useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Phone, FileText, Play, MessageSquare } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login";
  
  const { user, signIn, signUp } = useAuth();
  
  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    try {
      setIsSubmitting(true);
      await signIn(email, password);
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) return;
    
    try {
      setIsSubmitting(true);
      await signUp(email, password, fullName);
      // No need to clear form as user will be redirected
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to AgentTrainer</h1>
          <p className="text-gray-600">Enhance your customer service skills with interactive training</p>
        </div>

        <Card className="p-6">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-2">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSignIn}>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>Enter your credentials to access your training</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="transition-all duration-200 focus:border-brand-blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Button variant="link" className="p-0 h-auto text-xs" type="button">
                        Forgot password?
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pr-10 transition-all duration-200 focus:border-brand-blue"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-brand-blue hover:bg-brand-blue-dark transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <LogIn size={18} />
                        Log In
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardHeader>
                  <CardTitle>Create Your Account</CardTitle>
                  <CardDescription>Enter your information to get started immediately</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="transition-all duration-200 focus:border-brand-blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailSignup">Email</Label>
                    <Input
                      id="emailSignup"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="transition-all duration-200 focus:border-brand-blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordSignup">Password</Label>
                    <div className="relative">
                      <Input
                        id="passwordSignup"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pr-10 transition-all duration-200 focus:border-brand-blue"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 6 characters
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-brand-blue hover:bg-brand-blue-dark transition-all duration-200 hover:scale-[1.02]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </span>
                    ) : (
                      "Create Account & Start Training"
                    )}
                  </Button>
                  <p className="text-xs text-center text-gray-500">
                    By creating an account, you'll be automatically signed in and ready to start training immediately.
                  </p>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
        
        <div className="mt-6">
          <p className="text-sm text-gray-600 text-center">
            Sign in to access:
          </p>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-center text-sm">
            <div className="p-3 border rounded-md">
              <Phone className="h-5 w-5 mx-auto mb-2 text-green-500" />
              <p>Mock Call Scenarios</p>
            </div>
            <div className="p-3 border rounded-md">
              <FileText className="h-5 w-5 mx-auto mb-2 text-blue-500" />
              <p>Knowledge Base</p>
            </div>
            <div className="p-3 border rounded-md">
              <Play className="h-5 w-5 mx-auto mb-2 text-purple-500" />
              <p>Video Learning</p>
            </div>
            <div className="p-3 border rounded-md">
              <MessageSquare className="h-5 w-5 mx-auto mb-2 text-orange-500" />
              <p>AI Assistant</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            By signing in or creating an account, you agree to our{" "}
            <Button variant="link" className="p-0 h-auto text-xs">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="p-0 h-auto text-xs">
              Privacy Policy
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
