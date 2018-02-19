var mysql    = require('mysql');
var inquirer = require('inquirer');
var db       = require('./database');
var util     = require('./util');

var viewDepartmentSales = dbConnect => {
  db.getDepartmentSales(dbConnect)
    .then(departments => util.printDepartments(departments, true))
    .then(() => promptUser(dbConnect));
};

var addDepartment = dbConnect =>
  inquirer.prompt([
    {
      type: 'input',
      name: 'department',
      message: 'Enter the department name:\n'
    }
  ])
  .then(answer => {
    var department_name, over_head_costs;
    
    department_name = answer.department;

    inquirer.prompt([
      {
        type: 'input',
        name: 'costs',
        message: 'Enter the overhead costs:\n',
        validate: value =>
          (isNaN(value) === false && parseInt(value) > 0) 
          || '\nYou have to input a valid number.\n'
      }
    ])
    .then(answer => {
      over_head_costs = answer.costs;

      var objData = {
        name:            department_name,
        over_head_costs: over_head_costs
      };

      return db.insertDepartment(dbConnect, objData)
        .then(updateRes =>
          console.log('\n' + updateRes.affectedRows + ' item inserted!\n')
        );
    })
    .then(() => promptUser(dbConnect));
  })
  .catch(error => console.log(error));

var promptUser = dbConnect => {
  var arrActions = ['View Product Sales by Department', 'Create New Department',
                    'Quit'];

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
        viewDepartmentSales(dbConnect);
        break;
      case arrActions[1]:
        addDepartment(dbConnect);
        break;
      case arrActions[2]:
        console.log('\nDisconnected as id ' + dbConnect.threadId);
        db.endConnection(dbConnect);
        break;
      default:
        console.log('Should never get here due to inquirer index validation.');
      }
  });
};

db.getConnection().then(dbConnect => {
  console.log('\nConnected as id ' + dbConnect.threadId + '\n');
  promptUser(dbConnect);
})
.catch(error => console.log(error));
