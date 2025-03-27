
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

type Destination = {
  id: number;
  name: string;
  image: string;
  price: string;
};

const destinations: Destination[] = [
  {
    id: 1,
    name: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop&q=80',
    price: '$399'
  },
  {
    id: 2,
    name: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&auto=format&fit=crop&q=80',
    price: '$699'
  },
  {
    id: 3,
    name: 'New York, USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop&q=80',
    price: '$349'
  },
  {
    id: 4,
    name: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80',
    price: '$549'
  }
];

const DestinationCard = ({ destination, index }: { destination: Destination, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="hover-scale"
    >
      <Card className="overflow-hidden bg-white border-none shadow-md">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={destination.image} 
            alt={destination.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-white font-semibold">{destination.name}</h3>
            <p className="text-white/90 text-sm">from <span className="font-bold">{destination.price}</span></p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const FeaturedDestinations = () => {
  return (
    <section className="py-20 container mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Popular Destinations</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our top flight destinations and plan your next adventure with our exclusive deals.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map((destination, index) => (
          <DestinationCard key={destination.id} destination={destination} index={index} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedDestinations;
