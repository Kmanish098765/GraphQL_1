-- Create database (run this first if database doesn't exist)
-- CREATE DATABASE GraphQLApp;
-- GO

-- Use the database
-- USE GraphQLApp;
-- GO

-- Create Users table (gsemployees)
CREATE TABLE gsemployees (
  gsEmployeesID INT IDENTITY(1,1) PRIMARY KEY,
  firstName NVARCHAR(255),
  lastName NVARCHAR(255),
  email NVARCHAR(255),
  dateAdded DATETIME2 DEFAULT GETDATE()
);

-- Create gsPublications table
CREATE TABLE gsPublications (
  gsPublicationID INT IDENTITY(1,1) PRIMARY KEY,
  PubName NVARCHAR(255),
  PubAbbrev NVARCHAR(100),
  IssueSet INT,
  SubProductTypeId INT,
  isActive BIT DEFAULT 1
);

-- Create Orders table
CREATE TABLE Orders (
  id INT IDENTITY(1,1) PRIMARY KEY,
  userId INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status NVARCHAR(50) DEFAULT 'pending',
  createdAt DATETIME2 DEFAULT GETDATE(),
  FOREIGN KEY (userId) REFERENCES gsemployees(gsEmployeesID)
);

-- Create OrderItems table (updated to reference gsPublications)
CREATE TABLE OrderItems (
  id INT IDENTITY(1,1) PRIMARY KEY,
  orderId INT NOT NULL,
  publicationId INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE,
  FOREIGN KEY (publicationId) REFERENCES gsPublications(gsPublicationID)
);

-- Insert sample users
INSERT INTO gsemployees (firstName, lastName, email) VALUES
('John', 'Doe', 'john.doe@example.com'),
('Jane', 'Smith', 'jane.smith@example.com'),
('Bob', 'Johnson', 'bob.johnson@example.com');

-- Insert sample gsPublications
INSERT INTO gsPublications (PubName, PubAbbrev, IssueSet, SubProductTypeId, isActive) VALUES
('Tech Weekly', 'TW', 52, 1, 1),
('Business Monthly', 'BM', 12, 2, 1),
('Science Quarterly', 'SQ', 4, 3, 1),
('News Daily', 'ND', 365, 1, 0);

-- Create some sample orders
INSERT INTO Orders (userId, total, status) VALUES
(1, 299.99, 'completed'),
(2, 149.50, 'pending'),
(3, 89.99, 'shipped');

-- Insert sample order items
INSERT INTO OrderItems (orderId, publicationId, quantity, price) VALUES
(1, 1, 2, 149.99),
(1, 2, 1, 149.99),
(2, 3, 1, 149.50),
(3, 1, 1, 89.99);

-- Create indexes for better performance
CREATE INDEX IX_Orders_UserId ON Orders(userId);
CREATE INDEX IX_OrderItems_OrderId ON OrderItems(orderId);
CREATE INDEX IX_OrderItems_PublicationId ON OrderItems(publicationId);
CREATE INDEX IX_gsPublications_SubProductTypeId ON gsPublications(SubProductTypeId);
CREATE INDEX IX_gsPublications_isActive ON gsPublications(isActive); 