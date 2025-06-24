const { getPool, sql } = require('./database');

// Hybrid Prisma-like client that uses your working database connection
class HybridPrismaClient {
  constructor() {
    this.gsemployees = new GsEmployeesModel();
    this.gsPublications = new GsPublicationsModel();
  }
  
  async $connect() {
    // Uses your existing working connection
    return true;
  }
  
  async $disconnect() {
    // Your connection pool handles this
    return true;
  }
  
  async $queryRaw(query, ...params) {
    const pool = await getPool();
    const result = await pool.request().query(query);
    return result.recordset;
  }
  
  async $transaction(callback) {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

// gsEmployees model with Prisma-like methods
class GsEmployeesModel {
  // Map GraphQL field names to actual database field names
  mapToGraphQL(dbRecord) {
    if (!dbRecord) return null;
    
    return {
      gsEmployeesId: dbRecord.gsEmployeesID,
      FirstName: dbRecord.firstName,
      LastName: dbRecord.lastName,
      Email: dbRecord.email,
      Dateadded: dbRecord.dateAdded
    };
  }

  async findMany(options = {}) {
    const pool = await getPool();
    let query = 'SELECT ';
    
    // Handle TOP clause first (SQL Server requires TOP at the beginning)
    if (options.take) {
      query += `TOP ${options.take} `;
    }
    
    query += 'gsEmployeesID, firstName, lastName, email, dateAdded FROM gsemployees';
    
    if (options.where) {
      const conditions = [];
      const request = pool.request();
      
      Object.entries(options.where).forEach(([key, value], index) => {
        // Map GraphQL field names to DB field names
        let dbField = key;
        if (key === 'gsEmployeesId') dbField = 'gsEmployeesID';
        if (key === 'FirstName') dbField = 'firstName';
        if (key === 'LastName') dbField = 'lastName';
        if (key === 'Email') dbField = 'email';
        if (key === 'Dateadded') dbField = 'dateAdded';
        
        conditions.push(`${dbField} = @param${index}`);
        request.input(`param${index}`, value);
      });
      
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }
    }
    
    if (options.orderBy) {
      const orderClauses = [];
      Object.entries(options.orderBy).forEach(([column, direction]) => {
        // Map GraphQL field names to DB field names
        let dbField = column;
        if (column === 'gsEmployeesId') dbField = 'gsEmployeesID';
        if (column === 'FirstName') dbField = 'firstName';
        if (column === 'LastName') dbField = 'lastName';
        if (column === 'Email') dbField = 'email';
        if (column === 'Dateadded') dbField = 'dateAdded';
        
        orderClauses.push(`${dbField} ${direction.toUpperCase()}`);
      });
      query += ` ORDER BY ${orderClauses.join(', ')}`;
    }
    
    const result = await pool.request().query(query);
    return result.recordset.map(record => this.mapToGraphQL(record));
  }
  
  async findUnique(options) {
    const pool = await getPool();
    const request = pool.request();
    
    const conditions = [];
    Object.entries(options.where).forEach(([key, value], index) => {
      // Map GraphQL field names to DB field names
      let dbField = key;
      if (key === 'gsEmployeesId') dbField = 'gsEmployeesID';
      if (key === 'FirstName') dbField = 'firstName';
      if (key === 'LastName') dbField = 'lastName';
      if (key === 'Email') dbField = 'email';
      if (key === 'Dateadded') dbField = 'dateAdded';
      
      conditions.push(`${dbField} = @param${index}`);
      request.input(`param${index}`, value);
    });
    
    const query = `SELECT TOP 1 gsEmployeesID, firstName, lastName, email, dateAdded FROM gsemployees WHERE ${conditions.join(' AND ')}`;
    const result = await request.query(query);
    return this.mapToGraphQL(result.recordset[0]);
  }
  
  async create(options) {
    const pool = await getPool();
    const request = pool.request();
    
    // Map GraphQL field names to DB field names
    const dbData = {};
    if (options.data.FirstName !== undefined) dbData.firstName = options.data.FirstName;
    if (options.data.LastName !== undefined) dbData.lastName = options.data.LastName;
    if (options.data.Email !== undefined) dbData.email = options.data.Email;
    if (options.data.Dateadded !== undefined) dbData.dateAdded = options.data.Dateadded;
    
    const fields = Object.keys(dbData);
    const values = Object.values(dbData);
    
    fields.forEach((field, index) => {
      request.input(`param${index}`, values[index]);
    });
    
    const placeholders = fields.map((_, index) => `@param${index}`).join(', ');
    const query = `
      INSERT INTO gsemployees (${fields.join(', ')}) 
      OUTPUT INSERTED.gsEmployeesID, INSERTED.firstName, INSERTED.lastName, INSERTED.email, INSERTED.dateAdded
      VALUES (${placeholders})
    `;
    
    const result = await request.query(query);
    return this.mapToGraphQL(result.recordset[0]);
  }
  
  async update(options) {
    const pool = await getPool();
    const request = pool.request();
    
    // Where conditions - map GraphQL to DB field names
    const whereConditions = [];
    Object.entries(options.where).forEach(([key, value], index) => {
      let dbField = key;
      if (key === 'gsEmployeesId') dbField = 'gsEmployeesID';
      if (key === 'FirstName') dbField = 'firstName';
      if (key === 'LastName') dbField = 'lastName';
      if (key === 'Email') dbField = 'email';
      if (key === 'Dateadded') dbField = 'dateAdded';
      
      whereConditions.push(`${dbField} = @where${index}`);
      request.input(`where${index}`, value);
    });
    
    // Update data - map GraphQL to DB field names
    const updateFields = [];
    Object.entries(options.data).forEach(([key, value], index) => {
      let dbField = key;
      if (key === 'FirstName') dbField = 'firstName';
      if (key === 'LastName') dbField = 'lastName';
      if (key === 'Email') dbField = 'email';
      if (key === 'Dateadded') dbField = 'dateAdded';
      
      updateFields.push(`${dbField} = @data${index}`);
      request.input(`data${index}`, value);
    });
    
    const query = `
      UPDATE gsemployees 
      SET ${updateFields.join(', ')} 
      OUTPUT INSERTED.gsEmployeesID, INSERTED.firstName, INSERTED.lastName, INSERTED.email, INSERTED.dateAdded
      WHERE ${whereConditions.join(' AND ')}
    `;
    
    const result = await request.query(query);
    return this.mapToGraphQL(result.recordset[0]);
  }
  
  async delete(options) {
    const pool = await getPool();
    const request = pool.request();
    
    const conditions = [];
    Object.entries(options.where).forEach(([key, value], index) => {
      let dbField = key;
      if (key === 'gsEmployeesId') dbField = 'gsEmployeesID';
      if (key === 'FirstName') dbField = 'firstName';
      if (key === 'LastName') dbField = 'lastName';
      if (key === 'Email') dbField = 'email';
      if (key === 'Dateadded') dbField = 'dateAdded';
      
      conditions.push(`${dbField} = @param${index}`);
      request.input(`param${index}`, value);
    });
    
    const query = `DELETE FROM gsemployees WHERE ${conditions.join(' AND ')}`;
    await request.query(query);
    return true;
  }
}

// gsPublications model with Prisma-like methods
class GsPublicationsModel {
  // Map GraphQL field names to actual database field names
  mapToGraphQL(dbRecord) {
    if (!dbRecord) return null;
    
    return {
      gsPublicationID: dbRecord.gsPublicationID,
      PubName: dbRecord.PubName,
      PubAbbrev: dbRecord.PubAbbrev,
      IssueSet: dbRecord.IssueSet,
      SubProductTypeId: dbRecord.SubProductTypeId,
      isActive: Boolean(dbRecord.isActive)
    };
  }

