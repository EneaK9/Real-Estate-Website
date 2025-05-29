# Real Estate Platform - Backend API

The backend API for the Real Estate Management Platform built with Node.js, Express, and PostgreSQL with Prisma ORM.

## 🚀 Features

- **RESTful API**: Complete API for real estate property management
- **Authentication**: JWT-based authentication with Cognito integration
- **Database**: PostgreSQL with Prisma ORM for type-safe database access
- **Geospatial Features**: PostGIS integration for location-based queries
- **File Storage**: AWS S3 integration for property photos
- **API Documentation**: Swagger UI documentation
- **Deployment**: Easy deployment to AWS EC2

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express 5
- **ORM**: Prisma with PostgreSQL
- **Geospatial**: PostGIS extension
- **Authentication**: JWT with AWS Cognito
- **File Storage**: AWS S3
- **Documentation**: Swagger UI
- **Process Manager**: PM2 for production
- **Logging**: Morgan for HTTP request logging

## 📁 Project Structure

```
server/
├── prisma/                # Prisma ORM configuration and migrations
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # Database migrations
│   └── seed.ts            # Seed data for development
├── src/
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Express middleware
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   └── index.ts           # Application entry point
├── .env                   # Environment variables
└── ecosystem.config.js    # PM2 configuration
```

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

- **Properties**: Real estate listings with details and photos
- **Managers**: Property owners/managers
- **Tenants**: Users looking for properties
- **Applications**: Rental applications
- **Leases**: Contracts between managers and tenants
- **Payments**: Rent payment records
- **Locations**: Property addresses with geospatial data (using PostGIS)

## 🚦 Getting Started

### Prerequisites

- Node.js (v20 or later)
- PostgreSQL (v14 or later) with PostGIS extension
- AWS account (for S3)

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```
   PORT=3002
   NODE_ENV=development
   DATABASE_URL="postgresql://username:password@localhost:5432/realestate?schema=public"
   S3_BUCKET_NAME="your-s3-bucket-name"
   AWS_REGION="your-aws-region"
   ```

3. Set up the database:

   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run migrations
   npx prisma migrate dev

   # Seed the database with test data
   npm run seed
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. The API will be available at [http://localhost:3002](http://localhost:3002)

6. Access the API documentation at [http://localhost:3002/api-docs](http://localhost:3002/api-docs)

## 🔑 API Endpoints

The API provides the following main endpoints:

- **Authentication**
  - `POST /api/auth/login`
  - `POST /api/auth/register`
- **Properties**
  - `GET /api/properties` - List all properties
  - `GET /api/properties/:id` - Get property details
  - `POST /api/properties` - Create a property
  - `PUT /api/properties/:id` - Update a property
  - `DELETE /api/properties/:id` - Delete a property
  - `GET /api/properties/search` - Search properties with filters
- **Applications**
  - `POST /api/applications` - Submit application
  - `GET /api/applications` - List applications
  - `PUT /api/applications/:id` - Update application status
- **Leases**
  - `POST /api/leases` - Create a lease
  - `GET /api/leases` - List leases
  - `GET /api/leases/:id` - Get lease details
- **Payments**
  - `POST /api/payments` - Record a payment
  - `GET /api/payments` - List payments
- **Users**
  - `GET /api/managers/:id` - Get manager details
  - `GET /api/tenants/:id` - Get tenant details

For complete API documentation, refer to the Swagger documentation at `/api-docs`.

## 🌐 Deployment

### AWS EC2 Deployment

1. Launch an EC2 instance with Amazon Linux 2
2. Install Node.js, Git, and PM2
3. Clone the repository and install dependencies
4. Configure environment variables
5. Start the application with PM2

Detailed EC2 setup instructions are available in `/aws-ec2-instructions.md`.

## 🔧 Development

### Database Migrations

To create a new migration after modifying the Prisma schema:

```bash
npx prisma migrate dev --name migration-name
```

### Generating Prisma Client

After modifying the Prisma schema:

```bash
npm run prisma:generate
```

### Building for Production

```bash
npm run build
```

### Running in Production

```bash
npm run start
```

### Using PM2

```bash
# Install PM2 globally
npm install pm2 -g

# Start with PM2
pm2 start ecosystem.config.js
```

## 📚 Learn More

To learn more about the technologies used:

- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/docs/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [PostGIS](https://postgis.net/documentation/)
- [AWS S3](https://docs.aws.amazon.com/s3/)
