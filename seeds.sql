USE employees;

INSERT INTO department (name)
VALUES ("Engineering"), ("Accounting"), ("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES ("Engineer", 80000, 1), ("Senior Engineer", 100000, 1), ("Accountant", 70000, 2), ("Senior Accountant", 90000, 2), ("Market Analyst", 80000, 3), ("Senior Analyst", 110000, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Jake", "Kile", 1), ("John", "Smith", 2), ("Spencer", "Birch", 1), ("Nate", "Ray", 3), ("Michael", "Madrid", 4), ("Tanner", "Durrett", 6);

