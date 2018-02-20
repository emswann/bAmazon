/**
 * @file Interface to print utilities. 
 * @author Elaina Swann
 * @version 1.0 
*/

var Table = require('easy-table');

/** 
 * @function printProducts 
 * @description Prints product list.
 * @param {array} products Product object array with rows from database.
 * @param {boolean} isMgrView Determines data to print depending on whether manager or customer view.
*/
var printProducts = (products, isMgrView = false) => {
  if (products.length) {
    var table = new Table;

    products.forEach((product, index) =>  {
      table.cell('ID', index + 1);
      table.cell('Name', product.product_name);
      if (isMgrView) {
        table.cell('Department', product.department_name);
        table.cell('Quantity', product.stock_quantity);
      }
      table.cell('Price', product.price, Table.number(2));
      table.newRow();
    });

    if (!isMgrView) {
      table.newRow();
      table.cell('ID', 0);
      table.cell('Name', 'Quit');
      table.newRow();
    }

    console.log('\n' + table.toString() + '\n');
  }
  else {
    console.log('\nNo products to view.\n');
  }
};


/** 
 * @function printOrder 
 * @description Prints customer order along with total.
 * @param {array} orders Order object array with items from customer order.
*/
var printOrder = orders => {
  if (orders.length) {
    var table = new Table;
    var sumTotal = 0;

    orders.forEach((order, index) => {
      var total = order.price * order.nItems;
      sumTotal += total;

      table.cell('ID', index + 1);
      table.cell('Name', order.product_name);
      table.cell('Items', order.nItems);
      table.cell('Price', order.price, Table.number(2));
      table.cell('Total', total, Table.number(2));
      table.newRow();
    });

    console.log('\n' + table.toString());
    console.log('\nYour grand total is: $' + sumTotal.toFixed(2) + '\n');
  }
  else {
    console.log('\nNo order items exist.\n');
  }
};

/** 
 * @function printDepartments 
 * @description Prints department list.
 * @param {array} departments Department object array with rows from database.
*/
var printDepartments = departments => {
  if (departments.length) {
    var table = new Table;

    departments.forEach(department =>  {
      table.cell('ID', department.id);
      table.cell('Name', department.name);
      table.cell('Overhead Costs', department.over_head_costs, Table.number(2));
      table.cell('Product Sales', department.sales, Table.number(2));
      table.cell('Total Profit', 
                 department.sales - department.over_head_costs, 
                 Table.number(2));
      table.newRow();
    });

    console.log('\n' + table.toString() + '\n');
  }
  else {
    console.log('\nNo departments to view.\n');    
  }
};

module.exports = {
  printProducts,
  printOrder,
  printDepartments
};