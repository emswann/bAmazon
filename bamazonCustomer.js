var mysql    = require('mysql');
var inquirer = require('inquirer');
var db       = require('./database');
var util     = require('./util');

var resolveQuit = (dbConnect, orders) => 
  Promise.all(orders.map(order => {
    var arrParams = [order.nItems, order.item_id];

    return db.updateInventory(dbConnect, arrParams, '+')
      .then(updateRes =>
        console.log('\n' + updateRes.affectedRows + ' item updated!\n')
    );
  }));

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
        var stockAmt = chosenProd.stock_quantity;

        inquirer.prompt([
          {
            type: 'input',
            name: 'amount',
            message: 'We have ' + stockAmt + ' in stock. How many items would you like to purchase?\n',
            validate: value =>
              (isNaN(value) === false 
               && parseInt(value) >= 0 && parseInt(value) <= stockAmt) 
              || '\nYou need to enter a number between 0 and ' + stockAmt + '.\n'
          }
        ])
        .then(answer => {
          var nAmount = parseInt(answer.amount);

          if (nAmount > 0) {
            orders.push(
              {item_id:      chosenProd.item_id,
               product_name: chosenProd.product_name,
               nItems:       nAmount,
               price:        chosenProd.price
              });

            chosenProd.stock_quantity -= nAmount;
            var arrParams = [nAmount, chosenProd.item_id];

            return db.updateInventory(dbConnect, arrParams, '-')
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
          .then(answer =>
            answer.orderAgain 
              ? processOrder(dbConnect, products, orders) 
              : Promise.resolve(util.printOrder(orders)).then(() => {
                console.log('\nDisconnected as id ' + dbConnect.threadId);
                db.endConnection(dbConnect);
              })
          );
        })
    } 
  })
  .catch(error => console.log(error));
};

var start = () => {
  var dbConnect;
  var orders = [];

  db.getConnection().then(connection => {
    dbConnect = connection;
    console.log('\nConnected as id ' + dbConnect.threadId + '\n');
    return db.getProducts(dbConnect);
  })
  .then(products => processOrder(dbConnect, products, orders)
  )
  .catch(error => console.log(error));
};

start();