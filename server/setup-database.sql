-- Create database (run this first if database doesn't exist)
-- CREATE DATABASE GraphQLApp;
-- GO

-- Use the database
-- USE GraphQLApp;
-- GO

-- Create Users table
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    createdAt DATETIME2 DEFAULT GETDATE()
);

-- Create Products table
CREATE TABLE Products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    price FLOAT NOT NULL,
    category NVARCHAR(100),
    stock INT NOT NULL DEFAULT 0,
    createdAt DATETIME2 DEFAULT GETDATE()
);

-- Create Orders table
CREATE TABLE Orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    total FLOAT NOT NULL,
    status NVARCHAR(50) DEFAULT 'pending',
    createdAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Create OrderItems table
CREATE TABLE OrderItems (
    id INT IDENTITY(1,1) PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    price FLOAT NOT NULL,
    FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(id)
);

-- Insert sample data
INSERT INTO Users (name, email) VALUES 
('John Doe', 'john@example.com'),
('Jane Smith', 'jane@example.com'),
('Bob Johnson', 'bob@example.com');

INSERT INTO Products (name, description, price, category, stock) VALUES 
('Laptop', 'High-performance laptop for professionals', 999.99, 'Electronics', 10),
('Smartphone', 'Latest smartphone with advanced features', 699.99, 'Electronics', 25),
('Desk Chair', 'Ergonomic office chair for comfort', 299.99, 'Furniture', 15),
('Coffee Mug', 'Ceramic coffee mug with company logo', 12.99, 'Accessories', 50),
('Wireless Mouse', 'Bluetooth wireless mouse', 49.99, 'Electronics', 30);

-- Create some sample orders
INSERT INTO Orders (userId, total, status) VALUES 
(1, 1049.98, 'completed'),
(2, 349.98, 'pending'),
(3, 62.98, 'shipped');

-- Create sample order items
INSERT INTO OrderItems (orderId, productId, quantity, price) VALUES 
-- Order 1 (John's order)
(1, 1, 1, 999.99),  -- 1 Laptop
(1, 5, 1, 49.99),   -- 1 Wireless Mouse

-- Order 2 (Jane's order)
(2, 3, 1, 299.99),  -- 1 Desk Chair
(2, 4, 1, 12.99),   -- 1 Coffee Mug
(2, 4, 3, 12.99),   -- 3 more Coffee Mugs

-- Order 3 (Bob's order)
(3, 4, 1, 12.99),   -- 1 Coffee Mug
(3, 5, 1, 49.99);   -- 1 Wireless Mouse

-- Create indexes for better performance
CREATE INDEX IX_Orders_UserId ON Orders(userId);
CREATE INDEX IX_OrderItems_OrderId ON OrderItems(orderId);
CREATE INDEX IX_OrderItems_ProductId ON OrderItems(productId);
CREATE INDEX IX_Products_Category ON Products(category);
CREATE INDEX IX_Users_Email ON Users(email); 