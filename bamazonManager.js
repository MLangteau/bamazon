var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
	database: "bamazon"
});

connection.connect(function (err) {
	if (err) throw err;
	decideAction();
});

var choiceA = "\n View Products for Sale";
var choiceB = "View Low Inventory";
var choiceC = "Add to Inventory";
var choiceD = "Add New Product";
var choiceE = "Quit";

// List a set of menu options (below):
var decideAction = function() {
	inquirer.prompt({
		name: "action",
		type: "list",
		message: "What would you like to do?",
//		choices: ["\nView Products for Sale","View Low Inventory", 
//				  "Add to Inventory", "Add New Product","Quit"]
		choices: [choiceA, choiceB, choiceC, choiceD, choiceE]

	}).then(function(answer) {
		switch(answer.action) {
			case choiceA:
			viewProducts();
			break;

			case choiceB:
			viewLowInventory();
			break;

			case choiceC:
			addInventory();
			break;

			case choiceD:
			addProduct();
			break;

			case choiceE:
			connection.end(function(){
				console.log('Ended manager function; goodbye.');
			});
			break;
		}
	}
)};

var viewProducts = function() {
	console.log("\nin viewProducts");
// If a manager selects View Products for Sale, the app should 
// list every available item: the item IDs, names, prices, and quantities.
	connection.query ('SELECT `item_id`,`product_name`, `price`, `stock_quantity` FROM `products`',function (error, result) {
		if (error) throw error;
		for (var i = 0; i<result.length; i++) {
			console.log("Item ID: " + result[i].item_id + " || Product Name: " + result[i].product_name 
				+ " || Price: $" + result[i].price + " || Quantity in stock: " + result[i].stock_quantity 
				+ "\n");
		}
		decideAction();
	});
}

// If a manager selects View Low Inventory, then list all items with an 
// 		inventory count lower than five.
var viewLowInventory = function() {
	console.log("in viewLowInventory");
	var query = 'SELECT `item_id`,`product_name`, `price`, `stock_quantity` FROM `products` WHERE stock_quantity BETWEEN 0 AND 4';
	connection.query(query, function (error, result) {
		if (error) throw error;
		console.log("Items with Low Inventory: \n");
		for (var i = 0; i<result.length; i++) {
			console.log("Item ID: " + result[i].item_id + " || Product Name: " + result[i].product_name 
				+ " || Price: $" + result[i].price + " || Quantity in stock: " + result[i].stock_quantity 
				+ "\n");
		}

		decideAction();
	});
};

// If a manager selects Add to Inventory, display a prompt that will let the manager
//   "add more" of any item currently in the store.
var addInventory = function() {
	console.log("\nin addInventory\n");
	inquirer.prompt([{
	    name: "id_num",
	    type: "input",
	    message: "Enter item # of the item you would like to add to: ",
	    validate: function(value) {
	      if (isNaN(value) === false) {
	        return true;
	      }
	      return false;
	    }
  	}, 
  	{
    name: "units",
    type: "input",
    message: "Enter the number of units of the product you would like to add to: ",
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
  	}
  }]).then(function(answer) {

    var query = "SELECT * FROM `products` WHERE `item_id` = ?";
    connection.query(query, [answer.id_num], function(error, result) {
    	if (error) throw error("Either read error or item number not found");

      	str = JSON.stringify(result, null, 2);
      	console.log("\nresult: " + str);

      	str2 = JSON.stringify(result[0], null, 2);
      	console.log("\nresult[0]: " + str2);

      	console.log("\nanswer.id_num: " + answer.id_num);
   		console.log("\nanswer.units: " + answer.units);

		// if the quantity on hand (stock_quantity) is greater than or equal 
		//   to the amount wanted, subtract the amount wanted (answer.units)
		//  from the quantity on hand
//		var updatedQuantity = result[0].stock_quantity + answer.units;
		var updatedQuantity = parseInt(result[0].stock_quantity) + parseInt(answer.units);

		console.log("updatedQuantity: " + updatedQuantity);
// Update the database to reflect the remaining quantity
	    connection.query("UPDATE `products` SET ? WHERE ?", [
	    {
		stock_quantity: updatedQuantity
        }, 
        {
          item_id: answer.id_num
        }
        ], function(error) {
          if (error) throw err;
          console.log("Updated successfully!");
          //start();
        });
		connection.end(function(err){
  			if (err) throw err;
        	// shows the connection number established
		    console.log('Disconnected!', connection.threadId);
      	});
  
    	});
    decideAction();
  	});
};

