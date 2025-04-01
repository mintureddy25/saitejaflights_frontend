// BookingDetails.jsx
import { getBooking } from '@/services/api/bookingsApi';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BookingDetails = () => {
  const { booking_id } = useParams();  // Use the booking_id from the URL params
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the details of a specific booking
    const fetchBookingDetails = async () => {
      try {
        const response = await getBooking(Number(booking_id));
        setBooking(response.booking);
      
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError('Error fetching booking details');
      }
    };

    fetchBookingDetails();
  }, [booking_id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!booking) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Booking Details</h1>
      <p><strong>Booking ID:</strong> {booking.id}</p>
      <p><strong>Flight Number:</strong> {booking.trip_id.flight_id.flight_number}</p>
      <p><strong>Airline:</strong> {booking.trip_id.flight_id.airline_id.name}</p>
      <p><strong>Departure:</strong> {booking.trip_id.departure}</p>
      <p><strong>Arrival:</strong> {booking.trip_id.arrival}</p>
      <p><strong>Status:</strong> {booking.status}</p>
      <p><strong>Price:</strong> {booking.price}</p>
      <p><strong>Email:</strong> {booking.email}</p>
      <p><strong>Phone:</strong> {booking.phone}</p>
      <p><strong>Payment Mode:</strong> {booking.payment_mode}</p>
      <p><strong>Booking Type:</strong> {booking.booking_type}</p>

      {booking.return_trip_id && (
        <div>
          <h2>Return Trip</h2>
          <p><strong>Flight Number:</strong> {booking.return_trip_id.flight_id.flight_number}</p>
          <p><strong>Airline:</strong> {booking.return_trip_id.flight_id.airline_id.name}</p>
          <p><strong>Departure:</strong> {booking.return_trip_id.departure}</p>
          <p><strong>Arrival:</strong> {booking.return_trip_id.arrival}</p>
        </div>
      )}

      {booking.passengers && booking.passengers.length > 0 && (
        <div>
          <h2>Passengers</h2>
          {booking.passengers.map((passenger) => (
            <div key={passenger.id}>
              <p><strong>Name:</strong> {passenger.first_name} {passenger.last_name}</p>
              {/* <p><strong>Passport Number:</strong> {passenger.passport_number}</p> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingDetails;
