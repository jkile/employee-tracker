const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employees"
});

connection.connect();
connection.query = util.promisify(connection.query);
module.exports = connection;

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

            break;
        case "Add Role":

            break;
        case "Add Employee":

            break;
        case "View Department":

            break;
        case "View Role":

            break;
        case "View Employee":

            break;
        case "Update Employee Role":

            break;
    }
}