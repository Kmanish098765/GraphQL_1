const { prisma } = require('./prisma-client');

const resolvers = {
  Query: {
    // GsEmployee queries using Prisma
    gsEmployees: async () => {
      try {
        const employees = await prisma.gsemployees.findMany({
          orderBy: {
            Dateadded: 'desc'
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
            gsEmployeesId: parseInt(gsEmployeesId)
          }
        });
        return employee;
      } catch (error) {
        throw new Error(`Failed to fetch gsEmployee: ${error.message}`);
      }
    },

    // Product queries (keeping existing structure)
    products: async () => {
      try {
        // Using raw SQL for products since they might not exist in Prisma schema yet
        const products = await prisma.$queryRaw`SELECT * FROM Products ORDER BY createdAt DESC`;
        return products;
      } catch (error) {
        throw new Error(`Failed to fetch products: ${error.message}`);
      }
    },

    product: async (_, { id }) => {
      try {
        const product = await prisma.$queryRaw`SELECT * FROM Products WHERE id = ${parseInt(id)}`;
        return product[0];
      } catch (error) {
        throw new Error(`Failed to fetch product: ${error.message}`);
      }
    },

    productsByCategory: async (_, { category }) => {
      try {
        const products = await prisma.$queryRaw`
          SELECT * FROM Products 
          WHERE category = ${category} 
          ORDER BY createdAt DESC
        `;
        return products;
      } catch (error) {
        throw new Error(`Failed to fetch products by category: ${error.message}`);
      }
    },

    // Order queries (keeping existing structure)
    orders: async () => {
      try {
        const orders = await prisma.$queryRaw`
          SELECT o.*, u.FirstName, u.LastName, u.Email 
          FROM Orders o 
          JOIN gsemployees u ON o.userId = u.gsEmployeesId 
          ORDER BY o.createdAt DESC
        `;
        return orders;
      } catch (error) {
        throw new Error(`Failed to fetch orders: ${error.message}`);
      }
    },

    order: async (_, { id }) => {
      try {
        const order = await prisma.$queryRaw`
          SELECT o.*, u.FirstName, u.LastName, u.Email 
          FROM Orders o 
          JOIN gsemployees u ON o.userId = u.gsEmployeesId 
          WHERE o.id = ${parseInt(id)}
        `;
        return order[0];
      } catch (error) {
        throw new Error(`Failed to fetch order: ${error.message}`);
      }
    },

    ordersByUser: async (_, { userId }) => {
      try {
        const orders = await prisma.$queryRaw`
          SELECT o.*, u.FirstName, u.LastName, u.Email 
          FROM Orders o 
          JOIN gsemployees u ON o.userId = u.gsEmployeesId 
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
            FirstName: input.FirstName,
            LastName: input.LastName,
            Email: input.Email,
            Dateadded: new Date()
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
        if (input.FirstName !== undefined) updateData.FirstName = input.FirstName;
        if (input.LastName !== undefined) updateData.LastName = input.LastName;
        if (input.Email !== undefined) updateData.Email = input.Email;

        const employee = await prisma.gsemployees.update({
          where: {
            gsEmployeesId: parseInt(gsEmployeesId)
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
            gsEmployeesId: parseInt(gsEmployeesId)
          }
        });
        return true;
      } catch (error) {
        throw new Error(`Failed to delete gsEmployee: ${error.message}`);
      }
    },

    // Product mutations (using raw SQL for now)
    createProduct: async (_, { input }) => {
      try {
        const result = await prisma.$queryRaw`
          INSERT INTO Products (name, description, price, category, stock, createdAt) 
          OUTPUT INSERTED.* 
          VALUES (${input.name}, ${input.description}, ${input.price}, ${input.category}, ${input.stock}, GETDATE())
        `;
        return result[0];
      } catch (error) {
        throw new Error(`Failed to create product: ${error.message}`);
      }
    },

    updateProduct: async (_, { id, input }) => {
      try {
        const updateFields = [];
        const params = [parseInt(id)];
        
        if (input.name !== undefined) {
          updateFields.push('name = ?');
          params.unshift(input.name);
        }
        if (input.description !== undefined) {
          updateFields.push('description = ?');
          params.unshift(input.description);
        }
        if (input.price !== undefined) {
          updateFields.push('price = ?');
          params.unshift(input.price);
        }
        if (input.category !== undefined) {
          updateFields.push('category = ?');
          params.unshift(input.category);
        }
        if (input.stock !== undefined) {
          updateFields.push('stock = ?');
          params.unshift(input.stock);
        }

        const result = await prisma.$queryRaw`
          UPDATE Products 
          SET ${updateFields.join(', ')} 
          OUTPUT INSERTED.* 
          WHERE id = ${parseInt(id)}
        `;
        return result[0];
      } catch (error) {
        throw new Error(`Failed to update product: ${error.message}`);
      }
    },

    deleteProduct: async (_, { id }) => {
      try {
        await prisma.$queryRaw`DELETE FROM Products WHERE id = ${parseInt(id)}`;
        return true;
      } catch (error) {
        throw new Error(`Failed to delete product: ${error.message}`);
      }
    },

    // Order mutations (using raw SQL for transactions)
    createOrder: async (_, { input }) => {
      try {
        // Use Prisma transaction
        const result = await prisma.$transaction(async (tx) => {
          // Calculate total
          let total = 0;
          const orderItems = [];
          
          for (const item of input.products) {
            const product = await tx.$queryRaw`SELECT price FROM Products WHERE id = ${parseInt(item.productId)}`;
            
            if (product.length === 0) {
              throw new Error(`Product with id ${item.productId} not found`);
            }
            
            const price = product[0].price;
            const itemTotal = price * item.quantity;
            total += itemTotal;
            
            orderItems.push({
              productId: item.productId,
              quantity: item.quantity,
              price: price
            });
          }
          
          // Create order
          const order = await tx.$queryRaw`
            INSERT INTO Orders (userId, total, status, createdAt) 
            OUTPUT INSERTED.* 
            VALUES (${parseInt(input.userId)}, ${total}, 'pending', GETDATE())
          `;
          
          // Create order items
          for (const item of orderItems) {
            await tx.$queryRaw`
              INSERT INTO OrderItems (orderId, productId, quantity, price) 
              VALUES (${order[0].id}, ${parseInt(item.productId)}, ${item.quantity}, ${item.price})
            `;
          }
          
          return order[0];
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

  // Nested resolvers
  Order: {
    user: async (parent) => {
      try {
        const user = await prisma.gsemployees.findUnique({
          where: {
            gsEmployeesId: parent.userId
          }
        });
        return user;
      } catch (error) {
        throw new Error(`Failed to fetch order user: ${error.message}`);
      }
    },

    products: async (parent) => {
      try {
        const products = await prisma.$queryRaw`
          SELECT oi.*, p.name as productName, p.description as productDescription 
          FROM OrderItems oi 
          JOIN Products p ON oi.productId = p.id 
          WHERE oi.orderId = ${parent.id}
        `;
        return products;
      } catch (error) {
        throw new Error(`Failed to fetch order products: ${error.message}`);
      }
    },
  },

  OrderItem: {
    product: async (parent) => {
      try {
        const product = await prisma.$queryRaw`
          SELECT * FROM Products WHERE id = ${parseInt(parent.productId)}
        `;
        return product[0];
      } catch (error) {
        throw new Error(`Failed to fetch order item product: ${error.message}`);
      }
    },
  },
};

module.exports = resolvers; 