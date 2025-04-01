import React, { useState, useEffect } from 'react';
import { Menu, X, User, UserPlus, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/services/store';
import { supabase } from '@/services/supabase';
import { clearUser } from '@/services/store/userSlice';


const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userDetails = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut(); 
      dispatch(clearUser()); 
      navigate('/auth');
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-panel py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-semibold">SaiTeja</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link to="/flights" className="text-sm font-medium hover:text-primary transition-colors">Flights</Link>
          <Link to="/bookings" className="text-sm font-medium hover:text-primary transition-colors">Bookings</Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
        </nav>

        {/* Auth/Profile Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {userDetails ? (
            <>
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>Hello, {userDetails.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-1">
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth?mode=login">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <User size={16} />
                  <span>Login</span>
                </Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button className="flex items-center gap-1" size="sm">
                  <UserPlus size={16} />
                  <span>Sign Up</span>
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground p-2 rounded-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel mt-2 px-4 py-4 animate-slide-down">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-sm font-medium p-2 hover:bg-accent rounded-md transition-colors">Home</Link>
            <Link to="/flights" className="text-sm font-medium p-2 hover:bg-accent rounded-md transition-colors">Flights</Link>
            <Link to="/bookings" className="text-sm font-medium p-2 hover:bg-accent rounded-md transition-colors">Bookings</Link>
            <Link to="/about" className="text-sm font-medium p-2 hover:bg-accent rounded-md transition-colors">About</Link>
            <div className="flex space-x-2 pt-2 border-t">
              {userDetails ? (
                <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </Button>
              ) : (
                <>
                  <Link to="/auth?mode=login" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">Login</Button>
                  </Link>
                  <Link to="/auth?mode=register" className="flex-1">
                    <Button size="sm" className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