  async findMany(options = {}) {
    const pool = await getPool();
    let query = 'SELECT ';
    
    // Handle TOP clause first (SQL Server requires TOP at the beginning)
    if (options.take) {
      query += `TOP ${options.take} `;
    }
    
    query += 'gsPublicationID, PubName, PubAbbrev, IssueSet, SubProductTypeId, isActive FROM gsPublications';
    
    if (options.where) {
      const conditions = [];
      const request = pool.request();
      
      Object.entries(options.where).forEach(([key, value], index) => {
        conditions.push(`${key} = @param${index}`);
        request.input(`param${index}`, value);
      });
      
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }
    }
    
    if (options.orderBy) {
      const orderClauses = [];
      Object.entries(options.orderBy).forEach(([column, direction]) => {
        orderClauses.push(`${column} ${direction.toUpperCase()}`);
      });
      query += ` ORDER BY ${orderClauses.join(', ')}`;
    }
    
    const result = await pool.request().query(query);
    return result.recordset.map(record => this.mapToGraphQL(record));
  }
  
  async findUnique(options) {
    const pool = await getPool();
    const request = pool.request();
    
    const conditions = [];
    Object.entries(options.where).forEach(([key, value], index) => {
      conditions.push(`${key} = @param${index}`);
      request.input(`param${index}`, value);
    });
    
    const query = `SELECT TOP 1 gsPublicationID, PubName, PubAbbrev, IssueSet, SubProductTypeId, isActive FROM gsPublications WHERE ${conditions.join(' AND ')}`;
    const result = await request.query(query);
    return this.mapToGraphQL(result.recordset[0]);
  }
  
