const figlet = require("figlet");
const inquirer = require("inquirer");
const cTable = require('console.table');
// Import and require mysql2
const mysql = require('mysql2');

// create the connection to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: '',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

// MySQL2 exposes a .promise() function on Connections, to "upgrade" an existing non-promise connection to use promise
// db.promise().query("SELECT 1")
//   .then( ([rows,fields]) => {
//     console.log(rows);
//   })
//   .catch(console.log)
//   .then( () => db.end());

const init = () => {
    new Promise((resolve, reject) => {
        figlet("Employee Tracker", function (err, data) {
            if (err) {
                reject(err);
                return;
            }
            console.log(data);
            resolve();
        });
    })
    .catch(() => {
        // something is wrong with figlet.
        // provide fallback welcome message
        console.log("Welcome to the Employee Tracker");
    })
    .then(() => {
        menu();
    })
}


const menu = () => {
    inquirer
        .prompt([ 
            {
            type: 'list',
            message: 'What would you like to do?',
            name: 'mainOptions',
            choices: ['View all departments', 
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    // 'Update employee managers',
                    // 'View employees by manager',
                    // 'View employees by department',
                    // 'Delete departments',
                    // 'Delete roles',
                    // 'Delete employees',
                    // 'View the total utilized budget of a department'
                ],
            },
        ])
        .then((data) => {
            // console.log(data);

            let option = data.mainOptions;

            // if view all departments is selected, then print the department table
            if (option === "View all departments") {
                db.promise().query('SELECT * FROM department')
                    .then( ([rows,fields]) => {
                        // console.log(rows);
                        const table = cTable.getTable(rows);
                        console.log(table);

                        menu();
                    })
            } else if (option === "View all roles") {
                // if view all roles is selected, then print the role table
                db.promise().query('SELECT role.id, role.title, department.name as department, role.salary FROM role JOIN department ON role.department_id = department.id')
                    .then( ([rows,fields]) => {
                        const table = cTable.getTable(rows);
                        console.log(table);

                        menu();
                    })
            } else if (option === "View all employees") {
                // if view all employees is selected, then print the employee table
                // ************ need to fix the self join table *********
                db.promise().query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, employee.manager_id as manager FROM employee JOIN role ON role_id = role.id JOIN department ON department_id = department.id')
                    .then( ([rows,fields]) => {
                        const table = cTable.getTable(rows);
                        console.log(table);

                        menu();
                    })
            } else if (option === "Add a department") {
                // if add a department is selected, then prompt questions for adding department
                addDepartment();
            } else if (option === "Add a role") {
                // if add a role is selected, then prompt questions for adding role
                addRole();
            } else if (option === "Add an employee") {
                // if add an employee is selected, then propmt questions for adding employee
                addEmployee();
            } else if (option === "Update an employee role") {
                // if update an employee role is selected, then prompt questions for updating employee role
                updateEmployee();
            }
            // add more code here for additional options
        })

}

const addDepartment = () => {
    inquirer
        .prompt([ 
            {
            type: 'input',
            message: 'What is the name of the department?',
            name: 'departmentName',
            },
        ])
        .then((data) => {
            console.log(data);
            const deptName = data.departmentName;
            db.promise().query('INSERT INTO department (name) VALUES (?)', deptName)
                .then( ([rows,fields]) => {
                    // console.log(rows);
                    console.log(`Added ${deptName} to the database`)
                    menu();
                })
        })
};

// const addRole = () => {
//     return;
// }








const addRole = () => {};
const addEmployee = () => {};

init();