var Table = require('easy-table');

var printProducts = products => {
  var table = new Table;

  products.forEach((product, index) =>  {
    table.cell('ID', index + 1);
    table.cell('Name', product.product_name);
    table.cell('Price', product.price, Table.number(2));
    table.newRow();
  });

  table.newRow();
  table.cell('ID', 0);
  table.cell('Name', 'Quit');
  table.newRow();

  console.log(table.toString());
};

var printOrder = orders => {
  var table = new Table;
  var sumTotal = 0;

  table.newRow();
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

  console.log(table.toString());
  console.log('\n\nYour grand total is: $' + sumTotal.toFixed(2) + '\n');
};

module.exports = {
  printProducts,
  printOrder
};