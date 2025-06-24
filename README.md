# GraphQL MSSQL Application

A full-stack application built with **Apollo Client**, **GraphQL**, **Express.js**, and **MSSQL** database integration. This application provides a complete CRUD interface for managing users, gsPublications, and orders with a modern React frontend.

## 🚀 Features

- **GraphQL API** with Apollo Server
- **MSSQL Database** integration with connection pooling
- **React Frontend** with Apollo Client
- **Full CRUD Operations** for Users, gsPublications, and Orders
- **Real-time Dashboard** with statistics
- **Responsive Design** with modern UI/UX
- **Transaction Support** for complex operations
- **Error Handling** and loading states

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js**
- **Apollo Server Express**
- **GraphQL**
- **MSSQL** (Microsoft SQL Server)
- **CORS** for cross-origin requests

### Frontend
- **React 18**
- **Apollo Client**
- **React Router**
- **Modern CSS** with responsive design

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Microsoft SQL Server** (Local instance or cloud)
- **SQL Server Management Studio** (optional, for database management)

## ⚙️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Database Setup

1. **Create a new database** in your MSSQL instance:
   ```sql
   CREATE DATABASE GraphQLApp;
   ```

2. **Run the database setup script**:
   - Open `server/setup-database.sql` in SQL Server Management Studio
   - Execute the script to create tables and insert sample data

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_SERVER=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=GraphQLApp

# Server Configuration
PORT=4000

# Environment
NODE_ENV=development
```

**Important**: Replace the database credentials with your actual MSSQL server details.

### 4. Run the Application

#### Option 1: Run Both Server and Client Together
```bash
# Start the GraphQL server
npm run dev

# In a new terminal, start the React client
npm run client
```

#### Option 2: Run Separately
```bash
# Terminal 1: Start the server
npm start
# or
npm run server

# Terminal 2: Start the client
cd client
npm start
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **GraphQL Playground**: http://localhost:4000/graphql
- **API Endpoint**: http://localhost:4000/graphql

## 📊 Database Schema

The application uses the following database tables:

### gsEmployees (Users)
- `gsEmployeesID` (Primary Key)
- `firstName`
- `lastName`
- `email`
- `dateAdded`

### gsPublications
- `gsPublicationID` (Primary Key)
- `PubName`
- `PubAbbrev`
- `IssueSet`
- `SubProductTypeId`
- `isActive`

### Orders
- `id` (Primary Key)
- `userId` (Foreign Key)
- `total`
- `status`
- `createdAt`

### OrderItems
- `id` (Primary Key)
- `orderId` (Foreign Key)
- `publicationId` (Foreign Key)
- `quantity`
- `price`

## 🔧 GraphQL Operations

### Queries
- `gsEmployees` - Get all users
- `gsEmployee(gsEmployeesId)` - Get user by ID
- `gsPublications` - Get all publications
- `gsPublication(gsPublicationID)` - Get publication by ID
- `gsPublicationsByType(SubProductTypeId)` - Get publications by type
- `activeGsPublications` - Get active publications
- `orders` - Get all orders
- `order(id)` - Get order by ID
- `ordersByUser(userId)` - Get orders by user

### Mutations
- `createGsEmployee(input)` - Create new user
- `updateGsEmployee(gsEmployeesId, input)` - Update user
- `deleteGsEmployee(gsEmployeesId)` - Delete user
- `createGsPublication(input)` - Create new publication
- `updateGsPublication(gsPublicationID, input)` - Update publication
- `deleteGsPublication(gsPublicationID)` - Delete publication
- `toggleGsPublicationStatus(gsPublicationID)` - Toggle publication status
- `createOrder(input)` - Create new order
- `updateOrderStatus(id, status)` - Update order status
- `deleteOrder(id)` - Delete order

## 🎯 API Usage Examples

### Query Examples
```graphql
# Get all users
query GetUsers {
  gsEmployees {
    gsEmployeesId
    FirstName
    LastName
    Email
    Dateadded
  }
}

# Get all publications
query GetPublications {
  gsPublications {
    gsPublicationID
    PubName
    PubAbbrev
    IssueSet
    SubProductTypeId
    isActive
  }
}

# Get orders with user and publication details
query GetOrders {
  orders {
    id
    total
    status
    user {
      FirstName
      LastName
      Email
    }
    publications {
      quantity
      price
      publication {
        PubName
        PubAbbrev
      }
    }
  }
}
```

### Mutation Examples
```graphql
# Create a new user
mutation CreateUser {
  createGsEmployee(input: {
    FirstName: "John"
    LastName: "Doe"
    Email: "john@example.com"
  }) {
    gsEmployeesId
    FirstName
    LastName
    Email
  }
}

# Create a new publication
mutation CreatePublication {
  createGsPublication(input: {
    PubName: "Tech Weekly"
    PubAbbrev: "TW"
    IssueSet: 52
    SubProductTypeId: 1
    isActive: true
  }) {
    gsPublicationID
    PubName
    PubAbbrev
  }
}

# Create an order
mutation CreateOrder {
  createOrder(input: {
    userId: 1
    publications: [
      {
        publicationId: 1
        quantity: 2
      }
    ]
  }) {
    id
    total
    status
  }
}
```

## 🚀 Features Overview

### Dashboard
- Real-time statistics
- Recent orders overview
- Summary cards for users, publications, orders, and revenue

### User Management
- View all users in a table
- Add new users with modal form
- Edit existing users
- Delete users with confirmation

### Publication Management
- View all publications with details
- Add new publications with comprehensive form
- Edit publication information
- Delete publications
- Status management (active/inactive)

### Order Management
- View all orders with customer details
- Order status management (pending, processing, shipped, delivered, completed, cancelled)
- Detailed order view with itemized breakdown
- Delete orders

## 🔒 Error Handling

The application includes comprehensive error handling:

- **Database connection errors**
- **GraphQL resolver errors**
- **Frontend error boundaries**
- **Loading states for async operations**
- **User-friendly error messages**

## 🎨 UI/UX Features

- **Modern, responsive design**
- **Gradient backgrounds and shadows**
- **Hover effects and transitions**
- **Modal dialogs for forms**
- **Status badges with color coding**
- **Mobile-friendly responsive layout**

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔧 Development Scripts

```bash
# Server scripts
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run server     # Start server

# Client scripts
npm run client     # Start React development server
npm run build      # Build React app for production

# Combined
# Run both server and client simultaneously
```

## 🚀 Production Deployment

For production deployment:

1. **Build the React app**:
   ```bash
   cd client
   npm run build
   ```

2. **Set production environment variables**
3. **Configure your MSSQL server for production**
4. **Deploy to your hosting platform**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify MSSQL server is running
   - Check connection credentials in `.env`
   - Ensure database exists and tables are created

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill processes using the ports: `lsof -ti:4000 | xargs kill -9`

3. **GraphQL Schema Issues**
   - Restart the server after schema changes
   - Clear Apollo Client cache in browser

4. **Package Installation Issues**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

For more help, please open an issue in the repository.

---

**Happy Coding! 🎉**