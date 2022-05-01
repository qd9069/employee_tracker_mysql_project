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
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, employee.manager_id as manager
FROM employee
JOIN role ON role_id = role.id
JOIN department ON department_id = department.id;
-- JOIN employee ON employee.manager_id = employee.id

-- SELECT employee.manager_id
-- FROM employee m
-- JOIN employee e ON m.employee.manager_id = e.employee.id;

-- SELECT employee.manager_id
-- FROM employee 1, employee 2
-- WHERE 1.employee.manager_id = 2.employee.id;