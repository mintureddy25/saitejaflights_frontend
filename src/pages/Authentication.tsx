
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { supabase } from '@/services/supabase';
import { log } from 'console';
import { useToast } from '@/hooks/use-toast';

const Authentication = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('login');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {toast} = useToast();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'login' || mode === 'register') {
      setActiveTab(mode);
    }
  }, [location.search]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Await the login function to ensure it finishes before continuing
    const res = await login(email, password);
  
    if (res?.error) {
      console.error('Error signing in:', res.error.message);
    } else {
      console.log('Logged in user:', res);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      toast({
        title: "Error",
        description: String(error),
        variant: "destructive"
      });
      setIsSubmitting(false)
      return { error };

    } else {
       navigate('/')
       console.log("logged in"); // Return the user object or any other data you need
    }
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    //setErrorMessage('');

    try {
      // Sign up user using Supabase auth
      const { error } = await supabase.auth.signUp(
        {
          email,
          password,
          options:{ data:{fullName}}
        },
      
       
      );

      if (error) {
        toast({
          title: "Error",
          description: String(error),
          variant: "destructive"
        });
        throw error;
      }

      // console.log('User registered successfully:');
      // const { error: updateError } = await supabase.auth.updateUser({
      //   data: { display_name: fullName }
      // });

      // if (updateError) {
      //   throw updateError; 
      // }

      toast({
        title: "Account created",
        description: "Confirm the email and login",
      });

      
      // After successful registration, switch to the login tab
      setActiveTab('login');
    } catch (error: any) {
      console.error('Registration error:', error.message);
      //setErrorMessage(error.message);  // Set error message for UI feedback
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow flex items-center justify-center py-16 bg-blue-50/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <Card className="shadow-lg border-none">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                  {activeTab === 'login' ? 'Welcome back' : 'Create an account'}
                </CardTitle>
                <CardDescription className="text-center">
                  {activeTab === 'login' 
                    ? 'Enter your credentials to access your account' 
                    : 'Enter your details and start your journey with us'}
                </CardDescription>
              </CardHeader>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="name@example.com" 
                            className="pl-10" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <a 
                            href="#" 
                            className="text-xs text-primary hover:text-primary/90 underline-animation"
                          >
                            Forgot password?
                          </a>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input 
                            id="password" 
                            type={showPassword ? "text" : "password"} 
                            className="pl-10 pr-10" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button 
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full hover-scale" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input 
                            id="name" 
                            placeholder="John Doe" 
                            className="pl-10" 
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input 
                            id="register-email" 
                            type="email" 
                            placeholder="name@example.com" 
                            className="pl-10" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input 
                            id="register-password" 
                            type={showPassword ? "text" : "password"} 
                            className="pl-10 pr-10" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button 
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Password must be at least 8 characters long
                        </p>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full hover-scale" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="p-6 pt-0 text-center text-sm">
                {activeTab === 'login' ? (
                  <p>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="text-primary hover:text-primary/90 font-medium underline-animation"
                      onClick={() => setActiveTab('register')}
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="text-primary hover:text-primary/90 font-medium underline-animation"
                      onClick={() => setActiveTab('login')}
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Authentication;
