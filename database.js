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
      'SELECT * FROM products ORDER BY item_id',
      (err, res) => err ? reject(err) : resolve(res)
    )
  );

var getDepartments = connection =>
  new Promise((resolve, reject) =>
    connection.query(
      'SELECT * FROM departments ORDER BY department_id',
      (err, res) => err ? reject(err) : resolve(res)
    )
  );

var getDepartmentSales = connection =>
  new Promise((resolve, reject) =>
    connection.query(
      'SELECT a.department_id, a.department_name, ' 
      + 'a.over_head_costs, SUM(b.product_sales) AS product_sales '
      + 'FROM departments AS a '
      + 'LEFT JOIN products AS b ON a.department_name = b.department_name ' 
      + 'GROUP BY a.department_id',
      (err, res) => err ? reject(err) : resolve(res)
    )
  );

var getLowInventory = (connection, arrParams) =>
  new Promise((resolve, reject) =>
    connection.query(
      'SELECT * FROM products WHERE stock_quantity < ? ORDER BY item_id',
      arrParams,
      (err, res) => err ? reject(err) : resolve(res)
    )
  );

var updateInventory = (connection, arrParams, action = 'sub') =>
  new Promise((resolve, reject) => {
    var quantity_op = '-';
    var sales_op    = '+';

    if (action === 'add') {
      quantity_op = '+';
      sales_op    = '-';
    }

    connection.query(
      'UPDATE products SET stock_quantity = stock_quantity ' 
        + quantity_op + ' ?, product_sales = products_sales ' 
        + sales_op + '? WHERE item_id = ?',
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