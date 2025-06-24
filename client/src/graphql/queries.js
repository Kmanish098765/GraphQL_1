import { gql } from '@apollo/client';

// gsEmployees Queries
export const GET_USERS = gql`
  query GetUsers {
    gsEmployees {
      gsEmployeesId
      FirstName
      LastName
      Email
      Dateadded
    }
  }
`;

export const GET_USER = gql`
  query GetUser($gsEmployeesId: Int!) {
    gsEmployee(gsEmployeesId: $gsEmployeesId) {
      gsEmployeesId
      FirstName
      LastName
      Email
      Dateadded
    }
  }
`;

// gsPublications Queries (replacing Product Queries)
export const GET_PUBLICATIONS = gql`
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
`;

export const GET_PUBLICATION = gql`
  query GetPublication($gsPublicationID: Int!) {
    gsPublication(gsPublicationID: $gsPublicationID) {
      gsPublicationID
      PubName
      PubAbbrev
      IssueSet
      SubProductTypeId
      isActive
    }
  }
`;

export const GET_PUBLICATIONS_BY_TYPE = gql`
  query GetPublicationsByType($SubProductTypeId: Int!) {
    gsPublicationsByType(SubProductTypeId: $SubProductTypeId) {
      gsPublicationID
      PubName
      PubAbbrev
      IssueSet
      SubProductTypeId
      isActive
    }
  }
`;

export const GET_ACTIVE_PUBLICATIONS = gql`
  query GetActivePublications {
    activeGsPublications {
      gsPublicationID
      PubName
      PubAbbrev
      IssueSet
      SubProductTypeId
      isActive
    }
  }
`;

// Order Queries (updated for gsPublications)
export const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      userId
      user {
        gsEmployeesId
        FirstName
        LastName
        Email
      }
      total
      status
      createdAt
      publications {
        id
        publicationId
        publication {
          gsPublicationID
          PubName
          PubAbbrev
        }
        quantity
        price
      }
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: Int!) {
    order(id: $id) {
      id
      userId
      user {
        gsEmployeesId
        FirstName
        LastName
        Email
      }
      total
      status
      createdAt
      publications {
        id
        publicationId
        publication {
          gsPublicationID
          PubName
          PubAbbrev
        }
        quantity
        price
      }
    }
  }
`;

export const GET_ORDERS_BY_USER = gql`
  query GetOrdersByUser($userId: Int!) {
    ordersByUser(userId: $userId) {
      id
      userId
      total
      status
      createdAt
      publications {
        id
        publicationId
        publication {
          gsPublicationID
          PubName
          PubAbbrev
        }
        quantity
        price
      }
    }
  }
`;

// gsEmployees Mutations
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateGsEmployeeInput!) {
    createGsEmployee(input: $input) {
      gsEmployeesId
      FirstName
      LastName
      Email
      Dateadded
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($gsEmployeesId: Int!, $input: UpdateGsEmployeeInput!) {
    updateGsEmployee(gsEmployeesId: $gsEmployeesId, input: $input) {
      gsEmployeesId
      FirstName
      LastName
      Email
      Dateadded
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($gsEmployeesId: Int!) {
    deleteGsEmployee(gsEmployeesId: $gsEmployeesId)
  }
`;

// gsPublications Mutations (replacing Product Mutations)
export const CREATE_PUBLICATION = gql`
  mutation CreatePublication($input: CreateGsPublicationInput!) {
    createGsPublication(input: $input) {
      gsPublicationID
      PubName
      PubAbbrev
      IssueSet
      SubProductTypeId
      isActive
    }
  }
`;

export const UPDATE_PUBLICATION = gql`
  mutation UpdatePublication($gsPublicationID: Int!, $input: UpdateGsPublicationInput!) {
    updateGsPublication(gsPublicationID: $gsPublicationID, input: $input) {
      gsPublicationID
      PubName
      PubAbbrev
      IssueSet
      SubProductTypeId
      isActive
    }
  }
`;

export const DELETE_PUBLICATION = gql`
  mutation DeletePublication($gsPublicationID: Int!) {
    deleteGsPublication(gsPublicationID: $gsPublicationID)
  }
`;

export const TOGGLE_PUBLICATION_STATUS = gql`
  mutation TogglePublicationStatus($gsPublicationID: Int!) {
    toggleGsPublicationStatus(gsPublicationID: $gsPublicationID) {
      gsPublicationID
      PubName
      isActive
    }
  }
`;

// Order Mutations (updated for gsPublications)
export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      userId
      user {
        gsEmployeesId
        FirstName
        LastName
      }
      total
      status
      createdAt
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: Int!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const DELETE_ORDER = gql`
  mutation DeleteOrder($id: Int!) {
    deleteOrder(id: $id)
  }
`; 