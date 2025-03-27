import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Clock, ArrowRight, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/services/supabase';


// SearchResults component
const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [sortBy, setSortBy] = useState('price');


  useEffect(() => {
    const fetchFlights = async () => {
      const params = new URLSearchParams(location.search);
      const originCode = params.get('origin');
      const destinationCode = params.get('destination');
  
      setLoading(true);
  
      try {
        const { data, error } = await supabase
        .from('flights')
        .select(`
          id,  
          flight_id, 
          origin, 
          destination, 
          airports!flights_origin_fkey(id, name, code,
          airports!flights_destination_fkey(id, name, code)
        `);

if (error) {
  console.error("Error fetching flights:", error);
} else {
  console.log("Trip data:", data);
}

if (error) {
  console.error('Error fetching trips:', error);
} else {
  console.log('Trips data:', data);
}


  
        if (error) throw error;
  
        setFlights(data);
        setFilteredFlights(data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFlights();
  }, [location.search]);
  
  
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...flights];
    
    // Filter by price range
    result = result.filter(flight => 
      flight.price >= priceRange[0] && flight.price <= priceRange[1]
    );
    
    // Filter by stops
    if (selectedStops.length > 0) {
      result = result.filter(flight => 
        selectedStops.includes(flight.stops.toString())
      );
    }
    
    // Filter by airlines
    if (selectedAirlines.length > 0) {
      result = result.filter(flight => 
        selectedAirlines.includes(flight.airline)
      );
    }
    
    // Sort
    if (sortBy === 'price') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'duration') {
      result.sort((a, b) => {
        const getDurationMinutes = (duration) => {
          const [hours, minutes] = duration.split('h ');
          return parseInt(hours) * 60 + parseInt(minutes.replace('m', ''));
        };
        return getDurationMinutes(a.duration) - getDurationMinutes(b.duration);
      });
    } else if (sortBy === 'departure') {
      result.sort((a, b) => {
        const timeToMinutes = (time) => {
          const [hours, minutes] = time.split(':');
          return parseInt(hours) * 60 + parseInt(minutes);
        };
        return timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime);
      });
    }

    setFilteredFlights(result);
  }, [flights, priceRange, selectedStops, selectedAirlines, sortBy]);

  // Get unique airlines for filter
  const airlines = [...new Set(flights.map(flight => flight.airline))];

  // Handle stop filter change
  const handleStopChange = (value) => {
    setSelectedStops(prev => 
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  // Handle airline filter change
  const handleAirlineChange = (value) => {
    setSelectedAirlines(prev => 
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Flight Search Results</h1>
          
          {/* Search details summary */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center mb-2 md:mb-0">
                <span className="font-semibold">JFK</span>
                <ArrowRight size={18} className="mx-2" />
                <span className="font-semibold">BOS</span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span>Nov 15, 2023</span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span>1 Passenger</span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span>Economy</span>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                size="sm"
              >
                Modify Search
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters panel */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center">
                    <Filter size={18} className="mr-2" />
                    Filters
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </Button>
                </div>
                
                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Price range filter */}
                  <div>
                    <h3 className="font-medium mb-3">Price Range</h3>
                    <Slider
                      defaultValue={[0, 500]}
                      min={0}
                      max={500}
                      step={10}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mb-2"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                  
                  {/* Stops filter */}
                  <div>
                    <h3 className="font-medium mb-3">Stops</h3>
                    <div className="space-y-2">
                      {[0, 1, 2].map(stop => (
                        <div key={stop} className="flex items-center">
                          <Checkbox 
                            id={`stop-${stop}`} 
                            checked={selectedStops.includes(stop.toString())}
                            onCheckedChange={() => handleStopChange(stop.toString())}
                          />
                          <Label htmlFor={`stop-${stop}`} className="ml-2">
                            {stop === 0 ? 'Non-stop' : stop === 1 ? '1 Stop' : `${stop} Stops`}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Airlines filter */}
                  <div>
                    <h3 className="font-medium mb-3">Airlines</h3>
                    <div className="space-y-2">
                      {airlines.map(airline => (
                        <div key={airline} className="flex items-center">
                          <Checkbox 
                            id={`airline-${airline}`} 
                            checked={selectedAirlines.includes(airline)}
                            onCheckedChange={() => handleAirlineChange(airline)}
                          />
                          <Label htmlFor={`airline-${airline}`} className="ml-2">
                            {airline}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Flight results */}
            <div className="lg:w-3/4">
              {/* Sort options */}
              <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Showing {filteredFlights.length} results
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Sort by:</span>
                    <select
                      className="text-sm border-none focus:ring-0"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="price">Price (lowest first)</option>
                      <option value="duration">Duration (shortest first)</option>
                      <option value="departure">Departure (earliest first)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Flight result cards */}
              {loading ? (
                <div className="text-center py-8">
                  <span>Loading flights...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredFlights.map(flight => (
                    <Card key={flight.id} className="shadow-lg">
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-xl font-semibold">{flight.airline}</h3>
                            <p className="text-sm text-muted-foreground">
                              {flight.origin} to {flight.destination}
                            </p>
                          </div>
                          <div>
                            <p className="text-xl font-semibold">${flight.price}</p>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <p>
                            {flight.departure} - {flight.arrival}
                          </p>
                          <p>
                            {flight.available_seats} seats available | {flight.passengers} passengers
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResults;
