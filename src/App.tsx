import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SearchResults from "./pages/SearchResults";
import Authentication from "./pages/Authentication";
import NotFound from "./pages/NotFound";
import BookingConfirmation from "./pages/BookingConfirmation";
import { Provider } from 'react-redux'; 
import store from "./services/store";
import ProtectedRoute from "./components/protectedRoute";
import { AuthProvider } from "./services/authContext";
import BookingsList from "./pages/BookingList";
import BookingDetails from "./pages/BookingDetails";


const queryClient = new QueryClient();

const App = () => (
  
  <Provider store={store}> 
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/search-results" element={<SearchResults />} />
              <Route path="/booking" element={<BookingConfirmation />} />
              <Route path="/flights" element={<Index />} />
              <Route path="/bookings" element={<BookingsList />}/>
              <Route path="/bookings/:booking_id" element={<BookingDetails />}/>
            </Route>

            {/* Public route */}
            <Route path="/auth" element={<Authentication />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </AuthProvider>
  </Provider>  
);

export default App;
