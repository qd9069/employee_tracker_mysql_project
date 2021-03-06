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
      password: 'mygui888',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);


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
};


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
                
                db.promise().query('SELECT e.id, e.first_name, e.last_name, role.title, department.name as department, role.salary, concat(m.first_name, " ", m.last_name) as manager FROM employee AS e JOIN role ON e.role_id = role.id JOIN department ON role.department_id = department.id left JOIN employee AS m ON e.manager_id = m.id')
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
        });

};

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
            // console.log(data);
            const deptName = data.departmentName;
            db.promise().query('INSERT INTO department (name) VALUES (?)', deptName)
                .then( ([rows,fields]) => {
                    // console.log(rows);
                    console.log(`Added ${deptName} to the database`)
                    menu();
                })
        })
};

const addRole = () => {
    inquirer
        .prompt([ 
            {
            type: 'input',
            message: 'What is the name of the role?',
            name: 'roleName',
            },
            {
            type: 'input',
            message: 'What is the salary of the role?',
            name: 'roleSalary',
            },
        ])
        .then((value) => {
            
            const sql = `SELECT name FROM department`;

            choices(sql).then(data => {
            //    console.log("data " + JSON.stringify(data));
                inquirer
                    .prompt([ 
                        {
                        type: 'list',
                        message: 'Which department does the role belong to?',
                        name: 'roleInDepartment',
                        choices: data,
                        },
                    ])
                .then ((result) => {
                    // console.log(result);
                    // console.log(value);

                    const title = value.roleName;
                    const salary = value.roleSalary;
                    const departmentName = result.roleInDepartment;
                    
                    db.query('SELECT id FROM department WHERE name = ?', departmentName, function (err, results) {
                        // console.log(results);
                        // console.log(results[0]);
                        // console.log(results[0].id);
                        

                        db.promise().query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, results[0].id])
                            .then( ([rows,fields]) => {
                                // console.log(rows);
                                console.log(`Added ${title} to the database`)
                                menu();
                            }).catch(console.log);

                    });

                })
            })
            
        })

};

// function to generate list of department.name
const choices = (sql) => {
    return db.promise().query(sql)
        .then( ([rows,fields]) => {
            // console.log(rows);

            // console.log("test");
            
            const choiceArray = [];
            for (i=0; i <rows.length; i++) {
                
                const newArray = choiceArray.push(rows[i].name)
                // console.log(rows[i].name);
                // console.log(choiceArray);
            }
            
            // console.log(choiceArray);
            return choiceArray;
        });
};

// function to generate list of role.title
const roleList = (sql) => {
    return db.promise().query(sql)
        .then( ([rows,fields]) => {
            // console.log(rows);

            const choiceArray = [];
            for (i = 0; i < rows.length; i++) {
                
                const newArray = choiceArray.push(rows[i].title)
                // console.log(rows[i].title);
            }
            
            // console.log(choiceArray);
            return choiceArray;
        });
};

// function to generate list of all employees' name + None
const employeeList = (choiceArray) => {
    
    return db.promise().query('SELECT concat(e.first_name, " ", e.last_name) as employees FROM employee AS e left JOIN employee AS m ON e.manager_id = m.id')
    .then( ([rows,fields]) => {
        // console.log(rows);

        // const choiceArray = ["NULL"];
        for (i = 0; i < rows.length; i++) {
            
            const newArray = choiceArray.push(rows[i].employees)
            // console.log(rows[i].employees);
        }
        
        // console.log(choiceArray);
        return choiceArray;
    });
};

