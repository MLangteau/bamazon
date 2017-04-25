var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table2');

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
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

var allQuery = "SELECT * FROM `departments`";
var allColm = ['department_id','department_name','over_head_costs','total_sales'];
var allColmNames = ["Department ID","Department Name","Overhead Costs","Products' Total Sales","Total Profit"];
var allColWid = [20,30,20,35,20];

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
	//		viewProdSales();
			displayAnyTable(allQuery, allColm, allColWid, allColmNames);
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

function displayAnyTable(whichQuery, whichColumns, whichColWidth, whichColNames) {
//      var query = "SELECT `item_id`,`product_name`, `price` FROM `products`";
      connection.query(whichQuery, function(err, result) {
      if (err) throw err;
      //console.log("sub list;");
// string
      var itemString = JSON.stringify(result, null, 2);
//      console.log("itemString: " + itemString);
// JSON 
      var itemParse = JSON.parse(itemString);
//      console.log("itemParse: " + itemParse);

      var whichTable = new Table ({
          head: whichColNames,
          colWidths: whichColWidth
      });
      
      for (var i = 0; i < itemParse.length; i++){
          // new array for holding table/items (used to show pretty table)
          var prodArray = new Array();
          // add items to array (used to show pretty table)
          whichTable.push(prodArray);

          for (var j = 0; j <= whichColumns.length; j++) {
        //      console.log("whichColNames[j]: " + whichColNames[j] + " j: " + j);
              if (j === 4) {
              	//  totalProfit is (total_sales minus over_head_costs)
              	//  total_sales: itemParse[i][whichColumns[3]]
              	//  minus over_head_costs is:  itemParse[i][whichColumns[2]]
              	//  (calculated below)
//             	console.log("Total Sales is parseFloat(itemParse[i][whichColumns[3]]): " + parseFloat(itemParse[i][whichColumns[3]]));
//             	console.log("Overhead Costs is parseFloat(itemParse[i][whichColumns[2]]): " + parseFloat(itemParse[i][whichColumns[2]]));
					var totalProfit = parseFloat(itemParse[i][whichColumns[3]]) - parseFloat(itemParse[i][whichColumns[2]]);
					    totalProfit = precise_round(totalProfit, 2);              		
              		prodArray.push(totalProfit);
//              		console.log("Each row(totalProfit): ", totalProfit);	
              }
              else {  
              prodArray.push(itemParse[i][whichColumns[j]]);
//              console.log("Each row(itemParse): ", itemParse[i][whichColumns[j]]);
          	  }
          }
      }

/*


connection.query("SELECT `artist`, COUNT(`artist`) AS `artcount` FROM top5000 GROUP BY `artist`", function(err, res) {
    if (err) throw err;
    //console.log(res);
    for(i=0; i < res.length; i++)
    {
        if(res[i].artcount > 1)
        {
            console.log(res[i]);
        }
    }

});

*/

      console.log("\n\n\n\n\n\n\n\n\n\n\n\n");
      console.log(whichTable.toString());
      console.log("\n\n\n");
      decideAction();
    });
}  // end of displayAnyTable() function


/* ===  OLD PRODUCT SALES DISPLAY BELOW ==== 

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
 ===  OLD PRODUCT SALES DISPLAY ABOVE ==== */

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