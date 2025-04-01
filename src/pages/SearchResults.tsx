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
import { calculateDuration, getTimeFromDateTime } from '@/lib/utils';


const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [returnFilteredFlights, setReturnFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('price');
  const params = new URLSearchParams(location.search);
  const passengers = params.get('passengers');
  const tripType = params.get('tripType');
  const cabinClass = params.get('cabinClass')
  const [selectedDeparture, setSelectedDeparture] = useState<number | null>(null);
  const [selectedReturn, setSelectedReturn] = useState<number | null>(null);
  const departureDate = params.get('departureDate');

  // Handle change for departure flights
  const handleDepartureChange = (id: number) => {
    setSelectedDeparture((prev) => (prev === id ? null : id));
  };

  // Handle change for return flights
  const handleReturnChange = (id: number) => {
    setSelectedReturn((prev) => (prev === id ? null : id));
  };

  // Check if both a departure and return flight are selected
  const isContinueEnabled = selectedDeparture !== null && selectedReturn !== null;



  useEffect(() => {
    const fetchFlights = async () => {
      
      const originCode = params.get('origin');
      const destinationCode = params.get('destination');
      const departureDate = params.get('departureDate');
      const returnDate = params.get('returnDate');
      

      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('trips')
          .select(
            'id, flight_id(id, flight_number, airline_id(id, name)), departure, arrival, origin (id, name, code), destination (id, name, code), available_seats, passengers, price, economy_seats, premium_economy_seats, business_seats, first_seats'
          )
          .eq('origin', originCode)
          .eq('destination', destinationCode)
          .gte('departure', `${departureDate}T00:00:00`)
          .lte('departure', `${departureDate}T23:59:59`);

        if (error) {
          console.error("Error fetching flights:", error);
        } else {
          const mappedData = data.map((flight: any) => ({
            id: flight.id,
            airline: flight.flight_id.airline_id.name,
            flightNumber: flight.flight_id.flight_number,
            departureTime: getTimeFromDateTime(flight.departure), // Assuming time is in ISO format
            arrivalTime: getTimeFromDateTime(flight.arrival),
            duration: calculateDuration(flight.departure, flight.arrival), // You might need to calculate duration based on flight times
            origin: flight.origin.name,
            originCode: flight.origin.code,
            destination: flight.destination.name,
            destinationCode: flight.destination.code,
            price: flight.price,
            stops: 0, // Assuming no stops data in Supabase, you can calculate based on flight information
            availableSeats: flight.available_seats,
          }));

          setFlights(mappedData);
          setFilteredFlights(mappedData);
        }

        if(tripType == 'roundTrip'){
          const { data, error } = await supabase
          .from('trips')
          .select(
            'id, flight_id(id, flight_number, airline_id(id, name)), departure, arrival, origin (id, name), destination (id, name), available_seats, passengers, price, economy_seats, premium_economy_seats, business_seats, first_seats'
          )
          .eq('origin', destinationCode)
          .eq('destination', originCode)
          .gte('departure', `${returnDate}T00:00:00`)
          .lte('departure', `${returnDate}T23:59:59`);

        if (error) {
          console.error("Error fetching flights:", error);
        } else {
          const mappedData = data.map((flight:any) => ({
            id: flight.id,
            airline: flight.flight_id.airline_id.name,
            flightNumber: flight.flight_id.flight_number,
            departureTime: getTimeFromDateTime(flight.departure), // Assuming time is in ISO format
            arrivalTime: getTimeFromDateTime(flight.arrival),
            duration: calculateDuration(flight.departure, flight.arrival), // You might need to calculate duration based on flight times
            origin: flight.origin.name,
            destination: flight.destination.name,
            price: flight.price,
            stops: 0, // Assuming no stops data in Supabase, you can calculate based on flight information
            availableSeats: flight.available_seats,
          }));

          setReturnFlights(mappedData);
          setReturnFilteredFlights(mappedData);

        }}
        
      } catch (error) {
        console.error('Error fetching flights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [location.search]);


  // Get unique airlines for filter
  const airlines = [...new Set(flights.map(flight => flight.airline))];

  // Handle stop filter change
  const handleStopChange = (value: string) => {
    setSelectedStops(prev => 
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  // Handle airline filter change
  const handleAirlineChange = (value: string) => {
    setSelectedAirlines(prev => 
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const handleSelectFlight = (flight) =>{
    if(flight.id && passengers){
      navigate(`/booking?tripType=${tripType}&tripone=${flight.id}&passengers=${passengers}&cabinClass=${cabinClass}`)
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Flight Search Results</h1>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center mb-2 md:mb-0">
                <span className="font-semibold">{filteredFlights[0]?.originCode}</span>
                <ArrowRight size={18} className="mx-2" />
                <span className="font-semibold">{filteredFlights[0]?.destinationCode}</span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span>{departureDate}</span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span>{passengers}</span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span>{cabinClass}</span>
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
            {/* <div className="lg:w-1/4">
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
            </div> */}

            <div className="lg:w-3/4">
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

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                      <div className="h-10 bg-gray-200 rounded w-1/4 mt-4 ml-auto"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex'>
                <div className="space-y-4">
                  {filteredFlights.length > 0 ? (
                    filteredFlights.map((flight, index) => (
                      <motion.div
                        key={flight.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="overflow-hidden hover-scale">
                          <CardContent className="p-0">
                            <div className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                                    <Plane size={20} className="text-primary" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">{flight.airline}</h3>
                                    <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold">${flight.price}</p>
                                  <p className="text-sm text-muted-foreground">per passenger</p>
                                </div>
                              </div>

                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div className="flex items-center">
                                  <div className="text-right mr-3">
                                    <p className="text-lg font-semibold">{flight.departureTime}</p>
                                    <p className="text-sm text-muted-foreground">{flight.origin}</p>
                                  </div>
                                  <div className="relative mx-2">
                                    <div className="w-20 md:w-32 h-[2px] bg-gray-300"></div>
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
                                  </div>
                                  <div className="text-left ml-3">
                                    <p className="text-lg font-semibold">{flight.arrivalTime}</p>
                                    <p className="text-sm text-muted-foreground">{flight.destination}</p>
                                  </div>
                                </div>

                                <div className="flex items-center mt-4 md:mt-0">
                                  <div className="flex items-center mr-4">
                                    <Clock size={16} className="text-muted-foreground mr-1" />
                                    <span className="text-sm">{flight.duration}</span>
                                  </div>
                                  <div>
                                    <span className="text-sm text-muted-foreground">
                                      {flight.stops === 0 ? 'Non-stop' : `${flight.stops} ${flight.stops === 1 ? 'stop' : 'stops'}`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="border-t p-4">
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                  {flight.availableSeats} seats available
                                </p>
                                {tripType == 'roundTrip' ? ( <Checkbox 
                            id={`departure-${flight.id}`} 
                            checked={selectedDeparture === flight.id}
                            onCheckedChange={() => handleDepartureChange(flight.id)}
                          />): (<Button onClick={() =>handleSelectFlight(flight)}>Select Flight</Button>)}
                                
                              
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-white rounded-lg shadow-sm border p-10 text-center">
                      <h2 className="text-lg font-semibold">No results found</h2>
                    </div>
                  )}
                </div>
               {tripType == 'roundTrip' && ( <div className="space-y-4">
                  {returnFilteredFlights.length > 0 ? (
                    returnFilteredFlights.map((flight, index) => (
                      <motion.div
                        key={flight.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="overflow-hidden hover-scale">
                          <CardContent className="p-0">
                            <div className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                                    <Plane size={20} className="text-primary" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">{flight.airline}</h3>
                                    <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold">${flight.price}</p>
                                  <p className="text-sm text-muted-foreground">per passenger</p>
                                </div>
                              </div>

                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div className="flex items-center">
                                  <div className="text-right mr-3">
                                    <p className="text-lg font-semibold">{flight.departureTime}</p>
                                    <p className="text-sm text-muted-foreground">{flight.origin}</p>
                                  </div>
                                  <div className="relative mx-2">
                                    <div className="w-20 md:w-32 h-[2px] bg-gray-300"></div>
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
                                  </div>
                                  <div className="text-left ml-3">
                                    <p className="text-lg font-semibold">{flight.arrivalTime}</p>
                                    <p className="text-sm text-muted-foreground">{flight.destination}</p>
                                  </div>
                                </div>

                                <div className="flex items-center mt-4 md:mt-0">
                                  <div className="flex items-center mr-4">
                                    <Clock size={16} className="text-muted-foreground mr-1" />
                                    <span className="text-sm">{flight.duration}</span>
                                  </div>
                                  <div>
                                    <span className="text-sm text-muted-foreground">
                                      {flight.stops === 0 ? 'Non-stop' : `${flight.stops} ${flight.stops === 1 ? 'stop' : 'stops'}`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="border-t p-4">
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                  {flight.availableSeats} seats available
                                </p>
                                {tripType == 'roundTrip' ? ( <Checkbox 
                            id={`departure-${flight.id}`} 
                            checked={selectedReturn === flight.id}
                            onCheckedChange={() => handleReturnChange(flight.id)}
                          />): (<Button onClick={() =>handleSelectFlight(flight)}>Select Flight</Button>)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-white rounded-lg shadow-sm border p-10 text-center">
                      <h2 className="text-lg font-semibold">No return flights found</h2>
                    </div>
                  )}

                </div>)}
                
                </div>
              )}
             {tripType == 'roundTrip' && ( <div className='flex justify-end mt-4'><Button
                variant="outline"
                onClick={() => navigate(`/booking?tripType=${tripType}&tripone=${selectedDeparture}&triptwo=${selectedReturn}&passengers=${passengers}&cabinClass=${cabinClass}`)}
                size="sm"
                disabled={!isContinueEnabled}
          
              >
                Continue
              </Button></div>)}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;
