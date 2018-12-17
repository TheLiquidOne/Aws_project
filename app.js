/**
 * Module dependencies.
 */

var express = require('express')
  , path = require('path')

var app = express();
const mongoose = require('mongoose');
const Employee = require('./schemas/employee')

var parameter = "SERVER_URL";
var server = process.env[parameter] || "localhost";

mongoose.connection.close();
mongoose.connect('mongodb://' + server + ':27017/employees');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("opened");
});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'pug');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//Routes

//index
app.get('/', function(req, res){
    Employee.find({}).then(function(emps) {
        res.render('index', {
            title: 'Employees',
            employees: emps
        });
    });
});


//new employee
app.get('/employee/new', function(req, res) {
    res.render('employee_new', {
        title: 'New Employee'
    });
});

//save new employee
app.post('/employee/new', function(req, res){
    const newEmployee = {
        title: req.param('title'),
        name: req.param('name')
    }
    Employee.create(newEmployee, function (err, employee) {
        if (err) {
            return next(err)
        }
    });
    res.redirect('/')
});


//update an employee
app.get("/employee/edit", function(req, res) {
	Employee.findById(req.param('_id')).then(function(employee) {
		res.render('employee_edit',
		{ 
			title: employee.title,
			employee: employee
		});
	});
});


//save updated employee
app.post('/employee/edit', function(req, res) {
    Employee.findById(req.param('_id'), function(err, employee) {
        employee.title = req.param('title')
        employee.name = req.param('name')
        employee.save(function () {
            if (err) return handleError(err);
            res.redirect('/');
        })
    })
});

//delete an employee
app.post('/employee/delete', function(req, res) {
	Employee.findByIdAndRemove(req.param('_id')).then(function(error) {
		res.redirect('/')
	});
});

app.listen(process.env.PORT || 3000);
