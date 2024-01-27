var express = require("express"); 
var mysql = require('mysql2');
var session = require('express-session');
var ejs = require('ejs');
const bodyParser = require("body-parser");
var app = express();

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root123',
    database:'todolist',
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    connection.connect(function (err) {
        if (err) throw err;
        next();
    });
});
app.use(session({
    secret: 'your-secret-key', // Change this to a strong, random string
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));



app.get("/", function(request, response){    
	response.sendFile(__dirname+"/Login.html");
});
app.post("/", function(request, response){

        const username = request.body.loginUsername;
        const password = request.body.loginPassword;

        var sql = "select password from user where username = '"+username+"'";
        connection.query(sql, function(err,result)
        {
            if(err) throw err;

            if(result.length === 0)
            {
                response.send('<script>alert("User not found !"); window.location.href = "/Login.html";</script>');
            }
            else if(password !== result[0].password)
            {
                response.send('<script>alert("Login Failed!"); window.location.href = "/Login.html";</script>');
            }
            else
            {
                request.session.username = username;
                response.send('<script>alert("Login Successful!"); window.location.href = "/Index.html";</script>');
            } 
        });
    });	




app.get("/Login.html", function(request, response){    
	response.sendFile(__dirname+"/Login.html");
});


app.get("/Register.html", function(request, response){
    response.sendFile(__dirname + "/Register.html");
});
app.post("/Register.html", function(request, response){

        const username = request.body.registerUsername;
        const phoneNumber = request.body.phoneNumber;
        const password = request.body.registerPassword;

        var sql = "Insert into user(Username,Password,Phonenumber) values ('"+username+"','"+password+"','"+phoneNumber+"')";
        connection.query(sql, function(err,result)
        {
            if(err) throw err;
            response.send('<script>alert("Registration Successful!"); window.location.href = "/Login.html";</script>');
            response.end();

        });
    });


app.get("/Index.html", function(request, response){    
	response.sendFile(__dirname+"/Index.html");
});
app.post("/Index.html", function(request, response){    
	
    if(request.session.username != undefined)
    {
        const title = request.body.title;
        const description = request.body.description;

        connection.query("select UserID from user where username= ?;",[request.session.username],function(err,result)
        {
            if(err) throw err;
            var userid = result[0].UserID;

            var sql = "Insert into tasks(Tasktitle,TaskDescription,UserID) values ('"+title+"','"+description+"','"+userid+"')";
            connection.query(sql, function(err,result)
            {
                if(err) throw err;
                response.send('<script>alert("Task Added Successfully!"); window.location.href = "/Index.html";</script>');
                response.end();
            });
        });  
    }
    else
    {
        response.send('<script>alert("Please login first !!"); window.location.href = "/Login.html";</script>');
    }
});

app.get("/logout", function(request, response) {
    request.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            response.redirect("/Login.html"); // Redirect to login page after logout
        }
    });
});

app.get("/views/tasks.ejs", function(request, response) {

    if(request.session.username != undefined)
    {
        connection.query("select UserID from user where username= ?;",[request.session.username],function(err,result)
        {
            if(err) throw err;
            var userid = result[0].UserID;

            connection.query('SELECT Tasktitle, TaskDescription FROM tasks where UserID=?', userid ,(err, results) => {
                if (err) throw err;
                response.render('tasks', { tasks: results });
            });
        });  
    }
    else
    {
        response.send('<script>alert("Please login first !!"); window.location.href = "/Login.html";</script>');
    }
});


app.get("/views/EditForm.ejs", function(request, response){  
    
    
    if(request.session.username != undefined)
    {
        const title = request.query.title;
        const description = request.query.description;

        connection.query("select idTasks from tasks where Tasktitle = ? and TaskDescription = ?;",[title,description],function(err,result)
        {
            if(err) throw err;

            if (result.length > 0) 
            {
                var id = result[0].idTasks;
                request.session.taskid = id;

                response.render("EditForm", { title, description });
            } 
            else
            {
                response.send('<script>alert("Task not found!"); window.location.href = "/views/tasks.ejs";</script>');
            }
        });
    }
    else
    {
        response.send('<script>alert("Please login first !!"); window.location.href = "/Login.html";</script>');
    }
});
app.post("/views/EditForm.ejs", function(request, response){    
	
    if(request.session.username != undefined)
    {
        const title = request.body.title;
        const description = request.body.description;

        connection.query("update tasks set TaskDescription = ? where Tasktitle = ? and idTasks = ?",[description,title,request.session.taskid],function(err,result)
        {
            if(err) throw err;
            response.send('<script>alert("Task Description updated successfully !!"); window.location.href = "/views/tasks.ejs";</script>');
        });
    }
    else
    {
        response.send('<script>alert("Please login first !!"); window.location.href = "/Login.html";</script>');
    }
});

app.get("/deleteTask", function(request, response){  
    
    
    if(request.session.username != undefined)
    {
        const title = request.query.title;
        const description = request.query.description;

        connection.query("select idTasks from tasks where Tasktitle = ? and TaskDescription = ?;",[title,description],function(err,result)
        {
            if(err) throw err;

            if(result.length > 0) 
            {
                var id = result[0].idTasks;
                
                connection.query("delete from tasks where idTasks=?",id,function(err,result)
                {
                    if(err) throw err;
                    response.send('<script>alert("Task Deleted Successfully !!"); window.location.href = "/views/tasks.ejs";</script>');
                });
            } 
            else
            {
                response.send('<script>alert("Task not found!"); window.location.href = "/views/tasks.ejs";</script>');
            }
        }); 
    }
    else
    {
        response.send('<script>alert("Please login first !!"); window.location.href = "/Login.html";</script>');
    }
});

app.get("/completeTask", function(request, response){  
    
    
    if(request.session.username != undefined)
    {
        const title = request.query.title;
        const description = request.query.description;

        connection.query("select idTasks from tasks where Tasktitle = ? and TaskDescription = ?;",[title,description],function(err,result)
        {
            if(err) throw err;

            if(result.length > 0) 
            {
                var id = result[0].idTasks;
                
                connection.query("select Taskstatus from tasks where idTasks=?",id,function(err,result)
                {
                    if(err) throw err;

                    if(result[0].Taskstatus == '0')
                    {
                        connection.query("update Tasks set Taskstatus='1' where idTasks=?",id,function(err,result)
                        {
                            if(err) throw err;
                            response.send('<script>alert("Task marked as completed !!"); window.location.href = "/views/tasks.ejs";</script>');
                        });
                    }
                    else
                    {
                        response.send('<script>alert("Task is already marked as completed !!"); window.location.href = "/views/tasks.ejs";</script>');
                    }
                });
            } 
            else
            {
                response.send('<script>alert("Task not found!"); window.location.href = "/views/tasks.ejs";</script>');
            }
        });
    }
    else
    {
        response.send('<script>alert("Please login first !!"); window.location.href = "/Login.html";</script>');
    }
});

app.listen(8081);
console.log("Server is running at http://localhost:8081");

