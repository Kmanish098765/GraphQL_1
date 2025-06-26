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

  # Calendar Activities Schema - Based on context.md specifications
  
  # Input Arguments for Calendar Activities
  input CalendarActivitiesInput {
    # Activity Type Filters
    notesCreated: Boolean = false
    callsMarkedCompleted: Boolean = true
    callScheduled: Boolean = true
    createdMeeting: Boolean = false
    scheduledMeeting: Boolean = false
    emailDelivered: Boolean = false
    massEmailDelivered: Boolean = false
    taskCreated: Boolean = false
    lettersCreated: Boolean = false
    mobileCheckInCreated: Boolean = false
    userLoggedIn: Boolean = false
    proposalCreated: Boolean = false
    orderCreated: Boolean = false
    opportunityCreated: Boolean = false
    
    # Date Filters
    fromDate: String!
    toDate: String!
    
    # User/Customer Filters
    loggedInUserID: Int!
    companyName: String
    name: String
    customerID: Int
    contactIDs: String
    
    # System Filters
    isSystem: SystemFilterType = USER_ONLY
    isNoteRequired: Boolean = false
  }

  enum SystemFilterType {
    USER_ONLY
    SYSTEM_ONLY
    ALL
  }

  # Response Types
  type CalendarActivitiesResponse {
    activities: [CalendarActivity!]!
    totalCount: Int!
  }

  # Union type for different activity types
  union CalendarActivity = 
    | NoteActivity 
    | CallActivity 
    | MeetingActivity 
    | EmailActivity 
    | TaskActivity 
    | LetterActivity 
    | MobileCheckInActivity 
    | UserLoginActivity
    | ProposalActivity
    | OrderActivity
    | OpportunityActivity

  # Base interface for all activities
  interface BaseActivity {
    id: ID!
    dateScheduled: String!
    type: ActivityType!
    notes: String
    completed: Int
    dateCompleted: String
    assignedTo: Employee
    customer: Customer
    permissions: ActivityPermissions!
    activityCategory: String
    isSystem: Boolean!
  }

  # Specific Activity Types
  type NoteActivity implements BaseActivity {
    id: ID!
    dateScheduled: String!
    type: ActivityType!
    notes: String
    completed: Int
    dateCompleted: String
    assignedTo: Employee
    customer: Customer
    permissions: ActivityPermissions!
    activityCategory: String
    isSystem: Boolean!
    
    # Note-specific fields
    isPrivate: Boolean!
    createdBy: Employee!
  }

  type CallActivity implements BaseActivity {
    id: ID!
    dateScheduled: String!
    type: ActivityType!
    notes: String
    completed: Int
    dateCompleted: String
    assignedTo: Employee
    customer: Customer
    permissions: ActivityPermissions!
    activityCategory: String
    isSystem: Boolean!
    
    # Call-specific fields
    callBack: String
    isCall: Boolean!
    isPrivate: Boolean!
  }

  type MeetingActivity implements BaseActivity {
    id: ID!
    dateScheduled: String!
    type: ActivityType!
    notes: String
    completed: Int
    dateCompleted: String
    assignedTo: Employee
    customer: Customer
    permissions: ActivityPermissions!
    activityCategory: String
    isSystem: Boolean!
    
    # Meeting-specific fields
    meeting: String
    meetingType: String
    calendarEventID: String
    rrule: String
    duration: Int
    isPrivate: Boolean!
  }

  type EmailActivity implements BaseActivity {
    id: ID!
    dateScheduled: String!
    type: ActivityType!
    notes: String
    completed: Int
    dateCompleted: String
    assignedTo: Employee
    customer: Customer
    permissions: ActivityPermissions!
    activityCategory: String
    isSystem: Boolean!
    
    # Email-specific fields
    isEmail: Boolean!
    isMassEmail: Boolean!
  }

  type TaskActivity implements BaseActivity {
    id: ID!
    dateScheduled: String!
    type: ActivityType!
    notes: String
    completed: Int
    dateCompleted: String
    assignedTo: Employee
    customer: Customer
    permissions: ActivityPermissions!
    activityCategory: String
    isSystem: Boolean!
    
    # Task-specific fields
    title: String!
    isPrivate: Boolean!
    assignedBy: Employee
  }

  type LetterActivity implements BaseActivity {
    id: ID!
    dateScheduled: String!
    type: ActivityType!
    notes: String
    completed: Int
    dateCompleted: String
    assignedTo: Employee
    customer: Customer
    permissions: ActivityPermissions!
    activityCategory: String
    isSystem: Boolean!
    
    # Letter-specific fields
    isLetter: Boolean!
  }

  type MobileCheckInActivity implements BaseActivity {
    id: ID!
    dateScheduled: String!
    type: ActivityType!
    notes: String
    completed: Int
    dateCompleted: String
    assignedTo: Employee
    customer: Customer
    permissions: ActivityPermissions!
    activityCategory: String
    isSystem: Boolean!
    
    # Mobile check-in specific fields
    transactionDate: String!
  }

  type UserLoginActivity implements BaseActivity {
    id: ID!
    dateScheduled: String!
    type: ActivityType!
    notes: String
    completed: Int
    dateCompleted: String
    assignedTo: Employee
    customer: Customer
    permissions: ActivityPermissions!
    activityCategory: String
    isSystem: Boolean!
    
    # User login specific fields
    loginTime: String!
    logoutTime: String
  }

  type ProposalActivity implements BaseActivity {
    id: ID!
    dateScheduled: String!
    type: ActivityType!
    notes: String
    completed: Int
    dateCompleted: String
    assignedTo: Employee
    customer: Customer
    permissions: ActivityPermissions!
    activityCategory: String
    isSystem: Boolean!
    
    # Proposal-specific fields
    proposalName: String!
    createDate: String!
  }

  type OrderActivity implements BaseActivity {
    id: ID!
    dateScheduled: String!
    type: ActivityType!
    notes: String
    completed: Int
    dateCompleted: String
    assignedTo: Employee
    customer: Customer
    permissions: ActivityPermissions!
    activityCategory: String
    isSystem: Boolean!
    
    # Order-specific fields
    description: String
    contractID: ID!
  }

  type OpportunityActivity implements BaseActivity {
    id: ID!
    dateScheduled: String!
    type: ActivityType!
    notes: String
    completed: Int
    dateCompleted: String
    assignedTo: Employee
    customer: Customer
    permissions: ActivityPermissions!
    activityCategory: String
    isSystem: Boolean!
    
    # Opportunity-specific fields
    opportunityName: String!
    salesPresenter: Employee
    owner: Employee
  }

  # Supporting Types for Calendar Activities
  type Employee {
    id: ID!
    firstName: String
    lastName: String
    fullName: String
    isAdmin: Boolean!
  }

  type Customer {
    id: ID!
    customer: String!
    firstName: String
    lastName: String
    parentID: Int
    isCompany: Boolean!
  }

  type ActivityPermissions {
    canEdit: Boolean!
    canDelete: Boolean!
    canView: Boolean!
  }

  enum ActivityType {
    NOTE
    CALL
    CALL_SCHEDULED
    MEETING
    MEETING_SCHEDULED
    EMAIL
    MASS_EMAIL
    TASK
    LETTER
    MOBILE_CHECK_IN
    USER_LOGIN
    PROPOSAL
    ORDER
    OPPORTUNITY
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

    # Calendar Activities Query
    getCalendarActivities(input: CalendarActivitiesInput!): CalendarActivitiesResponse!
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