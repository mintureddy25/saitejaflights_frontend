# Flight Booking System

An online flight booking platform available at [flights.saiteja.online](https://flights.saiteja.online)

## Overview

This application allows users to search for flights, create accounts, make bookings, and receive confirmation emails. The system is built with a comprehensive database design to handle passengers, bookings, flights, trips, airports, and airlines information.

## Live Demo

The application is deployed on Vercel and accessible at:
https://flights.saiteja.online

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mintureddy25/saitejaflights_frontend
   cd flight-booking-system
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy the `.env.example` file to create a new `.env` file
   ```bash
   cp .env.example .env
   ```
   - Fill in the required environment variables with your Supabase credentials and other configuration settings

### Database Setup

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Set up the database tables according to the schema shown in the database design image below:

![Database Schema](https://toleram.s3.ap-south-1.amazonaws.com/toleram/supabase-schema-jzrisvwferxhpijyiqcr.png)

## Features

- User authentication (login/signup)
- Flight search with filters
- Booking management
- Email confirmation system
- User dashboard to view bookings

## Usage

1. Register for an account or log in
2. Search for flights by selecting origin, destination, dates, and passenger count
3. Select a flight from the search results
4. Complete the booking process by providing passenger details and payment information
5. Receive a confirmation email once the booking is completed
6. View your bookings in the user dashboard

## Technical Stack

- Frontend: Vite + React
- Backend: Supabase Functions
- Database: PostgreSQL (via Supabase)
- Authentication: Supabase Auth
- Hosting: Vercel

## Development

To run the project locally:

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:5173 (default Vite port)

## Deployment

This project is configured for deployment on Vercel. To deploy your own instance:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure the environment variables
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[License information]