  async create(options) {
    const pool = await getPool();
    const request = pool.request();
    
    // Convert boolean to bit for database storage
    const dbData = { ...options.data };
    if (dbData.isActive !== undefined) {
      dbData.isActive = dbData.isActive ? 1 : 0;
    }
    
    const fields = Object.keys(dbData);
    const values = Object.values(dbData);
    
    fields.forEach((field, index) => {
      request.input(`param${index}`, values[index]);
    });
    
    const placeholders = fields.map((_, index) => `@param${index}`).join(', ');
    const query = `
      INSERT INTO gsPublications (${fields.join(', ')}) 
      OUTPUT INSERTED.gsPublicationID, INSERTED.PubName, INSERTED.PubAbbrev, INSERTED.IssueSet, INSERTED.SubProductTypeId, INSERTED.isActive
      VALUES (${placeholders})
    `;
    
    const result = await request.query(query);
    return this.mapToGraphQL(result.recordset[0]);
  }
  
  async update(options) {
    const pool = await getPool();
    const request = pool.request();
    
    // Where conditions
    const whereConditions = [];
    Object.entries(options.where).forEach(([key, value], index) => {
      whereConditions.push(`${key} = @where${index}`);
      request.input(`where${index}`, value);
    });
    
    // Update data - convert boolean to bit for database storage
    const updateFields = [];
    Object.entries(options.data).forEach(([key, value], index) => {
      // Convert boolean to bit for isActive field
      const dbValue = key === 'isActive' && typeof value === 'boolean' ? (value ? 1 : 0) : value;
      updateFields.push(`${key} = @data${index}`);
      request.input(`data${index}`, dbValue);
    });
    
    const query = `
      UPDATE gsPublications 
      SET ${updateFields.join(', ')} 
      OUTPUT INSERTED.gsPublicationID, INSERTED.PubName, INSERTED.PubAbbrev, INSERTED.IssueSet, INSERTED.SubProductTypeId, INSERTED.isActive
      WHERE ${whereConditions.join(' AND ')}
    `;
    
    const result = await request.query(query);
    return this.mapToGraphQL(result.recordset[0]);
  }
  
  async delete(options) {
    const pool = await getPool();
    const request = pool.request();
    
    const conditions = [];
    Object.entries(options.where).forEach(([key, value], index) => {
      conditions.push(`${key} = @param${index}`);
      request.input(`param${index}`, value);
    });
    
    const query = `DELETE FROM gsPublications WHERE ${conditions.join(' AND ')}`;
    await request.query(query);
    return true;
  }
}

// Create singleton instance
const hybridPrisma = new HybridPrismaClient();

module.exports = {
  hybridPrisma,
  connectHybridPrisma: async () => {
    console.log('✅ Hybrid Prisma client ready - using your working database connection');
    console.log('✅ Database: Tier1Feature26 on 18.219.203.64:56321');
    return true;
  },
  disconnectHybridPrisma: async () => {
    console.log('🔌 Hybrid Prisma client disconnected');
    return true;
  }
}; 