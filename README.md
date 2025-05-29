#  NESTORIA - Real Estate Management Platform

A full-stack real estate management application built with Next.js, Node.js, Express, and PostgreSQL. This platform connects property managers with potential tenants, handling property listings, applications, leases, and payments.

## 🏗️ Project Structure

The project is organized as a monorepo with two main directories:

- **`/client`**: Next.js frontend application
- **`/server`**: Node.js/Express backend API

## ✨ Features

- **Property Management**: List, view, and manage real estate properties
- **User Authentication**: Separate roles for property managers and tenants
- **Property Search**: Advanced filtering and search capabilities
- **Applications**: Apply for properties with application tracking
- **Leases**: Digital lease management
- **Payments**: Track rent payments and payment status
- **Favorites**: Save properties for later viewing
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Technologies

### Frontend (Client)

- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Authentication**: AWS Amplify
- **Maps**: Mapbox GL
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI

### Backend (Server)

- **Runtime**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **GIS Support**: PostGIS for location-based features
- **File Storage**: AWS S3
- **API Documentation**: Swagger
- **Deployment**: AWS EC2

## 💻 Getting Started

### Prerequisites

- Node.js (v20 or later)
- PostgreSQL (with PostGIS extension)
- AWS account (for S3 and Amplify)

### Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/EneaK9/Real-Estate-Website.git
   cd real-estate-prod
   ```

2. **Set up the backend**

   ```bash
   cd server
   npm install

   # Configure the environment variables
   cp .env.example .env
   # Edit .env with your database credentials and AWS settings

   # Run database migrations and seed data
   npm run prisma:generate
   npm run seed

   # Start the development server
   npm run dev
   ```

3. **Set up the frontend**

   ```bash
   cd ../client
   npm install

   # Configure the environment variables
   cp .env.example .env
   # Edit .env with your API endpoint and AWS Amplify settings

   # Start the development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3002
   - API Documentation: http://localhost:3002/api-docs

## 🌐 Deployment

### Backend Deployment (AWS EC2)

The backend can be deployed to AWS EC2 following these steps:

1. Launch an EC2 instance with Amazon Linux 2
2. Install Node.js, Git, and PM2
3. Clone the repository and install dependencies
4. Configure environment variables
5. Start the application with PM2

Detailed EC2 setup instructions are available in `/server/aws-ec2-instructions.md`.

### Frontend Deployment (Vercel)

The Next.js frontend can be easily deployed on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

- **Properties**: Listings with details, amenities, and location
- **Managers**: Property owners/managers
- **Tenants**: Users looking for properties
- **Applications**: Rental applications
- **Leases**: Contracts between managers and tenants
- **Payments**: Rent payment records
- **Locations**: Property addresses with geospatial data

## 🛠️ Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

