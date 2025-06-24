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

-- Create gsContracts table (replaces Orders)
CREATE TABLE gsContracts (
  gsContractsID INT IDENTITY(1,1) PRIMARY KEY,
  PubID INT,
  DateAdded DATETIME2 DEFAULT GETDATE(),
  Net DECIMAL(10,2),
  RepIDs NVARCHAR(500),
  Description NVARCHAR(1000),
  FOREIGN KEY (PubID) REFERENCES gsPublications(gsPublicationID)
);

-- Insert sample users
INSERT INTO gsemployees (firstName, lastName, email) VALUES
('John', 'Doe', 'john.doe@example.com'),
('Jane', 'Smith', 'jane.smith@example.com'),
('Bob', 'Johnson', 'bob.johnson@example.com'),
('Alice', 'Williams', 'alice.williams@example.com'),
('Charlie', 'Brown', 'charlie.brown@example.com');

-- Insert sample gsPublications
INSERT INTO gsPublications (PubName, PubAbbrev, IssueSet, SubProductTypeId, isActive) VALUES
('Tech Weekly', 'TW', 52, 1, 1),
('Business Monthly', 'BM', 12, 2, 1),
('Science Quarterly', 'SQ', 4, 3, 1),
('News Daily', 'ND', 365, 1, 0),
('Health Today', 'HT', 24, 4, 1);

-- Insert sample gsContracts
INSERT INTO gsContracts (PubID, Net, RepIDs, Description) VALUES
(1, 15000.00, '1,2', 'Annual subscription contract for Tech Weekly'),
(2, 8500.50, '2,3', 'Business Monthly advertising package'),
(3, 12000.00, '1,4', 'Science Quarterly research partnership'),
(1, 25000.00, '3,4,5', 'Tech Weekly premium advertising bundle'),
(5, 18750.75, '1,5', 'Health Today content syndication deal');

-- Create indexes for better performance
CREATE INDEX IX_gsEmployees_Email ON gsemployees(email);
CREATE INDEX IX_gsPublications_SubProductTypeId ON gsPublications(SubProductTypeId);
CREATE INDEX IX_gsPublications_isActive ON gsPublications(isActive);
CREATE INDEX IX_gsContracts_PubID ON gsContracts(PubID);
CREATE INDEX IX_gsContracts_DateAdded ON gsContracts(DateAdded);
CREATE INDEX IX_gsContracts_RepIDs ON gsContracts(RepIDs); 