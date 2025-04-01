// BookingDetails.jsx
import { getBooking } from '@/services/api/bookingsApi';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Mail, 
  Phone, 
  CreditCard, 
  Tag, 
  Users,
  ArrowLeftRight,
  CheckCircle,
  AlertTriangle,
  PlaneTakeoffIcon,
  PlaneLandingIcon
} from 'lucide-react';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';

const BookingDetails = () => {
  const { booking_id } = useParams(); // Use the booking_id from the URL params
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the details of a specific booking
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await getBooking(Number(booking_id));
        setBooking(response.booking);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError('We couldn\'t retrieve your booking details. Please try again later.');
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [booking_id]);

  // Function to format date and time
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Function to get status icon
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 mr-2" />;
      case 'cancelled':
        return <AlertTriangle className="w-5 h-5 mr-2" />;
      default:
        return <Tag className="w-5 h-5 mr-2" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-gray-700">Booking not found</p>
        </div>
      </div>
    );
  }

  return (
<>
<NavBar/>
    <div className="container mt-8 mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex justify-between items-center flex-wrap">
            <div>
              <h1 className="text-2xl font-bold mb-1">Booking #{booking.id}</h1>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span className="text-sm text-blue-100">
                  Created: {formatDateTime(booking.created_at)}
                </span>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${getStatusColor(booking.status)}`}>
              {getStatusIcon(booking.status)}
              {booking.status}
            </div>
          </div>
        </div>

        {/* Main Flight Info */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Flight Information</h2>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <PlaneTakeoffIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Flight</p>
                <p className="font-medium text-gray-800">{booking.trip_id.flight_id.airline_id.name} {booking.trip_id.flight_id.flight_number}</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-start mb-4">
                  <div className="mt-1 mr-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <PlaneTakeoffIcon className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Departure</p>
                    <p className="font-medium">{formatDateTime(booking.trip_id.departure)}</p>
                    <p className="text-sm text-gray-600">
                      {booking.trip_id.origin?.name || 'Origin Airport'} ({booking.trip_id.origin?.code || 'CODE'})
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-start">
                  <div className="mt-1 mr-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <PlaneLandingIcon className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Arrival</p>
                    <p className="font-medium">{formatDateTime(booking.trip_id.arrival)}</p>
                    <p className="text-sm text-gray-600">
                      {booking.trip_id.destination?.name || 'Destination Airport'} ({booking.trip_id.destination?.code || 'CODE'})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Return Trip if available */}
          {booking.return_trip_id && (
            <div className="mt-6">
              <div className="flex items-center mb-4">
                <ArrowLeftRight className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Return Flight</h3>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <PlaneTakeoffIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Flight</p>
                    <p className="font-medium text-gray-800">{booking.return_trip_id.flight_id.airline_id.name} {booking.return_trip_id.flight_id.flight_number}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-start mb-4">
                      <div className="mt-1 mr-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <PlaneTakeoffIcon className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Departure</p>
                        <p className="font-medium">{formatDateTime(booking.return_trip_id.departure)}</p>
                        <p className="text-sm text-gray-600">
                          {booking.return_trip_id.origin?.name || 'Origin Airport'} ({booking.return_trip_id.origin?.code || 'CODE'})
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <div className="mt-1 mr-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <PlaneLandingIcon className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Arrival</p>
                        <p className="font-medium">{formatDateTime(booking.return_trip_id.arrival)}</p>
                        <p className="text-sm text-gray-600">
                          {booking.return_trip_id.destination?.name || 'Destination Airport'} ({booking.return_trip_id.destination?.code || 'CODE'})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Booking Details */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <DollarSign className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium text-gray-800">${booking.price}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CreditCard className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium text-gray-800">{booking.payment_mode || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Tag className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Booking Type</p>
                <p className="font-medium text-gray-800">{booking.booking_type || 'Standard'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-medium text-gray-800">{formatDateTime(booking.created_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <Mail className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{booking.email || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">{booking.phone || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Passengers */}
        {booking.passengers && booking.passengers.length > 0 && (
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Passengers</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {booking.passengers.map((passenger) => (
                <div key={passenger.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="font-medium text-gray-800 mb-2">{passenger.first_name} {passenger.last_name}</p>
                  {passenger.dob && (
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>DOB: {new Date(passenger.dob).toLocaleDateString()}</span>
                    </div>
                  )}
                  {passenger.gender && (
                    <div className="text-sm text-gray-600">
                      Gender: {passenger.gender}
                    </div>
                  )}
                  {passenger.email && (
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{passenger.email}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    <Footer /></>
  );
};

export default BookingDetails;