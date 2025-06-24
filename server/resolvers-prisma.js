const { prisma } = require('./prisma-client');

const resolvers = {
  Query: {
    // GsEmployee queries using Prisma
    gsEmployees: async () => {
      try {
        const employees = await prisma.gsemployees.findMany({
          orderBy: {
            dateAdded: 'desc'
          }
        });
        return employees;
      } catch (error) {
        throw new Error(`Failed to fetch gsEmployees: ${error.message}`);
      }
    },

    gsEmployee: async (_, { gsEmployeesId }) => {
      try {
        const employee = await prisma.gsemployees.findUnique({
          where: {
            gsEmployeesID: parseInt(gsEmployeesId)
          }
        });
        return employee;
      } catch (error) {
        throw new Error(`Failed to fetch gsEmployee: ${error.message}`);
      }
    },

    // gsPublications queries using Prisma
    gsPublications: async () => {
      try {
        const publications = await prisma.gsPublications.findMany({
          orderBy: {
            PubName: 'asc'
          }
        });
        return publications;
      } catch (error) {
        throw new Error(`Failed to fetch gsPublications: ${error.message}`);
      }
    },

    gsPublication: async (_, { gsPublicationID }) => {
      try {
        const publication = await prisma.gsPublications.findUnique({
          where: {
            gsPublicationID: parseInt(gsPublicationID)
          }
        });
        return publication;
      } catch (error) {
        throw new Error(`Failed to fetch gsPublication: ${error.message}`);
      }
    },

    gsPublicationsByType: async (_, { SubProductTypeId }) => {
      try {
        const publications = await prisma.gsPublications.findMany({
          where: {
            SubProductTypeId: parseInt(SubProductTypeId)
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

    activeGsPublications: async () => {
      try {
        const publications = await prisma.gsPublications.findMany({
          where: {
            isActive: true
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

    // Order queries using raw SQL (since Orders table structure might be different)
    orders: async () => {
      try {
        const orders = await prisma.$queryRaw`
          SELECT o.*, u.firstName, u.lastName, u.email 
          FROM Orders o 
          JOIN gsemployees u ON o.userId = u.gsEmployeesID 
          ORDER BY o.createdAt DESC
        `;
        return orders;
      } catch (error) {
        throw new Error(`Failed to fetch orders: ${error.message}`);
      }
    },

    order: async (_, { id }) => {
      try {
        const orders = await prisma.$queryRaw`
          SELECT o.*, u.firstName, u.lastName, u.email 
          FROM Orders o 
          JOIN gsemployees u ON o.userId = u.gsEmployeesID 
          WHERE o.id = ${parseInt(id)}
        `;
        return orders[0];
      } catch (error) {
        throw new Error(`Failed to fetch order: ${error.message}`);
      }
    },

    ordersByUser: async (_, { userId }) => {
      try {
        const orders = await prisma.$queryRaw`
          SELECT o.*, u.firstName, u.lastName, u.email 
          FROM Orders o 
          JOIN gsemployees u ON o.userId = u.gsEmployeesID 
          WHERE o.userId = ${parseInt(userId)} 
          ORDER BY o.createdAt DESC
        `;
        return orders;
      } catch (error) {
        throw new Error(`Failed to fetch orders by user: ${error.message}`);
      }
    },
  },

  Mutation: {
    // GsEmployee mutations using Prisma
    createGsEmployee: async (_, { input }) => {
      try {
        const employee = await prisma.gsemployees.create({
          data: {
            firstName: input.FirstName,
            lastName: input.LastName,
            email: input.Email,
            dateAdded: new Date()
          }
        });
        return employee;
      } catch (error) {
        throw new Error(`Failed to create gsEmployee: ${error.message}`);
      }
    },

    updateGsEmployee: async (_, { gsEmployeesId, input }) => {
      try {
        const updateData = {};
        if (input.FirstName !== undefined) updateData.firstName = input.FirstName;
        if (input.LastName !== undefined) updateData.lastName = input.LastName;
        if (input.Email !== undefined) updateData.email = input.Email;

        const employee = await prisma.gsemployees.update({
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

    deleteGsEmployee: async (_, { gsEmployeesId }) => {
      try {
        await prisma.gsemployees.delete({
          where: {
            gsEmployeesID: parseInt(gsEmployeesId)
          }
        });
        return true;
      } catch (error) {
        throw new Error(`Failed to delete gsEmployee: ${error.message}`);
      }
    },

    // gsPublications mutations using Prisma
    createGsPublication: async (_, { input }) => {
      try {
        const publication = await prisma.gsPublications.create({
          data: {
            PubName: input.PubName,
            PubAbbrev: input.PubAbbrev,
            IssueSet: input.IssueSet,
            SubProductTypeId: input.SubProductTypeId,
            isActive: input.isActive !== undefined ? input.isActive : true
          }
        });
        return publication;
      } catch (error) {
        throw new Error(`Failed to create gsPublication: ${error.message}`);
      }
    },

    updateGsPublication: async (_, { gsPublicationID, input }) => {
      try {
        const updateData = {};
        if (input.PubName !== undefined) updateData.PubName = input.PubName;
        if (input.PubAbbrev !== undefined) updateData.PubAbbrev = input.PubAbbrev;
        if (input.IssueSet !== undefined) updateData.IssueSet = input.IssueSet;
        if (input.SubProductTypeId !== undefined) updateData.SubProductTypeId = input.SubProductTypeId;
        if (input.isActive !== undefined) updateData.isActive = input.isActive;

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

    deleteGsPublication: async (_, { gsPublicationID }) => {
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

    toggleGsPublicationStatus: async (_, { gsPublicationID }) => {
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
            isActive: !currentPublication.isActive
          }
        });
        return publication;
      } catch (error) {
        throw new Error(`Failed to toggle gsPublication status: ${error.message}`);
      }
    },

    // Order mutations using transactions and raw SQL
    createOrder: async (_, { input }) => {
      try {
        const result = await prisma.$transaction(async (tx) => {
          // Calculate total
          let total = 0;
          const orderItems = [];
          
          for (const item of input.publications) {
            // Note: Since gsPublications doesn't have price, we'll use a default
            const defaultPrice = 10.00;
            const itemTotal = defaultPrice * item.quantity;
            total += itemTotal;
            
            orderItems.push({
              publicationId: item.publicationId,
              quantity: item.quantity,
              price: defaultPrice
            });
          }
          
          // Create order using raw SQL
          const orders = await tx.$queryRaw`
            INSERT INTO Orders (userId, total, status, createdAt) 
            OUTPUT INSERTED.* 
            VALUES (${parseInt(input.userId)}, ${total}, 'pending', GETDATE())
          `;
          
          const order = orders[0];
          
          // Create order items
          for (const item of orderItems) {
            await tx.$queryRaw`
              INSERT INTO OrderItems (orderId, publicationId, quantity, price) 
              VALUES (${order.id}, ${parseInt(item.publicationId)}, ${item.quantity}, ${item.price})
            `;
          }
          
          return order;
        });
        
        return result;
      } catch (error) {
        throw new Error(`Failed to create order: ${error.message}`);
      }
    },

    updateOrderStatus: async (_, { id, status }) => {
      try {
        const result = await prisma.$queryRaw`
          UPDATE Orders 
          SET status = ${status}
          OUTPUT INSERTED.* 
          WHERE id = ${parseInt(id)}
        `;
        return result[0];
      } catch (error) {
        throw new Error(`Failed to update order status: ${error.message}`);
      }
    },

    deleteOrder: async (_, { id }) => {
      try {
        await prisma.$transaction(async (tx) => {
          // Delete order items first
          await tx.$queryRaw`DELETE FROM OrderItems WHERE orderId = ${parseInt(id)}`;
          
          // Delete order
          await tx.$queryRaw`DELETE FROM Orders WHERE id = ${parseInt(id)}`;
        });
        return true;
      } catch (error) {
        throw new Error(`Failed to delete order: ${error.message}`);
      }
    },
  },

  // Field resolvers to map database field names to GraphQL field names
  gsEmployees: {
    gsEmployeesId: (parent) => parent.gsEmployeesID,
    FirstName: (parent) => parent.firstName,
    LastName: (parent) => parent.lastName,
    Email: (parent) => parent.email,
    Dateadded: (parent) => parent.dateAdded,
  },

  // Nested resolvers
  Order: {
    user: async (parent) => {
      try {
        const user = await prisma.gsemployees.findUnique({
          where: {
            gsEmployeesID: parent.userId
          }
        });
        return user;
      } catch (error) {
        throw new Error(`Failed to fetch order user: ${error.message}`);
      }
    },

    publications: async (parent) => {
      try {
        const publications = await prisma.$queryRaw`
          SELECT oi.*, p.PubName, p.PubAbbrev, p.IssueSet 
          FROM OrderItems oi 
          JOIN gsPublications p ON oi.publicationId = p.gsPublicationID 
          WHERE oi.orderId = ${parent.id}
        `;
        return publications;
      } catch (error) {
        throw new Error(`Failed to fetch order publications: ${error.message}`);
      }
    },
  },

  OrderItem: {
    publication: async (parent) => {
      try {
        const publication = await prisma.gsPublications.findUnique({
          where: {
            gsPublicationID: parseInt(parent.publicationId)
          }
        });
        return publication;
      } catch (error) {
        throw new Error(`Failed to fetch order item publication: ${error.message}`);
      }
    },
  },
};

module.exports = resolvers; 