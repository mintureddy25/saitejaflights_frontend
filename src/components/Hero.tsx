
import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-blue-100/50 blur-3xl"></div>
        <div className="absolute bottom-40 left-[15%] w-96 h-96 rounded-full bg-blue-50/30 blur-3xl"></div>
        <div className="absolute top-40 left-[30%] w-32 h-32 rounded-full bg-sky-100/40 blur-2xl"></div>
        <div className="absolute bottom-[20%] right-[25%] w-52 h-52 rounded-full bg-blue-100/30 blur-2xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 z-10 relative">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-4 tracking-wide">
            THE SMARTER WAY TO TRAVEL
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-balance">
            Travel the World with Elegance and Simplicity
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Discover seamless flight booking with our elegant, intuitive platform. 
            Find the best flights, at the best prices with just a few clicks.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
