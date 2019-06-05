//Require mysql and inquirer
var mysql = require("mysql");
var inquirer = require("inquirer");

//experiment with cli-table to make a prettier looking table
var Table = require("cli-table");
var table = new Table ({
  head: ["Item Id", "Item", "Department", "Price", "Quantity"],
  colWidths: [20, 40, 15 ,15, 15]
});

//Create connection to database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Ginger998!",
    database: "bamazon_db"
  });

  connection.connect(function(err, res) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
  });

  //start shopping function
  shop();

  function shop() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
      
      //add rows from database to cli-table
      for (var i = 0; i<res.length; i++) {
        table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price.toFixed(2), res[i].stock_quantity])
      }
      console.log(table.toString());

        //inquirer prompts to ask user what they want to buy and how much
      inquirer.prompt([{
        name: "choice",
        type: "list",
        message: "What do you want to buy?",
        choices: function (value) {
          //pull choices from database response from our query and put them into a new array to choose from
          var choices = [];
          for (var i = 0; i < res.length; i++) {
            choices.push(res[i].product_name);
          }
          return choices;
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "How many do you want?"
      }
      ]).then(function (answer) {
        //sort through table object to find data that matches the user's choice and make a new variable for that data
        for (var i =0; i<res.length; i++) {
          if (res[i].product_name == answer.choice) {
            var userChoice = res[i];
          }
          console.log(userChoice);
        }

        //create variables for purchase total and the math to update stock
        var updateStock = parseInt(userChoice.stock_quantity) - parseInt(answer.quantity);
        var total = (parseFloat(answer.quantity) * userChoice.price).toFixed(2);

        //update stock after a purchase
        if (userChoice.stock_quantity < parseInt(answer.quantity)) {
          console.log("Out of stock!");
          startOver();
        }
        else {
          connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: updateStock}, {item_id: userChoice.item_id}], function (err, res) {
            if (err) throw err;
            console.log(`
            Thanks for your purchase!
            Your total is: ${total}
            `);
            startOver();
          })
        }
      }); //close inquirer prompt

    }); //close connection.query

  
  }; // close shop();

  //function to start the program again after a sale or quit
  function startOver() {
    inquirer.prompt({
      name: "startOver",
      type: "list",
      message: "Would you like to purchase another item?",
      choices: ["Yes", "No"]
    }).then(function (answer) {
      if (answer.startOver == "Yes") {
        shop();
      }
      else {
        console.log("Thanks for shopping! Come again!")
        connection.end();
      }
    })
  }

  //start function with inquirer prompts
  // function start() {
    
  //   //function to console.table products
  //   var query = "SELECT * FROM products";
  //   connection.query(query, function(err, res) {
  //       console.table(res);
  //     });
      
  //   // inquirer prompts
  //     inquirer
  //       .prompt([
  //           {
  //         name: "itemID",
  //         type: "input",
  //         message: "What is the id of the item you wish to buy?",
  //           },
  //           {
  //           name: "quantity",
  //           type: "number",
  //           message: "How many do you want?"
  //           }
  //       ])
  //       .then(function(answer) {
  //        console.log(answer);
  //       });
  //    };