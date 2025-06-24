const { sql, getPool } = require('./database');

const resolvers = {
  Query: {
    // GsEmployee queries
    gsEmployees: async () => {
      try {
        const pool = await getPool();
        const result = await pool.request().query('SELECT gsEmployeesId, FirstName, LastName, Email, Dateadded FROM gsemployees where gsEmployeesId > 1 and DateAdded is not null');
        console.log(result);
        return result.recordset;
      } catch (error) {
        throw new Error(`Failed to fetch gsEmployees: ${error.message}`);
      }
    },

    gsEmployee: async (_, { gsEmployeesId }) => {
      try {
        const pool = await getPool();
        const result = await pool.request()
          .input('gsEmployeesId', sql.Int, gsEmployeesId)
          .query('SELECT * FROM gsemployees WHERE gsEmployeesId = @gsEmployeesId');
        return result.recordset[0];
      } catch (error) {
        throw new Error(`Failed to fetch gsEmployee: ${error.message}`);
      }
    },

    // Product queries
    products: async () => {
      try {
        const pool = await getPool();
        const result = await pool.request().query('SELECT * FROM Products ORDER BY createdAt DESC');
        return result.recordset;
      } catch (error) {
        throw new Error(`Failed to fetch products: ${error.message}`);
      }
    },

    product: async (_, { id }) => {
      try {
        const pool = await getPool();
        const result = await pool.request()
          .input('id', sql.Int, id)
          .query('SELECT * FROM Products WHERE id = @id');
        return result.recordset[0];
      } catch (error) {
        throw new Error(`Failed to fetch product: ${error.message}`);
      }
    },

    productsByCategory: async (_, { category }) => {
      try {
        const pool = await getPool();
        const result = await pool.request()
          .input('category', sql.NVarChar, category)
          .query('SELECT * FROM Products WHERE category = @category ORDER BY createdAt DESC');
        return result.recordset;
      } catch (error) {
        throw new Error(`Failed to fetch products by category: ${error.message}`);
      }
    },

    // Order queries
    orders: async () => {
      try {
        const pool = await getPool();
        const result = await pool.request().query(`
          SELECT o.*, u.FirstName, u.LastName, u.Email 
          FROM Orders o 
          JOIN gsemployees u ON o.userId = u.gsEmployeesId 
          ORDER BY o.createdAt DESC
        `);
        return result.recordset;
      } catch (error) {
        throw new Error(`Failed to fetch orders: ${error.message}`);
      }
    },

    order: async (_, { id }) => {
      try {
        const pool = await getPool();
        const result = await pool.request()
          .input('id', sql.Int, id)
          .query(`
            SELECT o.*, u.FirstName, u.LastName, u.Email 
            FROM Orders o 
            JOIN gsemployees u ON o.userId = u.gsEmployeesId 
            WHERE o.id = @id
          `);
        return result.recordset[0];
      } catch (error) {
        throw new Error(`Failed to fetch order: ${error.message}`);
      }
    },

    ordersByUser: async (_, { userId }) => {
      try {
        const pool = await getPool();
        const result = await pool.request()
          .input('userId', sql.Int, userId)
          .query(`
            SELECT o.*, u.FirstName, u.LastName, u.Email 
            FROM Orders o 
            JOIN gsemployees u ON o.userId = u.gsEmployeesId 
            WHERE o.userId = @userId 
            ORDER BY o.createdAt DESC
          `);
        return result.recordset;
      } catch (error) {
        throw new Error(`Failed to fetch orders by user: ${error.message}`);
      }
    },
  },

  Mutation: {
    // GsEmployee mutations
    createGsEmployee: async (_, { input }) => {
      try {
        const pool = await getPool();
        const result = await pool.request()
          .input('FirstName', sql.NVarChar, input.FirstName)
          .input('LastName', sql.NVarChar, input.LastName)
          .input('Email', sql.NVarChar, input.Email)
          .query(`
            INSERT INTO gsemployees (FirstName, LastName, Email, Dateadded) 
            OUTPUT INSERTED.* 
            VALUES (@FirstName, @LastName, @Email, GETDATE())
          `);
        return result.recordset[0];
      } catch (error) {
        throw new Error(`Failed to create gsEmployee: ${error.message}`);
      }
    },

    updateGsEmployee: async (_, { gsEmployeesId, input }) => {
      try {
        const pool = await getPool();
        const updateFields = [];
        const request = pool.request().input('gsEmployeesId', sql.Int, gsEmployeesId);

        if (input.FirstName !== undefined) {
          updateFields.push('FirstName = @FirstName');
          request.input('FirstName', sql.NVarChar, input.FirstName);
        }
        if (input.LastName !== undefined) {
          updateFields.push('LastName = @LastName');
          request.input('LastName', sql.NVarChar, input.LastName);
        }
        if (input.Email !== undefined) {
          updateFields.push('Email = @Email');
          request.input('Email', sql.NVarChar, input.Email);
        }

        const result = await request.query(`
          UPDATE gsemployees 
          SET ${updateFields.join(', ')} 
          OUTPUT INSERTED.* 
          WHERE gsEmployeesId = @gsEmployeesId
        `);
        return result.recordset[0];
      } catch (error) {
        throw new Error(`Failed to update gsEmployee: ${error.message}`);
      }
    },

    deleteGsEmployee: async (_, { gsEmployeesId }) => {
      try {
        const pool = await getPool();
        const result = await pool.request()
          .input('gsEmployeesId', sql.Int, gsEmployeesId)
          .query('DELETE FROM gsemployees WHERE gsEmployeesId = @gsEmployeesId');
        return result.rowsAffected[0] > 0;
      } catch (error) {
        throw new Error(`Failed to delete gsEmployee: ${error.message}`);
      }
    },

    // Product mutations
    createProduct: async (_, { input }) => {
      try {
        const pool = await getPool();
        const result = await pool.request()
          .input('name', sql.NVarChar, input.name)
          .input('description', sql.NVarChar, input.description)
          .input('price', sql.Float, input.price)
          .input('category', sql.NVarChar, input.category)
          .input('stock', sql.Int, input.stock)
          .query(`
            INSERT INTO Products (name, description, price, category, stock, createdAt) 
            OUTPUT INSERTED.* 
            VALUES (@name, @description, @price, @category, @stock, GETDATE())
          `);
        return result.recordset[0];
      } catch (error) {
        throw new Error(`Failed to create product: ${error.message}`);
      }
    },

    updateProduct: async (_, { id, input }) => {
      try {
        const pool = await getPool();
        const updateFields = [];
        const request = pool.request().input('id', sql.Int, id);

        if (input.name !== undefined) {
          updateFields.push('name = @name');
          request.input('name', sql.NVarChar, input.name);
        }
        if (input.description !== undefined) {
          updateFields.push('description = @description');
          request.input('description', sql.NVarChar, input.description);
        }
        if (input.price !== undefined) {
          updateFields.push('price = @price');
          request.input('price', sql.Float, input.price);
        }
        if (input.category !== undefined) {
          updateFields.push('category = @category');
          request.input('category', sql.NVarChar, input.category);
        }
        if (input.stock !== undefined) {
          updateFields.push('stock = @stock');
          request.input('stock', sql.Int, input.stock);
        }

        const result = await request.query(`
          UPDATE Products 
          SET ${updateFields.join(', ')} 
          OUTPUT INSERTED.* 
          WHERE id = @id
        `);
        return result.recordset[0];
      } catch (error) {
        throw new Error(`Failed to update product: ${error.message}`);
      }
    },

    deleteProduct: async (_, { id }) => {
      try {
        const pool = await getPool();
        const result = await pool.request()
          .input('id', sql.Int, id)
          .query('DELETE FROM Products WHERE id = @id');
        return result.rowsAffected[0] > 0;
      } catch (error) {
        throw new Error(`Failed to delete product: ${error.message}`);
      }
    },

    // Order mutations
    createOrder: async (_, { input }) => {
      try {
        const pool = await getPool();
        const transaction = new sql.Transaction(pool);
        
        await transaction.begin();
        
        try {
          // Calculate total
          let total = 0;
          const orderItems = [];
          
          for (const item of input.products) {
            const productResult = await transaction.request()
              .input('productId', sql.Int, item.productId)
              .query('SELECT price FROM Products WHERE id = @productId');
            
            if (productResult.recordset.length === 0) {
              throw new Error(`Product with id ${item.productId} not found`);
            }
            
            const price = productResult.recordset[0].price;
            const itemTotal = price * item.quantity;
            total += itemTotal;
            
            orderItems.push({
              productId: item.productId,
              quantity: item.quantity,
              price: price
            });
          }
          
          // Create order
          const orderResult = await transaction.request()
            .input('userId', sql.Int, input.userId)
            .input('total', sql.Float, total)
            .query(`
              INSERT INTO Orders (userId, total, status, createdAt) 
              OUTPUT INSERTED.* 
              VALUES (@userId, @total, 'pending', GETDATE())
            `);
          
          const order = orderResult.recordset[0];
          
          // Create order items
          for (const item of orderItems) {
            await transaction.request()
              .input('orderId', sql.Int, order.id)
              .input('productId', sql.Int, item.productId)
              .input('quantity', sql.Int, item.quantity)
              .input('price', sql.Float, item.price)
              .query(`
                INSERT INTO OrderItems (orderId, productId, quantity, price) 
                VALUES (@orderId, @productId, @quantity, @price)
              `);
          }
          
          await transaction.commit();
          return order;
        } catch (error) {
          await transaction.rollback();
          throw error;
        }
      } catch (error) {
        throw new Error(`Failed to create order: ${error.message}`);
      }
    },

    updateOrderStatus: async (_, { id, status }) => {
      try {
        const pool = await getPool();
        const result = await pool.request()
          .input('id', sql.Int, id)
          .input('status', sql.NVarChar, status)
          .query(`
            UPDATE Orders 
            SET status = @status 
            OUTPUT INSERTED.* 
            WHERE id = @id
          `);
        return result.recordset[0];
      } catch (error) {
        throw new Error(`Failed to update order status: ${error.message}`);
      }
    },

    deleteOrder: async (_, { id }) => {
      try {
        const pool = await getPool();
        const transaction = new sql.Transaction(pool);
        
        await transaction.begin();
        
        try {
          // Delete order items first
          await transaction.request()
            .input('orderId', sql.Int, id)
            .query('DELETE FROM OrderItems WHERE orderId = @orderId');
          
          // Delete order
          const result = await transaction.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Orders WHERE id = @id');
          
          await transaction.commit();
          return result.rowsAffected[0] > 0;
        } catch (error) {
          await transaction.rollback();
          throw error;
        }
      } catch (error) {
        throw new Error(`Failed to delete order: ${error.message}`);
      }
    },
  },

  // Nested resolvers
  Order: {
    user: async (parent) => {
      try {
        const pool = await getPool();
        const result = await pool.request()
          .input('userId', sql.Int, parent.userId)
          .query('SELECT * FROM gsemployees WHERE gsEmployeesId = @userId');
        return result.recordset[0];
      } catch (error) {
        throw new Error(`Failed to fetch order user: ${error.message}`);
      }
    },

    products: async (parent) => {
      try {
        const pool = await getPool();
        const result = await pool.request()
          .input('orderId', sql.Int, parent.id)
          .query(`
            SELECT oi.*, p.name as productName, p.description as productDescription 
            FROM OrderItems oi 
            JOIN Products p ON oi.productId = p.id 
            WHERE oi.orderId = @orderId
          `);
        return result.recordset;
      } catch (error) {
        throw new Error(`Failed to fetch order products: ${error.message}`);
      }
    },
  },

  OrderItem: {
    product: async (parent) => {
      try {
        const pool = await getPool();
        const result = await pool.request()
          .input('productId', sql.Int, parent.productId)
          .query('SELECT * FROM Products WHERE id = @productId');
        return result.recordset[0];
      } catch (error) {
        throw new Error(`Failed to fetch order item product: ${error.message}`);
      }
    },
  },
};

module.exports = resolvers;