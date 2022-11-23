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

const read = async (selectSql) => {
  try {
    const [result] = await database.query(selectSql);
    return (result.length === 0)
      ? { isSuccess: false, result: null, message: 'No record(s) found' }
      : { isSuccess: true, result: result, message: 'Record(s) successfully recovered' };
  }
  catch (error) {
    return { isSuccess: false, result: null, message: `Failed to execute query: ${error.message}` };
  }
}

const buildModulesSelectSql = (id, variant) => {
  let sql = '';
  const table = '((Modules LEFT JOIN Users ON ModuleLeaderID=UserID) LEFT JOIN Years ON ModuleYearID=YearID )';
  const fields = ['ModuleID', 'ModuleName', 'ModuleCode', 'ModuleLevel', 'ModuleYearID', 'ModuleLeaderID', 'ModuleImageURL', 'CONCAT(UserFirstname," ",UserLastname) AS ModuleLeaderName', 'YearName AS ModuleYearName'];

  switch (variant) {
    case 'leader':
      sql = `SELECT ${fields} FROM ${table} WHERE ModuleLeaderID=${id}`;
      break;
    case 'users':
      const extendedTable = `Modulemembers INNER JOIN ${table} ON Modulemembers.ModulememberModuleID=Modules.ModuleID`;
      sql = `SELECT ${fields} FROM ${extendedTable} WHERE ModulememberUserID=${id}`;
      break;
    default:
      sql = `SELECT ${fields} FROM ${table}`;
      if (id) sql += ` WHERE ModuleID=${id}`;
  }

  return sql;
}

const getModulesController = async (req, res, variant) => {
  const id = req.params.id; // Undefined in the case of the /api/modules endpoint
  // Validate request

  // Access data 
  const sql = buildModulesSelectSql(id, variant);
  const { isSuccess, result, message } = await read(sql);
  if (!isSuccess) return res.status(404).json({message});
  
  // Response to request
  res.status(200).json(result);
}

const buildUsersSelectSql = (id, variant) => {
  let sql = '';
  const table = '((Users LEFT JOIN Usertypes ON UserUsertypeID=UsertypeID) LEFT JOIN Years ON UserYearID=YearID )';
  const fields = ['UserID', 'UserFirstname', 'UserLastname', 'UserEmail', 'UserLevel', 'UserYearID', 'UserUsertypeID', 'UserImageURL', 'UsertypeName AS UserUsertypeName', 'YearName AS UserYearName'];

  switch (variant) {
    case 'student':
      const STUDENT = 2; // Usertype record for 'student'
      sql = `SELECT ${fields} FROM ${table} WHERE UsertypeID=${STUDENT}`;
      break;
    case 'staff':
      const STAFF = 1; // Usertype record for 'staff'
      sql = `SELECT ${fields} FROM ${table} WHERE UsertypeID=${STAFF}`;
      break;
    default:
      sql = `SELECT ${fields} FROM ${table}`;
      if (id) sql += ` WHERE UserID=${id}`;
  }

  return sql;
}

const getUsersController = async (req, res, variant) => {
  const id = req.params.id; // Undefined in the case of the /api/users endpoint

  // Validate request

  // Access data 
  const sql = buildUsersSelectSql(id, variant);
  const { isSuccess, result, message } = await read(sql);
  if (!isSuccess) return res.status(404).json({message});
  
  // Response to request
  res.status(200).json(result);
}

// Endpoints -------------------------------------
// Modules
app.get('/api/modules', (req, res) => getModulesController(req, res, null));
app.get('/api/modules/:id(\\d+)', (req, res) => getModulesController(req, res, null));
app.get('/api/modules/leader/:id', (req, res) => getModulesController(req, res, 'leader'));
app.get('/api/modules/users/:id', (req, res) => getModulesController(req, res, 'users'));

// Users
app.get('/api/users', (req, res) => getUsersController(req, res, null));
app.get('/api/users/:id(\\d+)', (req, res) => getUsersController(req, res, null));
app.get('/api/users/student', (req, res) => getUsersController(req, res, 'student'));
app.get('/api/users/staff', (req, res) => getUsersController(req, res, 'staff'));

// Start server ----------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log(`Server started on port ${PORT}`));
