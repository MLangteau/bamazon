// requiring mysql server
var mysql = require("mysql");
// requiring inquirer package for 
var inquirer = require("inquirer");
// creating connection to my local host
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "",
	password: "",
	database: "bamazon"
});

var trythis = 0;
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
	buyItem();
});

/*
The first prompt should ask them the item_id of the product they would like to buy.
The second prompt should ask how many units of the product they would like to buy.
*/

var buyItem = function() {
  inquirer.prompt([{
    name: "id_num",
    type: "input",
    message: "Enter Item ID of the item you would like to buy: ",
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

      	if (parseInt(result[0].stock_quantity) >= parseInt(answer.units)) {
      		// if the quantity on hand (stock_quantity) is greater than or equal 
      		//   to the amount wanted, subtract the amount wanted (answer.units)
      		//  from the quantity on hand
      		var updatedQuantity = parseInt(result[0].stock_quantity) - parseInt(answer.units);

          // totalRevenue of purchase is the price of the item * amount purchased
          var totalRevenue = parseFloat(result[0].price) * parseFloat(answer.units);
          
          // precise_round is a function that gives two decimal places only (in this case)
          totalRevenue = precise_round(totalRevenue, 2);

          // productTotalSales is the previous product_sales in table + totalRevenue
          var productTotalSales = parseFloat(result[0].product_sales) +
                     parseFloat(totalRevenue);     

          console.log("productTotalSales (before parseFloat): $" + productTotalSales);

          productTotalSales = precise_round(productTotalSales, 2);

          //var a = parseFloat(productTotalSales);
          //productTotalSales = a;
          console.log("productTotalSales: $" + productTotalSales);
          console.log("result[0].product_sales: $" + result[0].product_sales);

      		console.log("totalRevenue: $" + totalRevenue);
          console.log("totalRevenue which equals cost of item(s): $" + totalRevenue);

      		console.log("updatedQuantity: " + updatedQuantity);

// Update the products database to reflect the remaining quantity and add the product_sales
/*
  		    connection.query("UPDATE `products` SET ? WHERE ?", [
            {
        	  stock_quantity: updatedQuantity, product_sales: productTotalSales
		        }, 
            {
		          item_id: answer.id_num
		        }
            ], function(error) {
		          if (error) throw error("Error: did not update quantity and product_sales. Try again later. ");
		          console.log("Updated quantity and product_sales successfully!");
		          //start();
		      });
          connection.end(function(err){
            if (err) throw err;
            // shows the connection number established
            console.log('Disconnected after update product', connection.threadId);
          });
*/
// Update the departments database to add the product_sales the appropriate department_name

        var nextQuery = "SELECT * FROM `departments` WHERE `department_name` = ?";
        console.log("WHAT?????" + nextQuery, result[0].department_name);

        trythis = result[0].department_name;
//        connection.end();
        connection.query(nextQuery, trythis, function(err, result3) {
          if (err) throw err;// (" SHOOP updated the products, but not the department");
          console.log("WOOF totalRevenue: " + totalRevenue);
        //  console.log("department from sale: " + result3[0].department_name);
        //  console.log("result3[0].total_sales: " + result3[0].total_sales);
        console.log("result3 ", result3);

          var deptProdTotalSales = parseFloat(result3[0].total_sales) + parseFloat(totalRevenue);

          deptProdTotalSales = precise_round(deptProdTotalSales, 2);

          console.log("deptProdTotalSales: " + deptProdTotalSales);
          connection.query("UPDATE `departments` SET ? WHERE ?", [
            {
              total_sales: deptProdTotalSales
            }, 
            {
              department_name: trythis
            }
            ], function(error3) {
              if (error3) throw error3;
              console.log("Updated departments total_sales successfully!");
              //start();
          });
        });
			// Once the update goes through, show the customer the 
			// total cost of their purchase
			console.log("Price of item (tax free): $" + totalRevenue);
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

connection.end(function(err){
	if (err) throw err;
// shows the connection number established
	console.log('Disconnected!', connection.threadId);
});
*/

function precise_round(num, decimals) {
   var t = Math.pow(10, decimals);   
   return (Math.round((num * t) + (decimals>0?1:0)*(Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
}