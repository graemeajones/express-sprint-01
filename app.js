// Imports ---------------------------------------
import express from 'express';
import cors from 'cors';
import database from './database.js';

// Configure express app -------------------------
const app = new express();

// Configure middleware --------------------------
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors({ origin: '*' }));

// Controllers -----------------------------------
const modulesController = async (req, res) => {
  const id = req.params.id; // Undefined in the case of the /api/modules endpoint
  // Build SQL
  const table = '((Modules LEFT JOIN Users ON ModuleLeaderID=UserID) LEFT JOIN Years ON ModuleYearID=YearID )';
  const whereField = 'ModuleID';
  const fields = ['ModuleID', 'ModuleName', 'ModuleCode', 'ModuleLevel', 'ModuleYearID', 'ModuleLeaderID', 'ModuleImageURL', 'CONCAT(UserFirstname," ",UserLastname) AS ModuleLeaderName', 'YearName AS ModuleYearName'];
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
    : res.status(404).json({ message });
}

const modulesOfLeaderController = async (req, res) => {
  const id = req.params.id; 
  // Build SQL
  const table = '((Modules LEFT JOIN Users ON ModuleLeaderID=UserID) LEFT JOIN Years ON ModuleYearID=YearID )';
  const whereField = 'ModuleLeaderID';
  const fields = ['ModuleID', 'ModuleName', 'ModuleCode', 'ModuleLevel', 'ModuleYearID', 'ModuleLeaderID', 'ModuleImageURL', 'CONCAT(UserFirstname," ",UserLastname) AS ModuleLeaderName', 'YearName AS ModuleYearName'];
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
    : res.status(404).json({ message });
}

const modulesOfUsersController = async (req, res) => {
  const id = req.params.id; 
  // Build SQL
  const table = '((Modules LEFT JOIN Users ON ModuleLeaderID=UserID) LEFT JOIN Years ON ModuleYearID=YearID )';
  const whereField = 'ModulememberUserID';
  const fields = ['ModuleID', 'ModuleName', 'ModuleCode', 'ModuleLevel', 'ModuleYearID', 'ModuleLeaderID', 'ModuleImageURL', 'CONCAT(UserFirstname," ",UserLastname) AS ModuleLeaderName', 'YearName AS ModuleYearName'];
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
    : res.status(404).json({ message });
}


const usersController = async (req, res) => {
  const id = req.params.id; // Undefined in the case of the /api/users endpoint
  // Build SQL
  const table = '((Users LEFT JOIN Usertypes ON UserUsertypeID=UsertypeID) LEFT JOIN Years ON UserYearID=YearID )';
  const whereField = 'UserID';
  const fields = ['UserID', 'UserFirstname', 'UserLastname', 'UserEmail', 'UserLevel', 'UserYearID', 'UserUsertypeID', 'UserImageURL', 'UsertypeName AS UserUsertypeName', 'YearName AS UserYearName'];
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
    : res.status(404).json({ message });
}

const usersStudentController = async (req, res) => {
  // Build SQL
  const id = 2; // STUDENT Usertype ID
  const table = '((Users LEFT JOIN Usertypes ON UserUsertypeID=UsertypeID) LEFT JOIN Years ON UserYearID=YearID )';
  const whereField = 'UserUsertypeID';
  const fields = ['UserID', 'UserFirstname', 'UserLastname', 'UserEmail', 'UserLevel', 'UserYearID', 'UserUsertypeID', 'UserImageURL', 'UsertypeName AS UserUsertypeName', 'YearName AS UserYearName'];
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
    : res.status(404).json({ message });
}

const usersStaffController = async (req, res) => {
  // Build SQL
  const id = 1; // STAFF Usertype ID
  const table = '((Users LEFT JOIN Usertypes ON UserUsertypeID=UsertypeID) LEFT JOIN Years ON UserYearID=YearID )';
  const whereField = 'UserUsertypeID';
  const fields = ['UserID', 'UserFirstname', 'UserLastname', 'UserEmail', 'UserLevel', 'UserYearID', 'UserUsertypeID', 'UserImageURL', 'UsertypeName AS UserUsertypeName', 'YearName AS UserYearName'];
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
    : res.status(404).json({ message });
}

// Endpoints -------------------------------------
// Modules
app.get('/api/modules', modulesController);
app.get('/api/modules/:id(\\d+)', modulesController);
app.get('/api/modules/leader/:id', modulesOfLeaderController);
app.get('/api/modules/users/:id', modulesOfUsersController);

// Users
app.get('/api/users', usersController);
app.get('/api/users/:id(\\d+)', usersController);
app.get('/api/users/student', usersStudentController);
app.get('/api/users/staff', usersStaffController);

// Start server ----------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log(`Server started on port ${PORT}`));
