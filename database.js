var mysql = require('mysql');
var inquirer = require('inquirer');

var getConnection = () =>
  new Promise((resolve, reject) => {
    var connection, user, password, port;

    inquirer.prompt([
      {
        type: 'input',
        name: 'user',
        message: 'Please enter your user name: ',
        default: 'root'
      }
    ]).then(answer => {
      user = answer.user;
  
      inquirer.prompt([
        {
          type: 'password',
          name: 'password',
          message: 'Please enter your password: ',
          default: 'root'
        }
      ]).then(answer => {
        password = answer.password;

        inquirer.prompt([
          {
            type: 'input',
            name: 'port',
            message: 'Please enter your port number: ',
            default: '3308',
            validate: value => {
              if (isNaN(value) === false && parseInt(value) >= 0) {
                return true;
              }
              else {
                console.log('\nYou have to input a valid number.\n');
                return false;
              }
            }
          }
        ]).then(answer => {
          port = answer.port;

          connection = mysql.createConnection({
            host     : 'localhost',
            port     : port,
            user     : user,
            password : password,
            database : 'bamazon'
          });

          connection.connect(err => err ? reject(err) : resolve(connection));
        });
      });
    })
    .catch(error => console.log(error));
  });

var endConnection = connection =>
  new Promise((resolve, reject) =>
    connection.end(err => err ? reject(err) : resolve(1))
  );

var getProducts = connection =>
  new Promise((resolve, reject) =>
    connection.query(
      'SELECT a.id, a.name AS product_name, b.name AS department_name, '
      + '     a.price, a.stock_quantity, a.sales '
      + 'FROM products AS a '
      + 'LEFT JOIN departments AS b ON a.department_id = b.id ' 
      + 'ORDER BY a.id',
      (err, res) => err ? reject(err) : resolve(res)
    )
  );

var getDepartments = connection =>
  new Promise((resolve, reject) =>
    connection.query(
      'SELECT * FROM departments '
      + ' ORDER BY id',
      (err, res) => err ? reject(err) : resolve(res)
    )
  );

var getDepartmentSales = connection =>
  new Promise((resolve, reject) =>
    connection.query(
      'SELECT a.id, a.name, a.over_head_costs, SUM(b.sales) AS sales '
      + 'FROM departments AS a '
      + 'LEFT JOIN products AS b ON a.id = b.department_id ' 
      + 'GROUP BY a.id',
      (err, res) => err ? reject(err) : resolve(res)
    )
  );

var getLowInventory = (connection, arrParams) =>
  new Promise((resolve, reject) => 
    connection.query(
      'SELECT a.id, a.name AS product_name, b.name AS department_name, '
      + '     a.price, a.stock_quantity, a.sales '
      + 'FROM products AS a '
      + 'LEFT JOIN departments AS b ON a.department_id = b.id '
      + 'WHERE a.stock_quantity < ? ' 
      + 'ORDER BY a.id',
      arrParams,
      (err, res) => err ? reject(err) : resolve(res)
    )
  );

var updateInventory = (connection, arrParams, action = 'sub') =>
  new Promise((resolve, reject) => {
    var quantity_operator = '-';
    var sales_operator    = '+';

    if (action === 'add') {
      quantity_operator = '+';
      sales_operator    = '-';
    }

    connection.query(
      'UPDATE products '
        + 'SET stock_quantity = stock_quantity ' + quantity_operator + ' ?, '
        + '    sales = sales ' + sales_operator + '? '
        + 'WHERE id = ?',
      arrParams,
      (err, res) => err ? reject(err) : resolve(res)
    )
  });

var insertProduct = (connection, objData) =>
  new Promise((resolve, reject) =>
    connection.query(
      'INSERT INTO products SET ?',
      objData,
      (err, res) => err ? reject(err) : resolve(res)
    )
  );

var insertDepartment = (connection, objData) =>
  new Promise((resolve, reject) =>
    connection.query(
      'INSERT INTO departments SET ?',
      objData,
      (err, res) => err ? reject(err) : resolve(res)
    )
  );

module.exports = {
  getConnection,
  endConnection,
  getProducts,
  getDepartments,
  getDepartmentSales,
  getLowInventory,
  updateInventory,
  insertProduct,
  insertDepartment
};