/**
 * @file Interface to customer functionality. 
 * @author Elaina Swann
 * @version 1.0 
*/

var mysql    = require('mysql');
var inquirer = require('inquirer');
var db       = require('./database');
var util     = require('./util');

/** 
 * @function resolveQuit
 * @description Promise function for reverting the inventory on products table when customer quits application without ordering.
 * @param {object} dbConnect Connection object.
 * @param {array} orders Order object array with items from customer order.
*/
var resolveQuit = (dbConnect, orders) => 
  Promise.all(orders.map(order => {
    var arrParams = [order.nItems, 
                     order.price * order.nItems,
                     order.id];

    return db.updateInventory(dbConnect, arrParams, 'add')
      .then(updateRes =>
        console.log('\n' + updateRes.affectedRows + ' item updated!\n')
    );
  }));

/** 
 * @function processOrder
 * @description Top-level function, called recursively, as customer chooses products to order.
 * @param {object} dbConnect Connection object.
 * @param {array} products Product object array with rows from database.
 * @param {array} orders Order object array with items from customer order.
*/
var processOrder = (dbConnect, products, orders) => {
  util.printProducts(products, false);
  inquirer.prompt([
    {
      type: 'input',
      name: 'product',
      message: 'Enter the product number you wish to buy:\n',
      validate: value =>
        (isNaN(value) === false 
         && parseInt(value) >= 0 && parseInt(value) <= products.length)
        || '\nYou have to input a valid number.\n'
    }
  ])
  .then(answer => {
    var nProduct = parseInt(answer.product);

    switch (nProduct) {
      case 0:
        return resolveQuit(dbConnect, orders).then(() => {
          console.log('\nDisconnected as id ' + dbConnect.threadId);
          db.endConnection(dbConnect);
        });
        break;
      default:
        chosenProd = products[nProduct - 1];
        var stockQuantity = chosenProd.stock_quantity;

        inquirer.prompt([
          {
            type: 'input',
            name: 'amount',
            message: 'We have ' + stockQuantity + ' in stock. How many items would you like to purchase?\n',
            validate: value =>
              (isNaN(value) === false 
               && parseInt(value) >= 0 && parseInt(value) <= stockQuantity) 
              || '\nYou need to enter a number between 0 and ' + stockQuantity + '.\n'
          }
        ])
        .then(answer => {
          var nItems = parseInt(answer.amount);

          if (nItems > 0) {
            orders.push(
              {id:           chosenProd.id,
               product_name: chosenProd.product_name,
               nItems:       nItems,
               price:        chosenProd.price
              });

            chosenProd.stock_quantity -= nItems;
            var arrParams = [nItems, 
                             chosenProd.price * nItems, 
                             chosenProd.id];

            return db.updateInventory(dbConnect, arrParams, 'sub')
              .then(updateRes =>
                console.log('\n' + updateRes.affectedRows + ' item updated!\n')
            );
          }
        })
        .then(() => {
          inquirer.prompt([
            {
              type: 'confirm',
              name: 'orderAgain',
              message: 'Would you like to purchase another item?\n'
            }
          ])
          .then(answer => {
            if (answer.orderAgain) {
              processOrder(dbConnect, products, orders);
            }
            else {
              util.printOrder(orders);
              console.log('\nDisconnected as id ' + dbConnect.threadId);
              db.endConnection(dbConnect);
            }
          });
        })
    } 
  })
  .catch(error => console.log(error));
};

/** 
 * Starts processing.
*/
db.getConnection().then(dbConnect => {
  console.log('\nConnected as id ' + dbConnect.threadId + '\n');
  db.getProducts(dbConnect).then(products => {
    var orders = [];
    processOrder(dbConnect, products, orders)
  });
})
.catch(error => console.log(error));