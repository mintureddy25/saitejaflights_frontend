
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, Calendar, Clock, CreditCard, User, Check, ChevronRight, Loader2, Phone } from "lucide-react";
import { supabase } from "@/services/supabase";
import { calculateDuration, getFormattedDate, getTimeFromDateTime } from "@/lib/utils";
import { addBooking } from "@/services/api/bookingsApi";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

// Mock flight data - in a real app this would come from a previous selection or API
const flightData = {
  flightNumber: "BA2490",
  departure: {
    airport: "JFK",
    city: "New York",
    time: "08:45",
    date: "12 June 2023",
    terminal: "Terminal 4"
  },
  arrival: {
    airport: "LHR",
    city: "London",
    time: "21:05",
    date: "12 June 2023",
    terminal: "Terminal 5"
  },
  duration: "7h 20m",
  price: 549.99,
  airline: "British Airways",
  class: "Economy"
};

interface Passenger {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

interface BookingInfo {
    email: string;
    phone: string
}
const BookingConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<number>(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [trips, setTrips] = useState<any>();
  const params = new URLSearchParams(location.search);
  const noOfPassengers = params.get('passengers');
  const bookingType = params.get('cabinClass');
  const [bookingDetails, setBookingDetails] = useState<BookingInfo >({email:"", phone:""});
  const [bookingId, setBookingId] = useState<number>();



  
  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      firstName: "",
      lastName: "",
      email: "",
     
      dateOfBirth: "",
      gender: "Male"
    }
  ]);
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: ""
  });

  const handleAddPassenger = () => {
    console.log("pass", noOfPassengers, passengers.length)
    if (Number(noOfPassengers) <= passengers.length ){
        toast({
            title: "Not allowed",
            description: `You can max ${noOfPassengers}`,
            variant: "destructive"
          });
        return
    }
    setPassengers([
      ...passengers,
      {
        firstName: "",
        lastName: "",
        email: "",
        dateOfBirth: "",
        gender: "Male"
      }
    ]);
  };
 

    useEffect(() => {
      const fetchFlights = async () => {
        
        const tripone = params.get('tripone');
        const triptwo = params.get('triptwo');
        
        let tripsIds =[];
        if(tripone){
            tripsIds.push(tripone);
        }
        if(triptwo){
            tripsIds.push(triptwo);
        }
        
  
        setLoading(true);
  
        try {
          const { data, error } = await supabase
            .from('trips')
            .select(
              'id, flight_id(id, flight_number, airline_id(id, name)), departure, arrival, origin (id, name , code), destination (id, name, code), available_seats, passengers, price, economy_seats, premium_economy_seats, business_seats, first_seats'
            )
            .in('id', [tripsIds]);
  
          if (error) {
            console.error("Error fetching flights:", error);
          } else {
            setTrips(data);
            
          }
        } catch (error) {
          console.error('Error fetching flights:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchFlights();
    }, [location.search]);

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    setPassengers(updatedPassengers);
  };

  const handlePaymentInfoChange = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo({
      ...paymentInfo,
      [field]: value
    });
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 16);
    handlePaymentInfoChange("cardNumber", formatCardNumber(value));
  };
  
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    handlePaymentInfoChange("expiryDate", value);
  };

  const handleContinue = () => {
    // Validate passenger info
    const isPassengerInfoComplete = passengers.every(passenger => 
      passenger.firstName && 
      passenger.lastName &&
      passenger.dateOfBirth
    );
    //console.log("bool", bookingDetails.email, bookingDetails.phone)
    
    if (!isPassengerInfoComplete || !bookingDetails.email || !bookingDetails.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all passenger details",
        variant: "destructive"
      });
      return;
    }
    
    setStep(2);
    
    // Smoothly scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });


  };

  const handleBookingDetailsChange = (field, value) => {
  setBookingDetails((prevState) => ({
    ...prevState,
    [field]: value, // dynamically update the field (email or phone)
  }));
};


  const handleConfirmPayment = async () => {
  
    
    if (!paymentInfo.cardNumber || !paymentInfo.cardHolder || !paymentInfo.expiryDate || !paymentInfo.cvv) {
      toast({
        title: "Missing payment information",
        description: "Please fill in all payment details",
        variant: "destructive"
      });
      return;

      
    }
    const payload = {
      trip_id: trips[0].id,
      return_trip_id: trips[1]?.id,
      email: bookingDetails.email,
      phone: bookingDetails.phone,
      price: priceBreakdown.total,
      no_of_passengers: passengers.length,
      passengers,
      payment_mode: 'card',
      booking_type: bookingType

    };
    
    try {
     const responseData = await addBooking(payload);
     setBookingId(responseData.newBooking.id);


    setIsProcessingPayment(true);
     toast({
      title: "Booking confirmed!",
      description: "Your booking has been successfully processed",
    });

    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    } catch (error) {
      console.error('Error during booking:', error);
    }
    
    

    
    
    
  };

  const calculateTotalPrice = () => {
    if (trips && trips.length > 0) {
      // Sum up the prices from each trip
      const basePrice = trips.reduce((total, trip) => total + trip.price, 0);
  
      const tax = basePrice * 0.08; // 8% tax
      const serviceFee = 24.99;
  
      return {
        basePrice: basePrice * passengers.length, // Base price for all passengers
        tax,
        serviceFee,
        total: (basePrice * passengers.length) + tax + serviceFee, // Total price
      };
    } else {
      return {
        error: "No trips available"
      };
    }
  };
  

  const priceBreakdown = calculateTotalPrice();

  return (
    <><NavBar/>
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="w-full max-w-md">
            <div className="relative">
              <div className="overflow-hidden h-2 mb-6 flex rounded bg-gray-200">
                <div 
                  className="transition-all ease-out duration-500 h-full bg-booking-accent rounded" 
                  style={{ width: `${step === 3 ? '100' : step === 2 ? '66' : '33'}%` }}
                ></div>
              </div>
              <div className="flex justify-between">
                <div className={`flex flex-col items-center ${step >= 1 ? 'text-booking-accent' : 'text-gray-400'}`}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 ${step >= 1 ? 'bg-green text-white' : 'bg-gray-200'}`}>
                    <User size={20} />
                  </div>
                  <span className="text-sm font-medium">Passengers</span>
                </div>
                <div className={`flex flex-col items-center ${step >= 2 ? 'text-booking-accent' : 'text-gray-400'}`}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 ${step >= 2 ? 'bg-green text-white' : 'bg-gray-200'}`}>
                    <CreditCard size={20} />
                  </div>
                  <span className="text-sm font-medium">Payment</span>
                </div>
                <div className={`flex flex-col items-center ${step >= 3 ? 'text-booking-accent' : 'text-gray-400'}`}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 ${step >= 3 ? 'bg-green text-white' : 'bg-gray-200'}`}>
                    <Check size={20} />
                  </div>
                  <span className="text-sm font-medium">Confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Summary */}
        {trips && trips.length > 0 && trips.map((trip, index) => (
  <Card key={index} className="mb-8 overflow-hidden booking-glass animate-slide-in">
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6">
      <h2 className="text-white text-xl sm:text-2xl font-semibold">Flight Summary</h2>
      <div className="flex items-center text-blue-100 mt-1">
        <Plane size={16} className="mr-1" />
        <span className="text-sm">{trip.flight_id.flight_number} • {trip.flight_id.airline_id.name}</span>
      </div>
    </div>
    <CardContent className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between">
        <div className="flex-1 mb-4 sm:mb-0">
          <div className="text-sm text-gray-500 mb-1">DEPARTURE</div>
          <div className="flex items-start">
            <div className="text-3xl font-bold text-gray-900">{trip.origin.code}</div>
            <div className="ml-2 flex flex-col">
              <span className="text-xs text-gray-500">{trip.origin.name}</span>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <Clock size={14} className="text-gray-500 mr-1" />
            <span className="text-base font-medium">
              {trip.departure ? getTimeFromDateTime(trip.departure) : ''}
            </span>
            <span className="mx-2 text-gray-400">•</span>
            <Calendar size={14} className="text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">
              {trip.departure ? getFormattedDate(trip.departure) : ''}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-2">
          <div className="text-xs font-medium text-gray-500 mb-2">DURATION</div>
          <div className="w-24 h-px bg-gray-300 relative my-1">
            <div className="absolute -top-1.5 left-0 w-3 h-3 rounded-full border-2 border-blue-600 bg-white"></div>
            <div className="absolute -top-1.5 right-0 w-3 h-3 rounded-full border-2 border-blue-600 bg-white"></div>
          </div>
          <div className="text-xs font-medium text-gray-700 mt-2">
            {trip.arrival && trip.departure && calculateDuration(trip.departure, trip.arrival)}
          </div>
        </div>

        <div className="flex-1 text-right">
          <div className="text-sm text-gray-500 mb-1">ARRIVAL</div>
          <div className="flex items-start justify-end">
            <div className="mr-2 flex flex-col items-end">
              <span className="text-xs text-gray-500">{trip.destination.name}</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{trip.destination.code}</div>
          </div>
          <div className="flex items-center justify-end mt-2">
            <Clock size={14} className="text-gray-500 mr-1" />
            <span className="text-base font-medium">
              {trip.arrival ? getTimeFromDateTime(trip.arrival) : ''}
            </span>
            <span className="mx-2 text-gray-400">•</span>
            <Calendar size={14} className="text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">
              {trip.arrival ? getFormattedDate(trip.arrival) : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <div className="flight-detail-pill">
          <span>{flightData.class}</span>
        </div>
        <div className="flight-detail-pill">
          <span>Non-stop</span>
        </div>
      </div>
    </CardContent>
  </Card>
))}


        {step === 1 && (
        <>
      <div className="space-y-6 animate-slide-in">
  <Card className="booking-glass">
    <CardContent className="p-6">
      <h2 className="text-xl font-semibold mb-4">Booking details will be sent to</h2>
      <Separator className="mb-6" />
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Enter details</h3>
        
        {/* Flex container for email and phone inputs */}
        <div className="flex space-x-6">
          {/* Email input */}
          <div className="space-y-2 w-full">
            <Label htmlFor={`email`}>Email</Label>
            <Input
              id={`email`}
              type="email"
              value={bookingDetails.email}
              onChange={(e) => handleBookingDetailsChange("email", e.target.value)}
              placeholder="email"
              className="transition-all-200"
            />
          </div>

          {/* Phone input */}
          <div className="space-y-2 w-full">
            <Label htmlFor={`phone`}>Phone Number</Label>
            <Input
              id={`phone`}
              type="tel"
              value={bookingDetails.phone}
              onChange={(e) => handleBookingDetailsChange("phone", e.target.value)}
              placeholder="Phone number"
              className="transition-all-200"
            />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</div>

            
          <div className="space-y-6 animate-slide-in">
            <Card className="booking-glass">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>
                <Separator className="mb-6" />
                {passengers.map((passenger, index) => (
  <div key={index} className="mb-8">
    <h3 className="text-sm font-medium text-gray-500 mb-4">
      PASSENGER {index + 1}
    </h3>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div className="space-y-2">
        <Label htmlFor={`firstName-${index}`}>First Name</Label>
        <Input
          id={`firstName-${index}`}
          value={passenger.firstName}
          onChange={(e) => handlePassengerChange(index, "firstName", e.target.value)}
          placeholder="First name as on ID"
          className="transition-all-200"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`lastName-${index}`}>Last Name</Label>
        <Input
          id={`lastName-${index}`}
          value={passenger.lastName}
          onChange={(e) => handlePassengerChange(index, "lastName", e.target.value)}
          placeholder="Last name as on ID"
          className="transition-all-200"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`email-${index}`}>Email</Label>
        <Input
          id={`email-${index}`}
          type="email"
          value={passenger.email}
          onChange={(e) => handlePassengerChange(index, "email", e.target.value)}
          placeholder="Optional"
          className="transition-all-200"
        />
      </div>
      
      {/* Replaced Phone Number and Passport Number with Gender */}
      <div className="space-y-2">
        <Label htmlFor={`gender-${index}`}>Gender</Label>
        <select
                  className="w-full pl-10 h-12 rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={passenger.gender}
                  onChange={(e) => handlePassengerChange(index, "gender",e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Trans">Trans</option>
                  
                </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`dob-${index}`}>Date of Birth</Label>
        <Input
          id={`dob-${index}`}
          type="date"
          value={passenger.dateOfBirth}
          onChange={(e) => handlePassengerChange(index, "dateOfBirth", e.target.value)}
          className="transition-all-200"
        />
      </div>
    </div>
    
    {index < passengers.length - 1 && (
      <Separator className="my-6" />
    )}
  </div>
))}

             

                
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleAddPassenger}
                  className="mt-4 w-full sm:w-auto"
                >
                  Add Another Passenger
                </Button>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleContinue}
                className="px-8 py-6 text-base bg-blue-700 hover:bg-blue-700 transition-all-200"
              >
                Continue to Payment
                <ChevronRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
          </>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-slide-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <Card className="booking-glass">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                    <Separator className="mb-6" />
                    
                    <Tabs defaultValue="card" className="w-full">
                      <TabsList className="mb-6">
                        <TabsTrigger value="card" className="flex-1">Credit Card</TabsTrigger>
                        {/* <TabsTrigger value="paypal" className="flex-1">PayPal</TabsTrigger> */}
                      </TabsList>
                      
                      <TabsContent value="card" className="mt-0">
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <div className="relative">
                              <Input
                                id="cardNumber"
                                value={paymentInfo.cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="1234 5678 9012 3456"
                                className="transition-all-200 pl-10"
                                maxLength={19}
                              />
                              <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cardHolder">Cardholder Name</Label>
                            <Input
                              id="cardHolder"
                              value={paymentInfo.cardHolder}
                              onChange={(e) => handlePaymentInfoChange("cardHolder", e.target.value)}
                              placeholder="Name as it appears on the card"
                              className="transition-all-200"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiryDate">Expiry Date</Label>
                              <Input
                                id="expiryDate"
                                value={paymentInfo.expiryDate}
                                onChange={handleExpiryDateChange}
                                placeholder="MM/YY"
                                className="transition-all-200"
                                maxLength={5}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                type="password"
                                value={paymentInfo.cvv}
                                onChange={(e) => handlePaymentInfoChange("cvv", e.target.value.substring(0, 3))}
                                placeholder="123"
                                className="transition-all-200"
                                maxLength={3}
                              />
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="paypal">
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="text-2xl font-bold text-[#003087] mb-4">Pay<span className="text-[#009cde]">Pal</span></div>
                          <p className="text-gray-600 mb-6 text-center">Click the button below to log in to your PayPal account</p>
                          <Button variant="outline" className="w-full sm:w-auto bg-[#009cde] text-white hover:bg-[#008cc3]">
                            Continue with PayPal
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-4">
                <Card className="booking-glass">
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-4">Price Summary</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base fare ({passengers.length} {passengers.length > 1 ? 'passengers' : 'passenger'})</span>
                        <span>${priceBreakdown.basePrice.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxes & fees</span>
                        <span>${priceBreakdown.tax.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service fee</span>
                        <span>${priceBreakdown.serviceFee.toFixed(2)}</span>
                      </div>
                      
                      <Separator className="my-3" />
                      
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span className="text-booking-accent">${priceBreakdown.total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleConfirmPayment}
                      disabled={isProcessingPayment}
                      className="w-full mt-6 bg-blue-700 hover:bg-blue-700 py-6 text-base transition-all-200"
                    >
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        "Confirm and Pay"
                      )}
                    </Button>
                    
                    <p className="text-xs text-gray-500 text-center mt-4">
                      By clicking "Confirm and Pay", you agree to our terms and conditions and privacy policy
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-slide-in">
            <Card className="booking-glass">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6">Your booking has been successfully completed.</p>
                
                <div className="bg-gray-50 p-6 rounded-lg mb-6 inline-block">
                  <div className="text-sm text-gray-500 mb-1">BOOKING REFERENCE</div>
                  <div className="text-2xl font-mono font-bold tracking-wider">{bookingId? bookingId: ''}</div>
                </div>
                
                <p className="text-gray-600 mb-8">
                  We've sent a confirmation email to {passengers[0].email} with all the details of your booking.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" className="px-8">
                    View Booking
                  </Button>
                  
                  {/* <Button className="px-8 bg:bg-blue-700 hover:bg-blue-700 transition-all-200">
                    Download E-Ticket
                  </Button> */}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
    <Footer/></>
  );
};

export default BookingConfirmation;
