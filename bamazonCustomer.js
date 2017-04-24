// requiring mysql server
var mysql = require("mysql");
// requiring inquirer package for 
var inquirer = require("inquirer");
var Table = require('cli-table2');

var deptProdTotalSales = 0;
var deptName = 0;
var totalRevenue = 0;
//var prodArray = []; 

var prodAnswer = [];
//var result = {};

var willFillOrder = false;
var updatedStock = false;

var custQuery = "SELECT `item_id`,`product_name`, `price` FROM `products`";
var custColm = ['item_id','product_name', 'price'];
var custColWid = [40,50,40];

var allQuery = "SELECT * FROM `products`";
var allColm = ['item_id','product_name', 'department_name','price','stock_quantity'];
var allColWid = [20,50,30,20,20];

// creating connection to my local host
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
	database: "bamazon"
});

//=================================================================================
//  This begins it all and prints out a customer list.
//=================================================================================
connection.connect(function(err){
	if (err) throw err;
// shows the connection number established
	console.log('Connected!', connection.threadId);

//  displayAnyTable(custQuery, custColm, custColWid);
  displayAnyTable(allQuery, allColm, allColWid);

});

function displayAnyTable(whichQuery, whichColumns, whichColWidth) {
//      var query = "SELECT `item_id`,`product_name`, `price` FROM `products`";
      connection.query(whichQuery, function(err, result) {
      if (err) throw err;
      console.log("sub list;");
// string
      var itemString = JSON.stringify(result, null, 2);
      console.log("itemString: " + itemString);
// JSON 
      var itemParse = JSON.parse(itemString);
      console.log("itemParse: " + itemParse);

      var whichTable = new Table ({
          head: whichColumns,
          colWidths: whichColWidth
      });
      
      for (var i = 0; i < itemParse.length; i++){
          // new array for holding table/items (used to show pretty table)
          var prodArray = new Array();
          // add items to array (used to show pretty table)
          whichTable.push(prodArray);
          for (var j = 0; j < whichColumns.length; j++) {
              prodArray.push(itemParse[i][whichColumns[j]]);
    //          console.log("Each row: ", itemParse[i][custColm[j]]);
          }
      }
      console.log("\n\n\n\n\n\n\n\n\n\n\n\n");
      console.log(whichTable.toString());
      console.log("\n\n\n");
      chooseItem();
    });


}  // end of displayAnyTable() function

function chooseItem() {

    inquirer.prompt([
    {
        name: "id_num",
        type: "input",
        message: "Enter Item ID of the item you would like to buy: ",
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
          message: "Enter the number of units of the product you would like to buy: ",
          validate: function(value) {
              if (isNaN(value) === false) {
                  return true;
              }
              return false;
          }
    }]).then(function(answer) {
        checkStockQuant(answer.id_num, answer.units);
    });
}  // end of chooseItem() function

