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
    addDepartment(){
        console.log("works");
    }
    addRole(){

    }
    addEmployee(){

    }
    viewDepartment(){
        return connection.query("SELECT * FROM department");
    }
    viewEmployee(){

    }
    viewRole(){

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
async function init() {
    const initQuestion = await inquirer.prompt(initQuestions);
    switch (initQuestion.action) {
        case "Add Department":
            await dbQueries.addDepartment();
            break;
        case "Add Role":

            break;
        case "Add Employee":

            break;
        case "View Department":
            const departments = await dbQueries.viewDepartment();
            console.table(departments);
            break;
        case "View Role":

            break;
        case "View Employee":

            break;
        case "Update Employee Role":

            break;
    }
}
init();
