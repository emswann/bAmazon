/**
 * @file Interface to supervisor functionality. 
 * @author Elaina Swann
 * @version 1.0 
*/

var mysql    = require('mysql');
var inquirer = require('inquirer');
var db       = require('./database');
var util     = require('./util');

/** 
 * @function viewDepartmentSales
 * @description Function to handle the supervisor department sales list.
 * @param {object} dbConnect Connection object.
*/
var viewDepartmentSales = dbConnect => {
  db.getDepartmentSales(dbConnect)
    .then(departments => util.printDepartments(departments, true))
    .then(() => promptUser(dbConnect));
};

/** 
 * @function addDepartment
 * @description Function to allow supervisor to add department to existing department list.
 * @param {object} dbConnect Connection object.
*/
var addDepartment = dbConnect =>
  inquirer.prompt([
    {
      type: 'input',
      name: 'department',
      message: 'Enter the department name:\n'
    }
  ])
  .then(answer => {
    var department_name = answer.department;

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
      var over_head_costs = answer.costs;

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

/** 
 * @function promptUser
 * @description Top-level function, called recursively, to handle supervisor requests.
 * @param {object} dbConnect Connection object.
*/
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

/** 
 * Starts processing.
*/
db.getConnection().then(dbConnect => {
  console.log('\nConnected as id ' + dbConnect.threadId + '\n');
  promptUser(dbConnect);
})
.catch(error => console.log(error));
