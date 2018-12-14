const moogoose = require('mongoose')

const EmployeeSchema = new moogoose.Schema({
    title: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true        
    }
})

const EmployeeData = moogoose.model('Employee', EmployeeSchema)

module.exports = EmployeeData