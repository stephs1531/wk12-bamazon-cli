//Require mysql and inquirer
var mysql = require("mysql");
var inquirer = require("inquirer");

//Create connection to database
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Ginger998!",
    database: "bamazon_db"
  });

  connection.connect(function(err, res) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    // console.table(res);
   
    start();
  });

  //start function with inquirer prompts
  function start() {
    
    //function to console.table products
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        console.table(res);
      });
      
    // inquirer prompts
      inquirer
        .prompt([
            {
          name: "itemID",
          type: "input",
          message: "What is the id of the item you wish to buy?",
            },
            {
            name: "quantity",
            type: "number",
            message: "How many do you want?"
            }
        ])
        .then(function(answer) {
         console.log(answer);
        });
     };