# To-Do List Application

## Introduction

Welcome to the To-Do List application! This application allows users to manage their tasks efficiently. Keep track of your to-do items, update task details, and mark tasks as complete.

## Instructions

### Installation

1. Clone the repository to your local machine.
   ```bash
   git clone https://github.com/Milindsable/ToDoList.git
2. Navigate to the project directory.
   cd ToDoList
3. Install the necessary dependencies.
   npm install
4. Set up your MySQL database. Update the database configuration in config.js with your database credentials.
5. Start the application.
   npm start
6. Open your web browser and go to http://localhost:8081.


#Usage

1. Login or Register:
If you are an existing user, log in with your credentials.
New users can register with a unique username and password.

2.View Tasks:
After logging in, you will see a list of your tasks.
Add Task:

3. Click on the "Add Task" button to create a new task.
Enter the task title and description.

4.Edit Task:
Click on the "Edit" button next to a task to modify its details.

5.Delete Task:
To remove a task, click on the "Delete" button.

6.Mark task as completed:
Click on complete button to mark task as completed.

7.Logout:
Log out when you are done.

#Code Structure and Key Decisions

#Project Structure

app.js: Main application file.
views/: Contains EJS templates for rendering views.
public/: Holds static files (CSS, client-side scripts).
routes/: Defines routes and handles requests.
models/: Defines database models and interactions.
config.js: Configuration file for database connection.

#Key Decisions

1. MVC Architecture:
The project follows the Model-View-Controller (MVC) architecture for better organization and separation of concerns.

2. Express.js:
Express.js is used as the web application framework for its simplicity and flexibility.

3. EJS Templating Engine:
EJS is chosen as the templating engine for server-side rendering of views.

4. MySQL Database:
MySQL is used as the database for storing user information and tasks.

5. Session Management:
Express-session is implemented for user authentication and session management.

6. Error Handling:
Robust error handling is implemented to enhance the application's reliability.

#Feel free to explore the codebase for more details on implementation.
#This README template provides clear instructions on how to use your To-Do List application and offers insights into the code structure and key decisions made during development.