// If a manager selects Add New Product, allow the manager to add a completely new
//		product to the store product_name, department_name, price, stock_quantity.
var addProduct = function() {
	console.log("in addProduct");
	inquirer.prompt([
	{
	    name: "prod",  // product_name
	    type: "input",
	    message: "Enter product name to add: ",
	    validate: function(value) {
			var regex  = /^\d+(?:\.\d{0,2})$/;
			var numStr = value;
			if (regex.test(numStr)) {
				return false;
			}
			else {
		      return true;
		  	}
	  	}
  	}, 
	{
	    name: "dept",  // department_name
	    type: "input",
	    message: "Enter product's department name to add: ",
	    validate: function(value) {
			var regex  = /^\d+(?:\.\d{0,2})$/;
			var numStr = value;
			if (regex.test(numStr)) {
				return false;
			}
			else {
		      return true;
		  	}
	  	}
  	}, 
  	{
	    name: "prodPrice", ////////price
	    type: "input",
	    message: "Enter price of item you would like to add: ",
	    validate: function(value) {
			var regex  = /^\d+(?:\.\d{0,2})$/;
			var numStr = value;
			if (regex.test(numStr)) {
				console.log("\nPrice entered is : $" + numStr);
				newPrice = +numStr;
				return true;
			}
			else {
		      return false;
		  	}
	  	}
  	}, 
  	{
	    name: "units",
	    type: "input",
	    message: "\nEnter the quantity of the product to add to stock: ",
	    validate: function(value) {
	      if (isNaN(value) === false) {
	        return true;
	      }
	      return false;
	  	}
	}
	]).then(function(answer) {

//    var query = "SELECT * FROM `products` WHERE `item_id` = ?";
//    connection.query(query, [answer.id_num], function(error, result) {

    //CREATE
		connection.query("INSERT INTO `products` SET ?", {
				 product_name: answer.prod,
			  department_name: answer.dept,
					 price   : answer.prodPrice,
			   stock_quantity: answer.units
		}, function(err, res) {
			if (err) throw err("ERROR: Did not add products to inventory, try again");
		});
		console.log("Added to Inventory");
    	connection.end(function(err){
  		  if (err) throw err;
        // shows the connection number established
		    console.log('Disconnected!', connection.threadId);
      	});  // end of connection end
	}) // end of then(function(answer))
  };  

// );
//	decideAction();
//};
/*

	    validate: function () {  // isAlphaNumeric function
  			var code, i, len;
			for (i = 0, len = str.length; i < len; i++) {
    			code = str.charCodeAt(i);
			    if (!(code > 47 && code < 58) && // numeric (0-9)
			        !(code > 64 && code < 91) && // upper alpha (A-Z)
			        !(code > 96 && code < 123)) { // lower alpha (a-z)
			      return false;
			    }
  			}
  			console.log("Good value: " + answer.price);
  			return true;
		};

*/


/*
CREATE TABLE `products` (
	`item_id` INT AUTO_INCREMENT,
	`product_name` VARCHAR (255) NULL,
	`department_name` VARCHAR (255) NULL,
	`price` DECIMAL(10,2) NULL,
	`stock_quantity` INT NULL,
	PRIMARY KEY (`item_id`)
);

INSERT INTO `products` (product_name, department_name, price, stock_quantity)
VALUES ("Super Duty Air Wrench","Tools",11.00,5),
	("Countertop Dishwasher","Appliances",399.99,10),
	("Best Ways to Find a Fantastic Web Development Job","Books",24.50,15),
*/
