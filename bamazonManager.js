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
  db.getProducts(dbConnect)
    .then(products => {
      util.printProducts(products, true);
      return Promise.resolve(products);
    })
    .then((products) => {
      inquirer.prompt([
        {
          type: 'input',
          name: 'product',
          message: 'Enter the product number you wish to update inventory:\n',
          validate: value =>
            (isNaN(value) === false 
             && parseInt(value) >= 0 && parseInt(value) <= products.length)
            || '\nYou have to input a valid number.\n'
        }
      ])
      .then(answer => {
        var nProduct = parseInt(answer.product);
        chosenProd = products[nProduct - 1];

        inquirer.prompt([
          {
            type: 'input',
            name: 'amount',
            message: 'How many items do you want to add?\n',
            validate: value =>
              (isNaN(value) === false && parseInt(value) >= 0) 
              || '\nYou have to input a valid number.\n'
          }
        ])
        .then(answer => {
          var nAmount = parseInt(answer.amount);

          if (nAmount > 0) {
            var arrParams = [nAmount, chosenProd.item_id];

            return db.updateInventory(dbConnect, arrParams, '+')
              .then(updateRes =>
                console.log('\n' + updateRes.affectedRows + ' item updated!\n')
            );
          }
        })
        .then(() => promptUser(dbConnect));
      });
    })
    .catch(error => console.log(error));
};

var addProduct = dbConnect =>
  inquirer.prompt([
    {
      type: 'input',
      name: 'product',
      message: 'Enter the product name:\n'
    }
  ])
  .then(answer => {
    var product_name, department_name, price, stock_quantity;
    
    product_name = answer.product;

    inquirer.prompt([
      {
        type: 'input',
        name: 'department',
        message: 'Enter the product department\n'
      }
    ])
    .then(answer => {
      department_name = answer.department;

      inquirer.prompt([
        {
          type: 'input',
          name: 'price',
          message: 'Enter the product cost:\n',
          validate: value =>
            (isNaN(value) === false && parseInt(value) > 0) 
            || '\nYou have to input a valid number.\n'
        }
      ])
      .then(answer => {
        price = answer.price;

        inquirer.prompt([
          {
            type: 'input',
            name: 'amount',
            message: 'Enter the number of products available:\n',
            validate: value =>
              (isNaN(value) === false && parseInt(value) > 0) 
              || '\nYou have to input a valid number.\n'
          }
        ])
        .then(answer => {
          stock_quantity = answer.amount;

          var objData = {
            product_name:    product_name,
            department_name: department_name,
            price:           price,
            stock_quantity:  stock_quantity
          };

          return db.insertProduct(dbConnect, objData)
            .then(updateRes =>
              console.log('\n' + updateRes.affectedRows + ' item inserted!\n')
            );
        })
        .then(() => promptUser(dbConnect));
      });
    });
  })
  .catch(error => console.log(error));

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

var dbConnect;

db.getConnection().then(connection => {
  dbConnect = connection;
  console.log('\nConnected as id ' + dbConnect.threadId + '\n');
})
.then(() => promptUser(dbConnect)
)
.catch(error => console.log(error));
