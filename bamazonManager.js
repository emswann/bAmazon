var mysql    = require('mysql');
var inquirer = require('inquirer');
var db       = require('./database');
var util     = require('./util');

var viewProducts = dbConnect => {
  console.log('\n\nYour list of products for sale:\n');

  db.getProducts(dbConnect)
    .then(products => util.printProducts(products, true))
    .then(() => promptUser(dbConnect));
};

var viewInventory = dbConnect => {
  const LIMIT = 5;
  console.log('\n\nYour list of products with low inventory:\n');

  var arrParams = [LIMIT];

  db.getLowInventory(dbConnect, arrParams)
    .then(products => util.printProducts(products, true))
    .then(() => promptUser(dbConnect));
};

var addInventory = dbConnect => {

};

var addProduct = dbConnect => {

};

var promptUser = dbConnect => {
  var arrActions = ['View Products for Sale', 'View Low Inventory',
                      'Add to Inventory', 'Add New Product', 'Quit'];

  inquirer.prompt([
    {
      type: 'rawlist',
      name: 'action',
      message: 'Please select what you would like to do:\n',
      choices: arrActions
    }
  ])
  .then(choice => {
    switch (choice.action) {
      case arrActions[0]:
        viewProducts(dbConnect);
        break;
      case arrActions[1]:
        viewInventory(dbConnect);
        break;
      case arrActions[2]:
        addInventory(dbConnect);
        break;
      case arrActions[3]:
        addProduct(dbConnect);
        break;
      case arrActions[4]:
        console.log('\nDisconnected as id ' + dbConnect.threadId);
        db.endConnection(dbConnect);
        break;
      default:
        console.log('Should never get here due to inquirer index validation.');
      }
  });
};

var start = () => {
  var dbConnect;

  db.getConnection().then(connection => {
    dbConnect = connection;
    console.log('\nConnected as id ' + dbConnect.threadId + '\n');
  })
  .then(() => promptUser(dbConnect)
  )
  .catch(error => console.log(error));
};

start();