-- Basic JOIN template (Joins will often need to be more complex working with more than two tables at times.)
-- SELECT <columns>
-- FROM <left_table>
-- JOIN <right_table>
-- ON <left_table>.<column> = <right_table>.<column>;

-- Join for viewing all roles
SELECT role.id, role.title, department.name as department, role.salary
FROM role
JOIN department 
ON role.department_id = department.id;

-- Join for viewing all employees
--  -------------------------------
-- all employees table before self join
-- SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, employee.manager_id as manager
-- FROM employee
-- JOIN role ON role_id = role.id
-- JOIN department ON department_id = department.id;

-- Example for self join table
-- SELECT e.id, e.first_name, e.last_name, concat(m.first_name, " ", m.last_name)
-- FROM employee AS e
-- left JOIN employee AS m
-- ON e.manager_id = m.id;

-- Join for viewing all employees with self-join
SELECT e.id, e.first_name, e.last_name, role.title, department.name as department, role.salary, concat(m.first_name, " ", m.last_name) as manager
FROM employee AS e
JOIN role ON e.role_id = role.id
JOIN department ON role.department_id = department.id
left JOIN employee AS m ON e.manager_id = m.id;

-- for viewing all employees with their names
SELECT concat(e.first_name, " ", e.last_name) as employees
FROM employee AS e
left JOIN employee AS m ON e.manager_id = m.id;

