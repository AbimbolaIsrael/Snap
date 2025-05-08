import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, Eye } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect if already authenticated
  if (!loading && isAuthenticated) {
    navigate("/dashboard");
    return null;
  }
  
  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });
  
  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await login(loginForm.email, loginForm.password);
      navigate("/dashboard");
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await register(
        registerForm.email,
        registerForm.password,
        registerForm.name
      );
      navigate("/dashboard");
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 px-4 pb-16">
        <div className="container mx-auto max-w-md">
          <Tabs defaultValue="login" className="animate-fade-in">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                  <CardDescription className="text-center">
                    Sign in to your SnapView account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          value={loginForm.email}
                          onChange={handleLoginChange}
                          required
                          className="pl-9"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={handleLoginChange}
                          required
                          className="pl-9"
                        />
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                          Logging in...
                        </>
                      ) : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter>
                  <p className="text-center text-sm text-muted-foreground w-full">
                    For demo, please use: <br></br>username: <span className="font-medium">creator@example.com</span> <br></br>password: <span className="font-medium">creator123</span>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
                  <CardDescription className="text-center">
                    Join SnapView and start exploring photos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="register-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-name"
                          name="name"
                          type="text"
                          placeholder="John Doe"
                          value={registerForm.name}
                          onChange={handleRegisterChange}
                          required
                          className="pl-9"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="register-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          value={registerForm.email}
                          onChange={handleRegisterChange}
                          required
                          className="pl-9"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          value={registerForm.password}
                          onChange={handleRegisterChange}
                          required
                          className="pl-9"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Signing up as a Consumer
                      </p>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                          Creating account...
                        </>
                      ) : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Auth;
