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

  # gsPublications Type (replacing Product)
  type gsPublications {
    gsPublicationID: Int
    PubName: String
    PubAbbrev: String
    IssueSet: Int
    SubProductTypeId: Int
    isActive: Boolean
  }

  # Input Types for gsPublications
  input CreateGsPublicationInput {
    PubName: String!
    PubAbbrev: String
    IssueSet: Int
    SubProductTypeId: Int
    isActive: Boolean
  }

  input UpdateGsPublicationInput {
    PubName: String
    PubAbbrev: String
    IssueSet: Int
    SubProductTypeId: Int
    isActive: Boolean
  }

  # Order Type
  type Order {
    id: Int
    userId: Int
    total: Float
    status: String
    createdAt: String
    user: gsEmployees
    publications: [OrderItem]
  }

  # OrderItem Type (updated to reference gsPublications)
  type OrderItem {
    id: Int
    orderId: Int
    publicationId: Int
    quantity: Int
    price: Float
    publication: gsPublications
  }

  # Input Types for Orders
  input CreateOrderInput {
    userId: Int!
    publications: [OrderPublicationInput!]!
  }

  input OrderPublicationInput {
    publicationId: Int!
    quantity: Int!
  }

  # Queries
  type Query {
    # gsEmployees Queries
    gsEmployees: [gsEmployees]
    gsEmployee(gsEmployeesId: Int!): gsEmployees

    # gsPublications Queries (replacing Product queries)
    gsPublications: [gsPublications]
    gsPublication(gsPublicationID: Int!): gsPublications
    gsPublicationsByType(SubProductTypeId: Int!): [gsPublications]
    activeGsPublications: [gsPublications]

    # Order Queries
    orders: [Order]
    order(id: Int!): Order
    ordersByUser(userId: Int!): [Order]
  }

  # Mutations
  type Mutation {
    # gsEmployee Mutations
    createGsEmployee(input: CreateGsEmployeeInput!): gsEmployees
    updateGsEmployee(gsEmployeesId: Int!, input: UpdateGsEmployeeInput!): gsEmployees
    deleteGsEmployee(gsEmployeesId: Int!): Boolean

    # gsPublications Mutations (replacing Product mutations)
    createGsPublication(input: CreateGsPublicationInput!): gsPublications
    updateGsPublication(gsPublicationID: Int!, input: UpdateGsPublicationInput!): gsPublications
    deleteGsPublication(gsPublicationID: Int!): Boolean
    toggleGsPublicationStatus(gsPublicationID: Int!): gsPublications

    # Order Mutations
    createOrder(input: CreateOrderInput!): Order
    updateOrderStatus(id: Int!, status: String!): Order
    deleteOrder(id: Int!): Boolean
  }

  type Subscription {
    orderCreated: Order!
    productUpdated: gsPublications!
  }
`;

module.exports = typeDefs; 