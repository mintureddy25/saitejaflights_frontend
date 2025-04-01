import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Calendar, Users, ChevronsUpDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { supabase } from '@/services/supabase';
import { useToast } from '@/hooks/use-toast';

type TripType = 'roundTrip' | 'oneWay';

const FlightSearch = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<TripType>('roundTrip');
  const [origin, setOrigin] = useState<string | null>(null); // Changed to store airport id
  const [destination, setDestination] = useState<string | null>(null); // Changed to store airport id
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('economy');
  const [airports, setAirports] = useState<any[]>([]); // State to store airport data
  const { toast } = useToast();

  // Fetch airport data from Supabase
  useEffect(() => {
    async function fetchAirports() {
      const { data, error } = await supabase
        .from('airports') // Replace with your actual table name
        .select('id, name, code');
      
      if (error) {
        console.error('Error fetching airports:', error);
        return;
      }
      
      setAirports(data || []);
    }

    fetchAirports();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Origin and Destination must not be the same
    if (origin === destination) {
      
      toast({
        title: "Error",
        description: `Origin and Destination cannot be the same.`,
        variant: "destructive"
      });
      return;
    }
    console.log(tripType,"trip type");

    // Validation: Both Departure and Return dates must be selected (for round trip)
    if (tripType === 'roundTrip' && (!departureDate || !returnDate)) {
      toast({
        title: "Error",
        description: `select both departure and return dates`,
        variant: "destructive"
      });
      return;
    }

    if (!departureDate) {
      toast({
        title: "Error",
        description: `Please select the departure date`,
        variant: "destructive"
      });
      return;
    }

    // Prepare search parameters
    const searchParams = new URLSearchParams({
      tripType,
      origin: origin?.toString() || '',
      destination: destination?.toString() || '',
      departureDate: departureDate ? format(departureDate, 'yyyy-MM-dd') : '',
      returnDate: returnDate ? format(returnDate, 'yyyy-MM-dd') : '',
      passengers: passengers.toString(),
      cabinClass
    });
    
    navigate(`/search-results?${searchParams.toString()}`);
  };

  return (
    <motion.div 
      className="container mx-auto px-4 -mt-32 relative z-20"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    >
      <Card className="glass-panel rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <RadioGroup 
              defaultValue={tripType} 
              onValueChange={(value) => setTripType(value as TripType)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="roundTrip" id="roundTrip" />
                <Label htmlFor="roundTrip" className="cursor-pointer">Round Trip</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oneWay" id="oneWay" />
                <Label htmlFor="oneWay" className="cursor-pointer">One Way</Label>
              </div>
            </RadioGroup>
          </div>
          
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Origin Airport */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Plane size={18} />
                </div>
                <select 
                  className="pl-10 h-12 w-full"
                  value={origin || ''}
                  onChange={(e) => setOrigin(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Origin</option>
                  {airports.map((airport) => (
                    <option key={airport.id} value={airport.id}>
                      {airport.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Destination Airport */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Plane size={18} className="transform rotate-90" />
                </div>
                <select 
                  className="pl-10 h-12 w-full"
                  value={destination || ''}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Destination</option>
                  {airports.map((airport) => (
                    <option key={airport.id} value={airport.id}>
                      {airport.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Departure Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-12"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {departureDate ? (
                      format(departureDate, "PPP")
                    ) : (
                      <span className="text-muted-foreground">Departure Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              {/* Return Date */}
              {tripType === 'roundTrip' && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-12"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {returnDate ? (
                        format(returnDate, "PPP")
                      ) : (
                        <span className="text-muted-foreground">Return Date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      disabled={(date) => 
                        date < (departureDate || new Date())
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
              
              {/* Passengers */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Users size={18} />
                </div>
                <select
                  className="w-full pl-10 h-12 rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(number => (
                    <option key={number} value={number}>
                      {number} {number === 1 ? 'Passenger' : 'Passengers'}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Cabin Class */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <ChevronsUpDown size={18} />
                </div>
                <select
                  className="w-full pl-10 h-12 rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value)}
                >
                  <option value="economy">Economy</option>
                  <option value="premium">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                type="submit" 
                className="w-full md:w-auto px-8 h-12 bg-primary hover:bg-primary/90 text-white flex items-center gap-2 transition-all hover-scale"
              >
                Search Flights
                <ChevronRight size={18} />
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </motion.div>
  );
};

export default FlightSearch;
