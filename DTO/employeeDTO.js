class EmployeeDTO {
    employeeCode
    name;
    email;
    currentLevel;

    constructor(data) {
        this.employeeCode = data.employeeCode;
        this.name = data.name;
        this.email = data.email;
        this.currentLevel = data.currentLevel;
    }
}

module.exports.EmployeeDTO = EmployeeDTO;