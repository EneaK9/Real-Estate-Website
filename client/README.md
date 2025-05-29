# Real Estate Platform - Frontend

The frontend application for the Real Estate Management Platform built with Next.js 15 and React 19.

## 🚀 Features

- **Modern UI**: Sleek, responsive interface built with Tailwind CSS
- **Property Search**: Advanced filtering by type, price, amenities, and location
- **Property Details**: Comprehensive property information with photo galleries
- **Interactive Maps**: Location visualization with Mapbox integration
- **User Authentication**: Secure login with AWS Amplify
- **Application Management**: Apply for properties and track application status
- **Favorites**: Save and manage favorite properties
- **Tenant Dashboard**: View applications, leases, and payment history
- **Manager Dashboard**: Manage properties, applications, and leases

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: Redux Toolkit
- **Authentication**: AWS Amplify
- **Form Management**: React Hook Form with Zod validation
- **Maps**: Mapbox GL JS
- **File Upload**: FilePond
- **Notifications**: Sonner toast notifications
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📁 Project Structure

```
client/
├── public/          # Static assets
├── src/
│   ├── app/         # Next.js App Router pages
│   ├── components/  # UI components
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utility functions and shared code
│   ├── store/       # Redux store configuration
│   ├── types/       # TypeScript type definitions
│   └── utils/       # Helper functions
├── .env             # Environment variables
└── tailwind.config.ts # Tailwind CSS configuration
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm or yarn

### Installation

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:3002
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
   NEXT_PUBLIC_AWS_REGION=your_aws_region
   NEXT_PUBLIC_AWS_USER_POOL_ID=your_user_pool_id
   NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID=your_client_id
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Development

### Code Quality

- Use ESLint for code linting:
  ```bash
  npm run lint
  ```

### Building for Production

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```

## 🔄 API Integration

The frontend connects to the backend API at `NEXT_PUBLIC_API_URL`. Make sure the backend server is running before using the application.

## 🌐 Deployment

### Deploying to Vercel

1. Push your code to a Git repository
2. Import the project into Vercel
3. Set up environment variables
4. Deploy

### Environment Variables for Production

Ensure these variables are configured in your production environment:

- `NEXT_PUBLIC_API_URL`: Your production API URL
- `NEXT_PUBLIC_MAPBOX_TOKEN`: Mapbox GL JS token
- `NEXT_PUBLIC_AWS_REGION`: AWS region
- `NEXT_PUBLIC_AWS_USER_POOL_ID`: Cognito User Pool ID
- `NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID`: Cognito App Client ID

## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [AWS Amplify](https://docs.amplify.aws/)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
