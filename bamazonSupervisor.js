var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "",
	password: "",
	database: "bamazon"
});

var totProfit = 0;

connection.connect(function (err) {
	if (err) throw err;
	decideAction();
});

var choiceA = "\n View Product Sales by Department";
var choiceB = "Create a New Department";
var choiceQ = "Quit";

// List a set of menu options (below):
var decideAction = function() {
	inquirer.prompt({
		name: "action",
		type: "list",
		message: "What would you like to do?",
		choices: [choiceA, choiceB, choiceQ]

	}).then(function(answer) {
		switch(answer.action) {
			case choiceA:
			viewProdSales();
			break;

			case choiceB:
			addDept();
			break;

			case choiceQ:
			connection.end(function(){
				console.log('Ended Supervisor function; goodbye.');
			});
			break;
		}
	}
)};

var viewProdSales = function() {
	console.log("\nin viewProdSales function");
// If a Supervisor selects View Product Sales by Department, the app should list these:
//  department_id, department_name, over_head_costs, product_sales(total_sales), 
//  & total_profit (calculated).
	connection.query ('SELECT * FROM `departments`',function (error, result) {
		if (error) throw error;
		for (var i = 0; i<result.length; i++) {
			totProfit = result[i].total_sales - result[i].over_head_costs;
			totProfit = precise_round(totProfit, 2);
			console.log("department_id" + result[i].department_id + " || department_name" + result[i].department_name 
				+ " || over_head_costs" + result[i].over_head_costs + " || product_sales " + result[i].total_sales 
				+ " || total_profit" + totProfit + "\n");
		}
		decideAction();
	});
}

// If a Ssupervisor selects Add a New Department, allow the Supervisor to add a completely 
//		new department_name and an over_head_costs value, which is arbitrary for now.
var addDept = function() {
	console.log("in addDept function");
	inquirer.prompt([
	{
	    name: "dept",  // product_name
	    type: "input",
	    message: "Enter new department name: ",
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
	    name: "overheadCost",
	    type: "input",
	    message: "Enter cost of overhead for this department (integer only): ",
	    validate: function(value) {
	      if (isNaN(value) === false) {
	        return true;
	      }
	      return false;
	  	}
	}
	]).then(function(answer) {

    //CREATE
		connection.query("INSERT INTO `departments` SET ?", {
				department_name: answer.dept,
				over_head_costs: answer.overheadCost,
				 total_sales: 0
		}, function(err, res) {
			if (err) throw err("ERROR: Did not add department; please try again.");
		});
		console.log("Added Department");
    	connection.end(function(err){
  		  if (err) throw err;
        // shows the connection number established
		    console.log('Disconnected!', connection.threadId);
      	});  // end of connection end
	}) // end of then(function(answer))
  };  

function precise_round(num, decimals) {
   var t = Math.pow(10, decimals);   
   return (Math.round((num * t) + (decimals>0?1:0)*(Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
}