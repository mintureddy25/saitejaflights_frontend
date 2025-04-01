// BookingsList.jsx
import { getBookings } from '@/services/api/bookingsApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlaneTakeoffIcon, Clock, Calendar, Ticket, AlertTriangle, CheckCircle } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';


const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const access_token = localStorage.getItem('access_token');

  useEffect(() => {
    // Fetch all bookings for the authenticated user
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getBookings();
        setBookings(response.bookings);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('We couldn\'t retrieve your bookings. Please try again later.');
        setLoading(false);
      }
    };

    fetchBookings();
  }, [access_token]);

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get status icon
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'pending':
        return <Clock className="w-4 h-4 mr-1" />;
      case 'cancelled':
        return <AlertTriangle className="w-4 h-4 mr-1" />;
      default:
        return <Ticket className="w-4 h-4 mr-1" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <><NavBar/>
    <div className="container mt-8 mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center mb-8">
        <PlaneTakeoffIcon className="w-8 h-8 text-blue-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">Your Bookings</h1>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      {bookings.length === 0 && !loading && !error ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-800 mb-2">No bookings found</h3>
          <p className="text-gray-600 mb-4">You haven't made any flight bookings yet.</p>
          <Link 
            to="/search" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlaneTakeoffIcon className="w-4 h-4 mr-2" />
            Search Flights
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div 
              key={booking.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-center flex-wrap">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <PlaneTakeoffIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Booking Reference</p>
                      <p className="text-lg font-semibold text-gray-800">#{booking.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 sm:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-5">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Trip ID</p>
                    <div className="flex items-center">
                      <Ticket className="w-4 h-4 text-gray-500 mr-2" />
                      <p className="text-gray-800">{booking.trip_id}</p>
                    </div>
                  </div>
                  {booking.return_trip_id && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Return Trip</p>
                      <div className="flex items-center">
                        <Ticket className="w-4 h-4 text-gray-500 mr-2" />
                        <p className="text-gray-800">{booking.return_trip_id}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <Link 
                  to={`/bookings/${booking.id}`}
                  className="block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors mt-2"
                >
                  View Booking Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default BookingsList;