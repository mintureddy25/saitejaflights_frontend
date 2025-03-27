
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, Smartphone, Globe } from 'lucide-react';

const features = [
  {
    icon: <Search size={24} />,
    title: 'Smart Search',
    description: 'Find the perfect flight with our powerful and intuitive search technology.'
  },
  {
    icon: <Smartphone size={24} />,
    title: 'Mobile Friendly',
    description: 'Book and manage your flights on the go with our fully responsive design.'
  },
  {
    icon: <Shield size={24} />,
    title: 'Secure Booking',
    description: 'Your personal and payment information is always protected with us.'
  },
  {
    icon: <Globe size={24} />,
    title: 'Global Coverage',
    description: 'Access flights to and from virtually anywhere in the world.'
  }
];

const Features = () => {
  return (
    <section className="py-20 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Why Choose SaiTeja</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We combine elegant design with powerful functionality to create the best flight booking experience.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="text-center"
          >
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
