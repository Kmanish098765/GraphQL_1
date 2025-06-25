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

// gsPublications Queries (updated field names)
export const GET_PUBLICATIONS = gql`
  query GetPublications {
    gsPublications {
      gsPublicationID
      PubName
      PubAbbrev
      IssueSet
      SubProductTypeID
      IsActive
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
      SubProductTypeID
      IsActive
    }
  }
`;

export const GET_PUBLICATIONS_BY_TYPE = gql`
  query GetPublicationsByType($SubProductTypeID: Int!) {
    gsPublicationsByType(SubProductTypeID: $SubProductTypeID) {
      gsPublicationID
      PubName
      PubAbbrev
      IssueSet
      SubProductTypeID
      IsActive
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
      SubProductTypeID
      IsActive
    }
  }
`;

// Order Queries (using gsContracts backend - updated field names)
export const GET_ORDERS = gql`
  query GetOrders($limit: Int, $offset: Int) {
    orders(limit: $limit, offset: $offset) {
      OrderId
      CustomerID
      Yr
      Mnth
      PubID
      Net
      DateAdded
      RepIDs
      Description
      publication {
        gsPublicationID
        PubName
        PubAbbrev
        IssueSet
        SubProductTypeID
        IsActive
      }
      representatives {
        gsEmployeesId
        FirstName
        LastName
        Email
      }
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($OrderId: Int!) {
    order(OrderId: $OrderId) {
      OrderId
      CustomerID
      Yr
      Mnth
      PubID
      Net
      DateAdded
      RepIDs
      Description
      publication {
        gsPublicationID
        PubName
        PubAbbrev
        IssueSet
        SubProductTypeID
        IsActive
      }
      representatives {
        gsEmployeesId
        FirstName
        LastName
        Email
      }
    }
  }
`;

export const GET_ORDERS_BY_PUBLICATION = gql`
  query GetOrdersByPublication($PubID: Int!) {
    ordersByPublication(PubID: $PubID) {
      OrderId
      CustomerID
      Yr
      Mnth
      PubID
      Net
      DateAdded
      RepIDs
      Description
      publication {
        gsPublicationID
        PubName
        PubAbbrev
      }
      representatives {
        gsEmployeesId
        FirstName
        LastName
        Email
      }
    }
  }
`;

export const GET_ORDERS_BY_REPRESENTATIVE = gql`
  query GetOrdersByRepresentative($RepID: Int!) {
    ordersByRepresentative(RepID: $RepID) {
      OrderId
      CustomerID
      Yr
      Mnth
      PubID
      Net
      DateAdded
      RepIDs
      Description
      publication {
        gsPublicationID
        PubName
        PubAbbrev
      }
      representatives {
        gsEmployeesId
        FirstName
        LastName
        Email
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

// gsPublications Mutations (updated field names)
export const CREATE_PUBLICATION = gql`
  mutation CreatePublication($input: CreateGsPublicationInput!) {
    createGsPublication(input: $input) {
      gsPublicationID
      PubName
      PubAbbrev
      IssueSet
      SubProductTypeID
      IsActive
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
      SubProductTypeID
      IsActive
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
      IsActive
    }
  }
`;

// Order Mutations (using gsContracts backend - updated field names)
export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      OrderId
      CustomerID
      Yr
      Mnth
      PubID
      Net
      DateAdded
      RepIDs
      Description
      publication {
        gsPublicationID
        PubName
        PubAbbrev
      }
      representatives {
        gsEmployeesId
        FirstName
        LastName
      }
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation UpdateOrder($OrderId: Int!, $input: UpdateOrderInput!) {
    updateOrder(OrderId: $OrderId, input: $input) {
      OrderId
      CustomerID
      Yr
      Mnth
      PubID
      Net
      DateAdded
      RepIDs
      Description
      publication {
        gsPublicationID
        PubName
        PubAbbrev
      }
      representatives {
        gsEmployeesId
        FirstName
        LastName
      }
    }
  }
`;

export const DELETE_ORDER = gql`
  mutation DeleteOrder($OrderId: Int!) {
    deleteOrder(OrderId: $OrderId)
  }
`; 