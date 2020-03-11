const inquirer = require("inquirer");
const mysql = require("mysql");
//const queries = require("./Queries");
const util = require("util");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employees"
});

connection.connect();
connection.query = util.promisify(connection.query);
module.exports = connection;

class Queries {
    addDepartment(name) {
        return connection.query("INSERT INTO department SET name=?", [name])
    }
    async addRole(title, salary, department) {
        const departmentID = await connection.query("SELECT id FROM department WHERE name=?", [department]);
        return connection.query("INSERT INTO role SET ?", {
            title: title,
            salary: salary,
            department_id: departmentID[0].id
        });
    }
    async addEmployee(firstName, lastName, role, manager) {
        const roleID = await connection.query("SELECT id FROM role WHERE title=?", [role]);
        if (manager != "None") {
            const str_1 = manager.split(/\s(.+)/)[0];
            const str_2 = manager.split(/\s(.+)/)[1];
            const managerID = await connection.query("SELECT id FROM employee WHERE ?", 
            [{
                first_name: str_1
            },
            {
                last_name: str_2
            }])
            return connection.query("INSERT INTO employee SET ?",
                {
                    first_name: firstName,
                    last_name: lastName,
                    role_id: roleID[0].id,
                    manager_id: managerID[0].id
                })
        } else {
            return connection.query("INSERT INTO employee SET ?",
                {
                    first_name: firstName,
                    last_name: lastName,
                    role_id: roleID[0].id
                })
        }
    }
    viewDepartment() {
        return connection.query("SELECT * FROM department");
    }
    viewEmployee() {
        return connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON manager.id = employee.manager_id");
    }
    viewRole() {
        return connection.query("SELECT * FROM role");
    }
    updateEmployeeRole() {

    }
}

dbQueries = new Queries;
const initQuestions =
{
    name: "action",
    type: "list",
    message: "Choose an action:",
    choices: ["Add Department", "Add Role", "Add Employee", "View Department", "View Role", "View Employee", "Update Employee Role"]
};
const departmentQuestion =
{
    name: "name",
    type: "input",
    message: "Provide new department name: "
};
const roleQuestions =
    [{
        name: "name",
        type: "input",
        message: "Provide new role: "
    },
    {
        name: "salary",
        type: "input",
        message: "Provide role salary: "
    },
    {
        name: "department",
        type: "list",
        message: "Provide role department: ",
        choices: departmentQueryToArray
    }
    ];

const employeeQuestions = [
    {
        name: "firstName",
        type: "input",
        message: "Provide employee first name: "
    },
    {
        name: "lastName",
        type: "input",
        message: "Provide employee last name: "
    },
    {
        name: "manager",
        type: "list",
        message: "Provide employee manager: ",
        choices: managerQueryToArray
    },
    {
        name: "role",
        type: "list",
        message: "Provide role department: ",
        choices: roleQueryToArray
    }
];
async function roleQueryToArray() {
    const roles = await dbQueries.viewRole();
    const roleArray = roles.map(item => item.title);
    return roleArray;
}

async function departmentQueryToArray() {
    const departments = await dbQueries.viewDepartment();
    const departmentArray = departments.map(item => item.name);
    return departmentArray;
}
async function managerQueryToArray() {
    const managers = await dbQueries.viewEmployee();
    const tempManagerArray = managers.map(item => item.manager);
    const managerArray = tempManagerArray.filter(item => {
        if (item) {
            return item
        }
    })
    const uniqueManagerArray = [...new Set(managerArray)];
    uniqueManagerArray.push("None");
    return uniqueManagerArray;
}
async function init() {
    const initQuestion = await inquirer.prompt(initQuestions);
    switch (initQuestion.action) {
        case "Add Department":
            const departmentAdder = await inquirer.prompt(departmentQuestion);
            await dbQueries.addDepartment(departmentAdder.name);
            init();
            break;
        case "Add Role":
            const roleAdder = await inquirer.prompt(roleQuestions);
            await dbQueries.addRole(roleAdder.name, roleAdder.salary, roleAdder.department);
            init();
            break;
        case "Add Employee":
            const employeeAdder = await inquirer.prompt(employeeQuestions);
            await dbQueries.addEmployee(employeeAdder.firstName, employeeAdder.lastName, employeeAdder.role, employeeAdder.manager);
            init();
            break;
        case "View Department":
            const departments = await dbQueries.viewDepartment();
            console.table(departments);
            init();
            break;
        case "View Role":
            const roles = await dbQueries.viewRole();
            console.table(roles);
            init();
            break;
        case "View Employee":
            const employees = await dbQueries.viewEmployee();
            console.table(employees);
            init();
            break;
        case "Update Employee Role":

            break;
    }
}
init();