function checkStockQuant(id, quant) {
//    connection.query("SELECT * FROM `products` WHERE `item_id` = ?",[answer.id_num], function(err, result) {

      var query = "SELECT * FROM `products` WHERE `item_id` = ?";
      connection.query(query, [id], function(error, result) {
          if (error) throw error;
          
          console.log("Item ID: " + result[0].item_id);
          console.log("result[0]: stringify " + JSON.stringify(result[0], null, 2));

          // holds this for use in other functions
     //     prodAnswer.push(result[0]);
          prodAnswer = result[0];

     //   console.log("prodAnswer[i]: " + result[0]);

      //    var str = JSON.stringify(result, null, 2);
      //    console.log("result: " + str);

          var str2 = JSON.stringify(result[0], null, 2);
          console.log("result[0]: " + str2);

          var stockOnHand = (JSON.parse(result[0].stock_quantity));
          console.log("Stock on hand: " + stockOnHand);

          console.log("answer.id_num: " + id);
          console.log("answer.units: " + quant);
          console.log("result[0]stock_quantity: ", result[0].stock_quantity);
      
          console.log("WHERE prodAnswer: " + prodAnswer);
    //      willFillOrder = false;
          if (parseInt(result[0].stock_quantity) >= parseInt(quant)) {

              console.log("stock_quantity " + result[0].stock_quantity + " > quant " + quant);

                // if the quantity on hand (stock_quantity) is greater than or equal 
                //   to the amount wanted, subtract the amount wanted (answer.units)
                //  from the quantity on hand
                var updatedQuantity = parseInt(result[0].stock_quantity) - parseInt(quant);

                // totalRevenue of purchase is the price of the item * amount purchased
                var totalRevenue = parseFloat(result[0].price) * parseFloat(quant);
                
                // precise_round is a function that gives two decimal places only (in this case)
                totalRevenue = precise_round(totalRevenue, 2);

                // productTotalSales is the previous product_sales in table plus(+) totalRevenue
                var productTotalSales = parseFloat(result[0].product_sales) + parseFloat(totalRevenue);

                console.log("productTotalSales (before parseFloat): $" + productTotalSales);

                productTotalSales = precise_round(productTotalSales, 2);

                console.log("productTotalSales: $" + productTotalSales);
                console.log("result[0].product_sales: $" + result[0].product_sales);
                console.log("totalRevenue: $" + totalRevenue);
                console.log("totalRevenue which equals cost of item(s): $" + totalRevenue);

                console.log("Quantity to be updated: " + updatedQuantity);
                willFillOrder = true;
                console.log("willFillOrder?" + willFillOrder);
            }
            else {
                willFillOrder = false;
                console.log("Insufficient quantity; cannot fill this order!");
            } // end of if (parseInt(result[0].stock_quantity) >= parseInt(quant))
            console.log("OUT OF Connection query before update");
// Update the products database to reflect the remaining quantity and add the product_sales
            var updatedStock = false;
            if (willFillOrder) {
                console.log("Here to update");
                connection.query("UPDATE `products` SET ? WHERE ?", [
                    {
                    stock_quantity: updatedQuantity, product_sales: productTotalSales
                    }, 
                    {
                      item_id: id
                    }
                    ], function(error) {
                    
                      if (error) throw error("Error: did not update quantity and product_sales.");
                      console.log("Updated quantity and product_sales successfully!");
                      updatedStock = true;
                });

                // update product sales for the department name
                updateDeptSales(productTotalSales, updatedStock, prodAnswer, totalRevenue);
            } // end of if (willFillOrder)
      });  // end of connection query
 //     displayAnyTable(allQuery, allColm, allColWid);
      console.log("updatedStock " + updatedStock);
}  // end of function checkStockQuant(id, quant) 


function updateDeptSales(totSales, stockUpdate, prod, revenue) {

  console.log("totSales: " + totSales + " stockUpdate: " + stockUpdate);
  console.log(" prod department: " + prod.department_name);

// Update the departments database to add the product_sales the appropriate department_name
        var nextQuery = "SELECT * FROM `departments` WHERE `department_name` = ?";
        console.log("WHAT?????" + nextQuery, prod.department_name);
        deptName = prod.department_name;
        connection.query(nextQuery, deptName, function(err, result3) {
          if (err) throw err;// (" SHOOP updated the products, but not the department");
          console.log("WOOF totalRevenue: " + revenue);
        //  console.log("department from sale: " + result3[0].department_name);
        //  console.log("result3[0].total_sales: " + result3[0].total_sales);
        console.log("result3 ", result3);

          deptProdTotalSales = parseFloat(result3[0].total_sales) + parseFloat(revenue);

          deptProdTotalSales = precise_round(deptProdTotalSales, 2);

          console.log("deptProdTotalSales: " + deptProdTotalSales);

          });

          // update the database with the        
          connection.query("UPDATE `departments` SET ? WHERE ?", [
            {
              total_sales: deptProdTotalSales
            }, 
            {
              department_name: deptName
            }
            ], function(error3) {
              if (error3) throw error3;
              console.log("deptProdTotalSales" + deptProdTotalSales + " deptName " + deptName);
              console.log("Updated departments total_sales successfully!");
              // Once the update goes through, show the customer the 
              // total cost of their purchase
          console.log("Price of item (tax free): $" + totalRevenue);

          });


/*  Future development
    if (stockUpdate) {

    }
    else {
        // back out of the products issue
    } // end of if/else
*/
}  // end of updateDeptSales function

function precise_round(num, decimals) {
   var t = Math.pow(10, decimals);   
   return (Math.round((num * t) + (decimals>0?1:0)*(Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
}