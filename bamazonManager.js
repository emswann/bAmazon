/**
 * @file Interface to manager functionality. 
 * @author Elaina Swann
 * @version 1.0 
*/

var mysql    = require('mysql');
var inquirer = require('inquirer');
var db       = require('./database');
var util     = require('./util');

/** 
 * @function viewProducts
 * @description Function to handle the manager product list view.
 * @param {object} dbConnect Connection object.
*/
var viewProducts = dbConnect => {
  console.log('\n\nYour list of products for sale:\n');

  db.getProducts(dbConnect)
    .then(products => {
      util.printProducts(products, true);
      promptUser(dbConnect);
    });
};

/** 
 * @function viewInventory
 * @description Function to handle the manager low inventory list view.
 * @param {object} dbConnect Connection object.
*/
var viewInventory = dbConnect => {
  const LIMIT = 5;
  console.log('\n\nYour list of products with low inventory:\n');

  var arrParams = [LIMIT];

  db.getLowInventory(dbConnect, arrParams)
    .then(products => {
      util.printProducts(products, true)
      promptUser(dbConnect);
    });
};

/** 
 * @function addInventory
 * @description Function to allow  manager to add inventory to existing product list.
 * @param {object} dbConnect Connection object.
*/
var addInventory = dbConnect => {
  db.getProducts(dbConnect)
    .then(products => {
      util.printProducts(products, true);
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
            var arrParams = [nAmount, 0, chosenProd.id];

            return db.updateInventory(dbConnect, arrParams, 'add')
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

/** 
 * @function addProduct
 * @description Function to allow manager to add product to existing product list.
 * @param {object} dbConnect Connection object.
*/
var addProduct = dbConnect =>
  inquirer.prompt([
    {
      type: 'input',
      name: 'product',
      message: 'Enter the product name:\n'
    }
  ])
  .then(answer => {   
    var product_name = answer.product;

    db.getDepartments(dbConnect).then(departments => {
      var arrDepartments = departments.map(
        department => department.name);

      inquirer.prompt([
        {
          type: 'rawlist',
          name: 'department',
          message: 'Select the product department\n',
          choices: arrDepartments
        }
      ])
      .then(answer => {
        var department = departments.filter(
                           department => department.name === answer.department);
        var department_id = department[0].id;

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
          var price = answer.price;

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
            var stock_quantity = answer.amount;

            var objData = {
              name:           product_name,
              department_id:  department_id,
              price:          price,
              stock_quantity: stock_quantity
            };

            return db.insertProduct(dbConnect, objData)
              .then(updateRes =>
                console.log('\n' + updateRes.affectedRows + ' item inserted!\n')
              );
          })
          .then(() => promptUser(dbConnect));
        });
      });
    });
  })
  .catch(error => console.log(error));

/** 
 * @function promptUser
 * @description Top-level function, called recursively, to handle manager requests.
 * @param {object} dbConnect Connection object.
*/
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

/** 
 * Starts processing.
*/
db.getConnection().then(dbConnect => {
  console.log('\nConnected as id ' + dbConnect.threadId + '\n');
  promptUser(dbConnect);
})
.catch(error => console.log(error));
