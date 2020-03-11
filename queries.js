const connection = require("./connection");

class Queries {
    addDepartment(){
        console.log("works");
    }
    addRole(){

    }
    addEmployee(){

    }
    viewDepartment(){
        connection.query("SELECT * FROM department");
    }
    viewEmployee(){

    }
    viewRole(){

    }
    updateEmployeeRole(){

    }
}
module.exports = Queries;