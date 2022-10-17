// Imports ---------------------------------------
import express from 'express';
import database from './database.js';

// Configure express app -------------------------
const app = new express();

// Configure middleware --------------------------

// Controllers -----------------------------------
const modulesController = async (req, res) => {
  const id = req.params.id; // Undefined in the case of the /api/modules endpoint
  // Build SQL
  const table = '(Modules LEFT JOIN Users ON Modules.ModuleLeaderID=Users.UserID)';
  const whereField = 'ModuleID';
  const fields = ['ModuleID', 'ModuleName', 'ModuleCode', 'ModuleLevel', 'ModuleYearID', 'ModuleLeaderID', 'ModuleImageURL', 'CONCAT(UserFirstname," ",UserLastname) AS ModuleLeaderName'];
  const extendedTable = `${table}`;
  const extendedFields = `${fields}`;
  let sql = `SELECT ${extendedFields} FROM ${extendedTable}`;
  if (id) sql += ` WHERE ${whereField}=${id}`;
  // Execute query
  let isSuccess = false;
  let message = "";
  let result = null;
  try {
    [result] = await database.query(sql);
    if (result.length === 0) message = 'No record(s) found';
    else {
      isSuccess = true;
      message = 'Record(s) successfully recovered';
    }
  }
  catch (error) {
    message = `Failed to execute query: ${error.message}`;
  }
  // Responses
  isSuccess
    ? res.status(200).json(result)
    : res.status(400).json({ message });
};

const modulesOfLeaderController = async (req, res) => {
  const id = req.params.id; 
  // Build SQL
  const table = '(Modules LEFT JOIN Users ON Modules.ModuleLeaderID=Users.UserID)';
  const whereField = 'ModuleLeaderID';
  const fields = ['ModuleID', 'ModuleName', 'ModuleCode', 'ModuleLevel', 'ModuleYearID', 'ModuleLeaderID', 'ModuleImageURL', 'CONCAT(UserFirstname," ",UserLastname) AS ModuleLeaderName'];
  const extendedTable = `${table}`;
  const extendedFields = `${fields}`;
  const sql = `SELECT ${extendedFields} FROM ${extendedTable} WHERE ${whereField}=${id}`;
  // Execute query
  let isSuccess = false;
  let message = "";
  let result = null;
  try {
    [result] = await database.query(sql);
    if (result.length === 0) message = 'No record(s) found';
    else {
      isSuccess = true;
      message = 'Record(s) successfully recovered';
    }
  }
  catch (error) {
    message = `Failed to execute query: ${error.message}`;
  }
  // Responses
  isSuccess
    ? res.status(200).json(result)
    : res.status(400).json({ message });
};

const modulesOfUserController = async (req, res) => {
  const id = req.params.id; 
  // Build SQL
  const table = '(Modules LEFT JOIN Users ON Modules.ModuleLeaderID=Users.UserID)';
  const whereField = 'Modulemembers.ModulememberUserID';
  const fields = ['ModuleID', 'ModuleName', 'ModuleCode', 'ModuleLevel', 'ModuleYearID', 'ModuleLeaderID', 'ModuleImageURL', 'CONCAT(UserFirstname," ",UserLastname) AS ModuleLeaderName'];
  const extendedTable = `Modulemembers INNER JOIN ${table} ON Modulemembers.ModulememberModuleID=Modules.ModuleID`;
  const extendedFields = `${fields}`;
  const sql = `SELECT ${extendedFields} FROM ${extendedTable} WHERE ${whereField}=${id}`;
  // Execute query
  let isSuccess = false;
  let message = "";
  let result = null;
  try {
    [result] = await database.query(sql);
    if (result.length === 0) message = 'No record(s) found';
    else {
      isSuccess = true;
      message = 'Record(s) successfully recovered';
    }
  }
  catch (error) {
    message = `Failed to execute query: ${error.message}`;
  }
  // Responses
  isSuccess
    ? res.status(200).json(result)
    : res.status(400).json({ message });
};

// Endpoints -------------------------------------
app.get('/api/modules', modulesController);
app.get('/api/modules/:id', modulesController);
app.get('/api/modules/leader/:id', modulesOfLeaderController);
app.get('/api/modules/users/:id', modulesOfUserController);


// Start server ----------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log(`Server started on port ${PORT}`));
