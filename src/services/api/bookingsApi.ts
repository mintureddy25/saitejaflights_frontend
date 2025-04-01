import { instance } from './baseApi';

interface Passenger {
    firstName: string;
    lastName : string;
    dateOfBirth: string;
    email?: string;
    gender: string

  }
  
  interface BookingData {
    trip_id: number;
    return_trip_id?: number;
    status?: 'confirmed' | 'pending' | 'cancelled';
    email: string;
    phone: string;
    price: number;
    payment_mode: string;
    passengers: Passenger[];
    no_of_passengers: number;
  }

export const addBooking = async (bookingData : BookingData) => {
  try {
    const response = await instance.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};


export const getBookings = async () => {
    try {
      const response = await instance.get('/bookings');
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };


export const getBooking = async (id: number) => {
    try {
      const response = await instance.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };

  export const cancelBooking = async (id: number) => {
    try {
      const response = await instance.patch(`/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };
