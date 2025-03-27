
import React from 'react';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import FlightSearch from '../components/FlightSearch';
import FeaturedDestinations from '../components/FeaturedDestinations';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main>
        <Hero />
        <FlightSearch />
        <FeaturedDestinations />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
