// BookingsList.jsx
import { getBookings } from '@/services/api/bookingsApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all bookings for the authenticated user
    const fetchBookings = async () => {
      try {
        const response = await getBookings();
        setBookings(response.bookings);
        
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Error fetching bookings');
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <h1>Your Bookings</h1>
      {error && <p>{error}</p>}
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            <p>Booking ID: {booking.id}</p>
            <p>Trip id: {booking.trip_id}</p>
            <p>Status: {booking.status}</p>
            <Link to={`/bookings/${booking.id}`}>View Booking Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingsList;