const addEmployee = () => {

    // get list of role.title
    const sql = `SELECT title FROM role`;

    roleList(sql).then(data => {
        // console.log("data", JSON.stringify(data));
        return data;
    })
    .then (results => {
        // console.log(results);
        
        // prompt the question "What is the employee's first name?"
        // prompt the question "What is the employee's last name?"
        // prompt the question "What is the employee's role?"
            // prompt the list of role.title for selection
        return inquirer
            .prompt([ 
                {
                type: 'input',
                message: "What is the employee's first name?",
                name: 'firstName',
                },
                {
                type: 'input',
                message: "What is the employee's last name?",
                name: 'lastName',
                },
                {
                type: 'list',
                message: "What is the employee's role?",
                name: 'roleChoices',
                choices: results,
                },
            ]);
    })
    .then (data => {
        // console.log(data);

        // get list of all employees's name + None
        const choiceArray = ["NULL"];
        employeeList(choiceArray).then(results => {
            // console.log("results " + JSON.stringify(results));

            // prompt the question "who is the employee's manager?"
                // prompt the list of all employees' name + "None" for selection
            inquirer
                .prompt([ 
                    {
                    type: 'list',
                    message: "who is the employee's manager?",
                    name: 'roleChoices',
                    choices: results,
                    },
                ])
            .then(value => {
                // get data from the prompt selections
                // console.log(value);

                const firstName = data.firstName;
                const lastName = data.lastName;
                const roleTitle = data.roleChoices;

                // run function to add employee to the employee table
                db.query('SELECT id FROM role WHERE title = ?', roleTitle, function (err, results) {
                    // console.log(results);
                    // console.log(results[0].id);
                    
                    const roleId = results[0].id;
                    
                    const employeeFN = value.roleChoices.split(" ")[0];
                    const employeeLN = value.roleChoices.split(" ")[1];
                    // console.log(employeeFN);
                    // console.log(employeeLN);
                    
                    db.query('SELECT id FROM employee WHERE first_name = ? AND last_name =?', [employeeFN, employeeLN], function (err, outcomes) {
                        // console.log(outcomes);
                        
                        if (!outcomes[0]) {
                            db.promise().query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, NULL)', [firstName, lastName, roleId])
                            .then( ([rows,fields]) => {
                                // console.log(rows);
                                // log message "Added employeeName to the database"
                                console.log(`Added ${firstName} ${lastName} to the database`)
                                
                                // show the main menu again
                                menu();
                            }).catch(console.log);
                        } else {
                            const managerId = outcomes[0].id;
    
                            db.promise().query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId])
                                .then( ([rows,fields]) => {
                                    // console.log(rows);
                                    // log message "Added employeeName to the database"
                                    console.log(`Added ${firstName} ${lastName} to the database`)
                                    
                                    // show the main menu again
                                    menu();
                                }).catch(console.log);
                        }

                    });
                });
            });
        });
    });

};

const updateEmployee = () => {
    
    // to get a list of all employees' name
    const choiceArray = [];
    employeeList(choiceArray).then(results => {
        // console.log("results " + JSON.stringify(results));
        return results;
    })
    .then (outcomes => {
        // console.log(outcomes);
        return inquirer
            .prompt([ 
                {
                type: 'list',
                message: "Which employee's role do you want to update?",
                name: 'employeeToUpdate',
                choices: outcomes,
                },
            ]);
    })
    .then (results => {
        // console.log(results);

        // to get a list of role.title
        const sql = `SELECT title FROM role`;
        roleList(sql).then(data => {
            // console.log("data", JSON.stringify(data));

            inquirer
                .prompt([ 
                    {
                    type: 'list',
                    message: "Which role do you want to assign the selected employee?",
                    name: 'roleToUpdate',
                    choices: data,
                    },
                ])
            .then (outcomes => {
                // console.log(outcomes);

                empName = results.employeeToUpdate;
                employeeFN = results.employeeToUpdate.split(" ")[0];
                employeeLN = results.employeeToUpdate.split(" ")[1];
                roleTitle = outcomes.roleToUpdate;
                
                
                db.query('SELECT id FROM role WHERE title = ?', roleTitle, function (err, dbRoleId) {
                    // console.log(dbRoleId);
                    // console.log(dbRoleId[0].id);
                    
                    empRoleId = dbRoleId[0].id;
                    
                    db.query('SELECT id FROM employee WHERE first_name = ? AND last_name = ?', [employeeFN, employeeLN], function (err, dbId) {
                        // console.log(dbId);
                        
                        empId = dbId[0].id;
                        // console.log(empId);
    
                        // query to update employee.role_id
                        db.promise().query('UPDATE employee SET role_id = ? WHERE id = ?', [empRoleId, empId])
                            .then( ([rows,fields]) => {
                                // console.log(rows);
                                // log message "Updated employeeName's role in the database"
                                console.log(`Updated ${empName}'s role in the database`)
                                
                                // show the main menu again
                                menu();
                            }).catch(console.log);
    
                    });   

                });

            });

        });

    });

};



init();