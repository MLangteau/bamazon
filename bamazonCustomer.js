// requiring mysql server
var mysql = require("mysql");
// requiring inquirer package for 
var inquirer = require("inquirer");
// creating connection to my local host
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon"
});

connection.connect(function(err){
	if (err) throw err;
// shows the connection number established
	console.log('Connected!', connection.threadId);
})

// Display all items available for sale (ids, names, and prices of products)
connection.query ('SELECT `item_id`,`product_name`, `price` FROM `products`',function (error, result) {
	if (error) throw error;
//	console.log('All Products: ', result);
	for (var i = 0; i<result.length; i++) {
		console.log("Item ID: " + result[i].item_id + " || Product Name: " + result[i].product_name + " || Price: $" + result[i].price + "\n");
	}
	rangeSearch();
});

/*
// price is the cost to the customer
CREATE TABLE `products` (
	`item_id` INT AUTO_INCREMENT,
	`product_name` VARCHAR (255) NULL,
	`department_name` VARCHAR (255) NULL,
	`price` DECIMAL(10,2) NULL,
	`stock_quantity` INT NULL,
	PRIMARY KEY (`item_id`)
);
*/

/*
The app should then prompt users with two messages.

The first should ask them the ID of the product they would like to buy.
The second message should ask how many units of the product they would like to buy.
*/

var rangeSearch = function() {
  inquirer.prompt([{
    name: "id_num",
    type: "input",
    message: "Enter ID of the item you would like to buy: ",
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  }, {
    name: "units",
    type: "input",
    message: "Enter the number of units of the product you would like to buy: ",
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
  	}
  }]).then(function(answer) {

    var query = "SELECT * FROM `products` WHERE `item_id` = ?";
    connection.query(query, [answer.id_num], function(error, result) {
//    connection.query("SELECT * FROM `products` WHERE `item_id` = ?",[answer.id_num], function(err, result) {
    	if (error) throw error;

    	str = JSON.stringify(result, null, 2);
    	console.log("result: " + str);

    	str2 = JSON.stringify(result[0], null, 2);
    	console.log("result[0]: " + str2);

    	console.log("answer.id_num: " + answer.id_num);
		console.log("answer.units: " + answer.units);

      	if (result[0].stock_quantity >= answer.units) {
      		// if the quantity on hand (stock_quantity) is greater than or equal 
      		//   to the amount wanted, subtract the amount wanted (answer.units)
      		//  from the quantity on hand
      		var updatedQuantity = result[0].stock_quantity - answer.units;
      		var costWithoutTax = result[0].price * answer.units;
      		console.log("cost of item(s): " + costWithoutTax);
      		console.log("updatedQuantity: " + updatedQuantity);
// Update the database to reflect the remaining quantity
  		    connection.query("UPDATE `products` SET ? WHERE ?", [{
        	  stock_quantity: updatedQuantity
		        }, {
		          item_id: answer.id_num
		        }], function(error) {
		          if (error) throw err;
		          console.log("Updated successfully!");
		          //start();
		        });
			// Once the update goes through, show the customer the 
			// total cost of their purchase
			console.log("Price of item (tax free today): $" + costWithoutTax);
      }
      else  // if there is not enough quantity of the item to fulfill the order
      		//    then the order is canceled.
      {
      	console.log("Insufficient quantity; cannot fill this order!");
      }
      connection.end(function(err){
		if (err) throw err;
	// shows the connection number established
		console.log('Disconnected!', connection.threadId);
	});
     // runSearch();
    });
  });
};

/*
var genre = 'Dance',
limit = 2;
connection.query("SELECT * FROM `songs` WHERE `genre` = ? LIMIT ?", [genre, limit], 
*/
/*
var runSearch = function() {
  inquirer.prompt({
    name: "id",
    type: "int",
    message: "What would you like to do?",
    choices: [
      "Find songs by artist",
      "Find all artists who appear more than once",
      "Find data within a specific range",
      "Search for a specific song",
      "Find artists with a top song and top album in the same year"
    ]
  }).then(function(answer) {
    switch (answer.action) {
      case "Find songs by artist":
        artistSearch();
        break;

      case "Find all artists who appear more than once":
        multiSearch();
        break;

      case "Find data within a specific range":
        rangeSearch();
        break;

      case "Search for a specific song":
        songSearch();
        break;

      case "Find artists with a top song and top album in the same year":
        songAndAlbumSearch();
        break;
    }
  });
};

*/
/*
connection.end(function(err){
	if (err) throw err;
// shows the connection number established
	console.log('Disconnected!', connection.threadId);
});
*/