-- Insert date for department table
INSERT INTO department (name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");

-- Insert data for role table
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 1),
       ("Software Engineer", 120000, 1),
       ("Account Manager", 160000, 2),
       ("Accountant", 125000, 2),
       ("Legal Team Lead", 250000, 3),
       ("Lawyer", 190000, 3),
       ("Sales Lead", 100000, 4),
       ("Salesperson", 80000, 4);
       
-- Insert data for employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ryan", "Brown", 1, NULL),
       ("Helen", "Smith", 2, 1),
       ("Mary", "Williams", 3, NULL),
       ("Patricia", "Johnson", 4, 3),
       ("James", "Jones", 5, NULL),
       ("Robert", "Miller", 6, 5),
       ("Oliver", "Davis", 7, NULL),
       ("Sophia", "Garcia", 8, 7);