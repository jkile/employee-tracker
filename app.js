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
    addDepartment(name){
        return connection.query("INSERT INTO department SET name=?", [name])
    }
    async addRole(title, salary, department){
        const departmentID = await connection.query("SELECT id FROM department WHERE name=?", [department]);
        return connection.query("INSERT INTO role SET ?", {
            title: title,
            salary: salary,
            department_id: departmentID[0].id
        });
    }
    addEmployee(){

    }
    viewDepartment(){
        return connection.query("SELECT * FROM department");
    }
    viewEmployee(){
        return connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON manager.id = employee.manager_id");
    }
    viewRole(){
        return connection.query("SELECT * FROM role");
    }
    updateEmployeeRole(){

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

async function departmentQueryToArray(){
    const departments = await dbQueries.viewDepartment();
    const departmentArray = departments.map(item => item.name);
    return departmentArray;
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

            break;
        case "View Department":
            const departments = await dbQueries.viewDepartment();
            console.log(departments);
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
