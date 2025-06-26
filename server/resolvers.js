const resolvers = {
  Query: {
    // GsEmployee queries using Prisma
    gsEmployees: async (_, __, { prisma }) => {
      try {
        const employees = await prisma.gsEmployees.findMany({
          orderBy: {
            dateAdded: 'desc'
          }
        });
        return employees;
      } catch (error) {
        throw new Error(`Failed to fetch gsEmployees: ${error.message}`);
      }
    },

    gsEmployee: async (_, { gsEmployeesId }, { prisma }) => {
      try {
        const employee = await prisma.gsEmployees.findUnique({
          where: {
            gsEmployeesID: parseInt(gsEmployeesId)
          }
        });
        return employee;
      } catch (error) {
        throw new Error(`Failed to fetch gsEmployee: ${error.message}`);
      }
    },

    // gsPublications queries using Prisma (essential fields only)
    gsPublications: async (_, __, { prisma }) => {
      try {
        const publications = await prisma.gsPublications.findMany({
          select: {
            gsPublicationID: true,
            PubName: true,
            PubAbbrev: true,
            IssueSet: true,
            SubProductTypeID: true,
            IsActive: true
          },
          orderBy: {
            PubName: 'asc'
          }
        });
        return publications;
      } catch (error) {
        throw new Error(`Failed to fetch gsPublications: ${error.message}`);
      }
    },

    gsPublication: async (_, { gsPublicationID }, { prisma }) => {
      try {
        const publication = await prisma.gsPublications.findUnique({
          where: {
            gsPublicationID: parseInt(gsPublicationID)
          },
          select: {
            gsPublicationID: true,
            PubName: true,
            PubAbbrev: true,
            IssueSet: true,
            SubProductTypeID: true,
            IsActive: true
          }
        });
        return publication;
      } catch (error) {
        throw new Error(`Failed to fetch gsPublication: ${error.message}`);
      }
    },

    gsPublicationsByType: async (_, { SubProductTypeID }, { prisma }) => {
      try {
        const publications = await prisma.gsPublications.findMany({
          where: {
            SubProductTypeID: parseInt(SubProductTypeID)
          },
          select: {
            gsPublicationID: true,
            PubName: true,
            PubAbbrev: true,
            IssueSet: true,
            SubProductTypeID: true,
            IsActive: true
          },
          orderBy: {
            PubName: 'asc'
          }
        });
        return publications;
      } catch (error) {
        throw new Error(`Failed to fetch gsPublications by type: ${error.message}`);
      }
    },

    activeGsPublications: async (_, __, { prisma }) => {
      try {
        const publications = await prisma.gsPublications.findMany({
          where: {
            IsActive: true
          },
          select: {
            gsPublicationID: true,
            PubName: true,
            PubAbbrev: true,
            IssueSet: true,
            SubProductTypeID: true,
            IsActive: true
          },
          orderBy: {
            PubName: 'asc'
          }
        });
        return publications;
      } catch (error) {
        throw new Error(`Failed to fetch active gsPublications: ${error.message}`);
      }
    },

    // Order queries using gsContracts backend (essential fields only)
    orders: async (_, { limit = 100, offset = 0 }, { prisma }) => {
      try {
        const contracts = await prisma.gsContracts.findMany({
          take: limit,
          skip: offset,
          select: {
            gsContractsID: true,
            CustomerID: true,
            Yr: true,
            Mnth: true,
            PubID: true,
            Net: true,
            DateAdded: true,
            RepIDs: true,
            Description: true
          },
          orderBy: {
            DateAdded: 'desc'
          }
        });
        return contracts;
      } catch (error) {
        console.error('Error fetching orders:', error);
        throw new Error('Failed to fetch orders');
      }
    },

    order: async (_, { OrderId }, { prisma }) => {
      try {
        const contract = await prisma.gsContracts.findUnique({
          where: {
            gsContractsID: parseInt(OrderId)
          },
          select: {
            gsContractsID: true,
            CustomerID: true,
            Yr: true,
            Mnth: true,
            PubID: true,
            Net: true,
            DateAdded: true,
            RepIDs: true,
            Description: true
          }
        });
        return contract;
      } catch (error) {
        console.error('Error fetching order:', error);
        throw new Error('Failed to fetch order');
      }
    },

    ordersByPublication: async (_, { PubID, limit = 100 }, { prisma }) => {
      try {
        const contracts = await prisma.gsContracts.findMany({
          where: {
            PubID: parseInt(PubID)
          },
          take: limit,
          select: {
            gsContractsID: true,
            CustomerID: true,
            Yr: true,
            Mnth: true,
            PubID: true,
            Net: true,
            DateAdded: true,
            RepIDs: true,
            Description: true
          },
          orderBy: {
            DateAdded: 'desc'
          }
        });
        return contracts;
      } catch (error) {
        console.error('Error fetching orders by publication:', error);
        throw new Error('Failed to fetch orders by publication');
      }
    },

    ordersByRepresentative: async (_, { RepID, limit = 100 }, { prisma }) => {
      try {
        const contracts = await prisma.gsContracts.findMany({
          where: {
            RepIDs: {
              contains: RepID.toString()
            }
          },
          take: limit,
          select: {
            gsContractsID: true,
            CustomerID: true,
            Yr: true,
            Mnth: true,
            PubID: true,
            Net: true,
            DateAdded: true,
            RepIDs: true,
            Description: true
          },
          orderBy: {
            DateAdded: 'desc'
          }
        });
        return contracts;
      } catch (error) {
        console.error('Error fetching orders by representative:', error);
        throw new Error('Failed to fetch orders by representative');
      }
    },

    // Calendar Activities Query - Using Prisma instead of raw SQL
    getCalendarActivities: async (_, { input }, { prisma }) => {
      try {
        console.log('Calendar Activities Query called with input:', input);
        
        const {
          notesCreated,
          taskCreated,
          createdMeeting,
          emailDelivered,
          orderCreated,
          fromDate,
          toDate,
          customerID,
          isSystem
        } = input;

        let activities = [];

        // For now, let's create some mock data to test the union types
        // This eliminates any potential database access issues
        
        if (notesCreated) {
          activities.push({
            __typename: 'NoteActivity',
            id: 'note_1',
            dateScheduled: new Date().toISOString(),
            type: 'NOTE',
            notes: 'Sample note activity',
            completed: 0,
            dateCompleted: null,
            assignedTo: { id: '1', firstName: 'John', lastName: 'Doe' },
            customer: { id: '1', customer: 'Sample Customer' },
            permissions: { canEdit: true, canDelete: true, canView: true },
            activityCategory: 'Note',
            isSystem: false,
            isPrivate: true,
            createdBy: { id: '1', firstName: 'John', lastName: 'Doe' }
          });
        }

        if (taskCreated) {
          activities.push({
            __typename: 'TaskActivity',
            id: 'task_1',
            dateScheduled: new Date().toISOString(),
            type: 'TASK',
            notes: 'Sample task activity',
            completed: 0,
            dateCompleted: null,
            assignedTo: { id: '1', firstName: 'Jane', lastName: 'Smith' },
            customer: null,
            permissions: { canEdit: true, canDelete: true, canView: true },
            activityCategory: 'Task',
            isSystem: false,
            title: 'Sample Task',
            isPrivate: false,
            assignedBy: { id: '2', firstName: 'Manager', lastName: 'User' }
          });
        }

        if (orderCreated) {
          activities.push({
            __typename: 'OrderActivity',
            id: 'order_1',
            dateScheduled: new Date().toISOString(),
            type: 'ORDER',
            notes: 'Sample order activity',
            completed: 0,
            dateCompleted: null,
            assignedTo: null,
            customer: { id: '2', customer: 'Order Customer' },
            permissions: { canEdit: true, canDelete: false, canView: true },
            activityCategory: 'Order',
            isSystem: false,
            description: 'Sample order description',
            contractID: '123'
          });
        }

        console.log('Returning activities:', activities.length);

        return {
          activities,
          totalCount: activities.length
        };

      } catch (error) {
        console.error('Error fetching calendar activities:', error);
        throw new Error('Failed to fetch calendar activities: ' + error.message);
      }
    },
  },

  Mutation: {
    // GsEmployee mutations using Prisma
    createGsEmployee: async (_, { input }, { prisma }) => {
      try {
        const employee = await prisma.gsEmployees.create({
          data: {
            firstName: input.FirstName,
            lastName: input.LastName,
            email: input.Email,
            dateAdded: new Date(),
            gsDeptID: 1 // Default department ID - you may want to make this configurable
          }
        });
        return employee;
      } catch (error) {
        throw new Error(`Failed to create gsEmployee: ${error.message}`);
      }
    },

    updateGsEmployee: async (_, { gsEmployeesId, input }, { prisma }) => {
      try {
        const updateData = {};
        if (input.FirstName !== undefined) updateData.firstName = input.FirstName;
        if (input.LastName !== undefined) updateData.lastName = input.LastName;
        if (input.Email !== undefined) updateData.email = input.Email;

        const employee = await prisma.gsEmployees.update({
          where: {
            gsEmployeesID: parseInt(gsEmployeesId)
          },
          data: updateData
        });
        return employee;
      } catch (error) {
        throw new Error(`Failed to update gsEmployee: ${error.message}`);
      }
    },

    deleteGsEmployee: async (_, { gsEmployeesId }, { prisma }) => {
      try {
        await prisma.gsEmployees.delete({
          where: {
            gsEmployeesID: parseInt(gsEmployeesId)
          }
        });
        return true;
      } catch (error) {
        throw new Error(`Failed to delete gsEmployee: ${error.message}`);
      }
    },

    // gsPublications mutations using Prisma (essential fields only)
    createGsPublication: async (_, { input }, { prisma }) => {
      try {
        const publication = await prisma.gsPublications.create({
          data: {
            PubName: input.PubName,
            PubAbbrev: input.PubAbbrev,
            IssueSet: input.IssueSet,
            SubProductTypeID: input.SubProductTypeID,
            IsActive: input.IsActive !== undefined ? input.IsActive : true,
            CreatedOn: new Date()
          }
        });
        return publication;
      } catch (error) {
        throw new Error(`Failed to create gsPublication: ${error.message}`);
      }
    },

    updateGsPublication: async (_, { gsPublicationID, input }, { prisma }) => {
      try {
        const updateData = {};
        if (input.PubName !== undefined) updateData.PubName = input.PubName;
        if (input.PubAbbrev !== undefined) updateData.PubAbbrev = input.PubAbbrev;
        if (input.IssueSet !== undefined) updateData.IssueSet = input.IssueSet;
        if (input.SubProductTypeID !== undefined) updateData.SubProductTypeID = input.SubProductTypeID;
        if (input.IsActive !== undefined) updateData.IsActive = input.IsActive;
        
        updateData.UpdatedOn = new Date();

        const publication = await prisma.gsPublications.update({
          where: {
            gsPublicationID: parseInt(gsPublicationID)
          },
          data: updateData
        });
        return publication;
      } catch (error) {
        throw new Error(`Failed to update gsPublication: ${error.message}`);
      }
    },

    deleteGsPublication: async (_, { gsPublicationID }, { prisma }) => {
      try {
        await prisma.gsPublications.delete({
          where: {
            gsPublicationID: parseInt(gsPublicationID)
          }
        });
        return true;
      } catch (error) {
        throw new Error(`Failed to delete gsPublication: ${error.message}`);
      }
    },

    toggleGsPublicationStatus: async (_, { gsPublicationID }, { prisma }) => {
      try {
        // First get the current status
        const currentPublication = await prisma.gsPublications.findUnique({
          where: {
            gsPublicationID: parseInt(gsPublicationID)
          }
        });

        if (!currentPublication) {
          throw new Error('Publication not found');
        }

        // Toggle the status
        const publication = await prisma.gsPublications.update({
          where: {
            gsPublicationID: parseInt(gsPublicationID)
          },
          data: {
            IsActive: !currentPublication.IsActive,
            UpdatedOn: new Date()
          }
        });
        return publication;
      } catch (error) {
        throw new Error(`Failed to toggle gsPublication status: ${error.message}`);
      }
    },

    // Order mutations using gsContracts backend (essential fields only)
    createOrder: async (_, { input }, { prisma }) => {
      try {
        const contract = await prisma.gsContracts.create({
          data: {
            CustomerID: input.CustomerID,
            Yr: input.Yr,
            Mnth: input.Mnth,
            PubID: input.PubID,
            Net: input.Net,
            RepIDs: input.RepIDs,
            Description: input.Description,
            DateAdded: new Date()
          }
        });
        return contract;
      } catch (error) {
        throw new Error(`Failed to create order: ${error.message}`);
      }
    },

    updateOrder: async (_, { OrderId, input }, { prisma }) => {
      try {
        const updateData = {};
        if (input.CustomerID !== undefined) updateData.CustomerID = input.CustomerID;
        if (input.Yr !== undefined) updateData.Yr = input.Yr;
        if (input.Mnth !== undefined) updateData.Mnth = input.Mnth;
        if (input.PubID !== undefined) updateData.PubID = input.PubID;
        if (input.Net !== undefined) updateData.Net = input.Net;
        if (input.RepIDs !== undefined) updateData.RepIDs = input.RepIDs;
        if (input.Description !== undefined) updateData.Description = input.Description;
        
        updateData.DateModified = new Date();

        const contract = await prisma.gsContracts.update({
          where: {
            gsContractsID: parseInt(OrderId)
          },
          data: updateData
        });
        return contract;
      } catch (error) {
        throw new Error(`Failed to update order: ${error.message}`);
      }
    },

    deleteOrder: async (_, { OrderId }, { prisma }) => {
      try {
        await prisma.gsContracts.delete({
          where: {
            gsContractsID: parseInt(OrderId)
          }
        });
        return true;
      } catch (error) {
        throw new Error(`Failed to delete order: ${error.message}`);
      }
    },
  },

  // Field resolvers for complex relationships and field mapping
  gsEmployees: {
    gsEmployeesId: (parent) => parent.gsEmployeesID,
    FirstName: (parent) => parent.firstName,
    LastName: (parent) => parent.lastName,
    Email: (parent) => parent.email,
    Dateadded: (parent) => parent.dateAdded ? parent.dateAdded.toISOString() : null,
  },

  Order: {
    // Map gsContracts fields to Order UI fields (essential fields only)
    OrderId: (parent) => parent.gsContractsID,
    CustomerID: (parent) => parent.CustomerID,
    Yr: (parent) => parent.Yr,
    Mnth: (parent) => parent.Mnth,
    PubID: (parent) => parent.PubID,
    Net: (parent) => parent.Net ? parseFloat(parent.Net) : null,
    DateAdded: (parent) => parent.DateAdded ? parent.DateAdded.toISOString() : null,
    RepIDs: (parent) => parent.RepIDs,
    Description: (parent) => parent.Description,

    // Resolve related publication
    publication: async (parent, _, { prisma }) => {
      if (!parent.PubID) return null;
      try {
        const publication = await prisma.gsPublications.findUnique({
          where: {
            gsPublicationID: parent.PubID
          },
          select: {
            gsPublicationID: true,
            PubName: true,
            PubAbbrev: true,
            IssueSet: true,
            SubProductTypeID: true,
            IsActive: true
          }
        });
        return publication;
      } catch (error) {
        console.error('Error fetching order publication:', error);
        return null;
      }
    },

    // Resolve representatives from comma-separated RepIDs
    representatives: async (parent, _, { prisma }) => {
      if (!parent.RepIDs) return [];
      try {
        const repIds = parent.RepIDs.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        if (repIds.length === 0) return [];

        const representatives = await prisma.gsEmployees.findMany({
          where: {
            gsEmployeesID: {
              in: repIds
            }
          }
        });
        return representatives;
      } catch (error) {
        console.error('Error fetching order representatives:', error);
        return [];
      }
    },
  },

  // Union Type Resolvers for Calendar Activities
  CalendarActivity: {
    __resolveType(obj) {
      // Determine the specific type based on __typename
      return obj.__typename;
    },
  },

  // Field resolvers for Employee type
  Employee: {
    id: (parent) => parent.id,
    firstName: (parent) => parent.firstName || parent.FirstName,
    lastName: (parent) => parent.lastName || parent.LastName,
    fullName: (parent) => {
      const first = parent.firstName || parent.FirstName || '';
      const last = parent.lastName || parent.LastName || '';
      return `${first} ${last}`.trim();
    },
    isAdmin: (parent) => parent.isAdmin || false,
  },

  // Field resolvers for Customer type
  Customer: {
    id: (parent) => parent.id,
    customer: (parent) => parent.customer || parent.Customer || '',
    firstName: (parent) => parent.firstName || parent.FirstName,
    lastName: (parent) => parent.lastName || parent.LastName,
    parentID: (parent) => parent.parentID || parent.ParentID,
    isCompany: (parent) => parent.isCompany || parent.IsCompany || false,
  },
};

module.exports = resolvers; 