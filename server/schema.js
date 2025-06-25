const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # gsEmployees Type
  type gsEmployees {
    gsEmployeesId: Int
    FirstName: String
    LastName: String
    Email: String
    Dateadded: String
  }

  # Input Types
  input CreateGsEmployeeInput {
    FirstName: String
    LastName: String
    Email: String
  }

  input UpdateGsEmployeeInput {
    FirstName: String
    LastName: String
    Email: String
  }

  # gsPublications Type (essential fields only)
  type gsPublications {
    gsPublicationID: Int
    PubName: String
    PubAbbrev: String
    IssueSet: Int
    SubProductTypeID: Int
    IsActive: Boolean
  }

  # Input Types for gsPublications (essential fields only)
  input CreateGsPublicationInput {
    PubName: String!
    PubAbbrev: String
    IssueSet: Int
    SubProductTypeID: Int
    IsActive: Boolean
  }

  input UpdateGsPublicationInput {
    PubName: String
    PubAbbrev: String
    IssueSet: Int
    SubProductTypeID: Int
    IsActive: Boolean
  }

  # Order Type (UI display name for gsContracts - essential fields only)
  type Order {
    OrderId: Int
    CustomerID: Int
    Yr: Int
    Mnth: Int
    PubID: Int
    Net: Float
    DateAdded: String
    RepIDs: String
    Description: String
    publication: gsPublications
    representatives: [gsEmployees]
  }

  # Input Types for Orders (gsContracts - essential fields only)
  input CreateOrderInput {
    CustomerID: Int!
    Yr: Int!
    Mnth: Int!
    PubID: Int!
    Net: Float
    RepIDs: String
    Description: String
  }

  input UpdateOrderInput {
    CustomerID: Int
    Yr: Int
    Mnth: Int
    PubID: Int
    Net: Float
    RepIDs: String
    Description: String
  }

  # Queries
  type Query {
    # gsEmployees Queries
    gsEmployees: [gsEmployees]
    gsEmployee(gsEmployeesId: Int!): gsEmployees

    # gsPublications Queries
    gsPublications: [gsPublications]
    gsPublication(gsPublicationID: Int!): gsPublications
    gsPublicationsByType(SubProductTypeID: Int!): [gsPublications]
    activeGsPublications: [gsPublications]

    # Order Queries (gsContracts backend)
    orders(limit: Int = 100, offset: Int = 0): [Order]
    order(OrderId: Int!): Order
    ordersByPublication(PubID: Int!, limit: Int = 100): [Order]
    ordersByRepresentative(RepID: Int!, limit: Int = 100): [Order]
  }

  # Mutations
  type Mutation {
    # gsEmployee Mutations
    createGsEmployee(input: CreateGsEmployeeInput!): gsEmployees
    updateGsEmployee(gsEmployeesId: Int!, input: UpdateGsEmployeeInput!): gsEmployees
    deleteGsEmployee(gsEmployeesId: Int!): Boolean

    # gsPublications Mutations
    createGsPublication(input: CreateGsPublicationInput!): gsPublications
    updateGsPublication(gsPublicationID: Int!, input: UpdateGsPublicationInput!): gsPublications
    deleteGsPublication(gsPublicationID: Int!): Boolean
    toggleGsPublicationStatus(gsPublicationID: Int!): gsPublications

    # Order Mutations (gsContracts backend)
    createOrder(input: CreateOrderInput!): Order
    updateOrder(OrderId: Int!, input: UpdateOrderInput!): Order
    deleteOrder(OrderId: Int!): Boolean
  }

  type Subscription {
    orderCreated: Order!
    gsPublicationUpdated: gsPublications!
  }
`;

module.exports = typeDefs; 