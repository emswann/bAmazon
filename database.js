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
    connection.end(err => err ? reject(err) : resolve(1)
    )
  );

var getProducts = connection =>
  new Promise((resolve, reject) =>
    connection.query(
      'SELECT * FROM products ORDER BY item_id',
      (err, res) => err ? reject(err) : resolve(res)
    )
  );

var updateStock = (connection, arrDataObj) =>
  new Promise((resolve, reject) =>
    connection.query(
      'UPDATE products SET ? WHERE ?',
      arrDataObj,
      (err, res) => err ? reject(err) : resolve(res)
    )
  );

module.exports = {
  getConnection,
  endConnection,
  getProducts,
  updateStock
};