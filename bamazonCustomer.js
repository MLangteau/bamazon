// requiring mysql server
var mysql = require("mysql");
// requiring inquirer package for 
var inquirer = require("inquirer");
var Table = require('cli-table2');

// productTotalSales is the previous product_sales in products table plus(+) totalRevenue
var productTotalSales = 0;  

var deptProdTotalSales = 0;
var updatedQuantity = 0;
var deptName = 0;
var totalRevenue = 0;
var prodAnswer = [];

// boolean variables 
var willFillOrder = false;
var QuantUpdatePossible = false;

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

  displayAnyTable(custQuery, custColm, custColWid);
//  displayAnyTable(allQuery, allColm, allColWid);

});

function displayAnyTable(whichQuery, whichColumns, whichColWidth) {
//      var query = "SELECT `item_id`,`product_name`, `price` FROM `products`";
      connection.query(whichQuery, function(err, result) {
      if (err) throw err;
      //console.log("sub list;");
// string
      var itemString = JSON.stringify(result, null, 2);
      //console.log("itemString: " + itemString);
// JSON 
      var itemParse = JSON.parse(itemString);
      //console.log("itemParse: " + itemParse);

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
 //     console.log("\n\n Go to 'node bamazonManager.js' for stock_quantity and department_name\n\n");
      chooseItem();
    });


}  // end of displayAnyTable() function

function chooseItem() {
    //totalRevenue = 0;
    inquirer.prompt([
    {
        name: "id_num",
        type: "input",
        message: "\n\nEnter Item ID of the item you would like to buy: ",
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
          message: "\nEnter the number of units of the product you would like to buy: ",
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
          prodAnswer = result[0];
          var stockOnHand = (JSON.parse(result[0].stock_quantity));
          willFillOrder = false;

          if (parseInt(result[0].stock_quantity) >= parseInt(quant)) {
//              console.log("stock_quantity " + result[0].stock_quantity + " > quant " + quant);

                // if the quantity on hand (stock_quantity) is greater than or equal 
                //   to the amount wanted (answer.units), subtract the amount wanted
                //  from the quantity on hand
                updatedQuantity = parseInt(result[0].stock_quantity) - parseInt(quant);

                // totalRevenue of purchase is the price of the item * amount purchased
                totalRevenue = parseFloat(result[0].price) * parseFloat(quant);
                // precise_round is a function that gives two decimal places only (in this case)
                totalRevenue = precise_round(totalRevenue, 2);

                // productTotalSales is the previous product_sales in products table plus(+) totalRevenue
                productTotalSales = parseFloat(result[0].product_sales) + parseFloat(totalRevenue);
                productTotalSales = precise_round(productTotalSales, 2);

    //            console.log("productTotalSales: $" + productTotalSales);
      //          console.log("result[0].product_sales: $" + result[0].product_sales);
        //        console.log("totalRevenue: $" + totalRevenue);
          //      console.log("totalRevenue which equals cost of item(s): $" + totalRevenue);

      //          console.log("Quantity to be updated: " + updatedQuantity);
                willFillOrder = true;
      //          console.log("willFillOrder?" + willFillOrder);
            }
            else {
                willFillOrder = false;
                console.log("Insufficient quantity; cannot fill this order!");
            } // end of if (parseInt(result[0].stock_quantity) >= parseInt(quant))
       //     console.log("OUT OF Connection query before update");
// Update the products database to reflect the remaining quantity and add the product_sales
            QuantUpdatePossible = false;
            if (willFillOrder) {
        //        console.log("Here to update");
          //      console.log("updatedQuantity " + updatedQuantity);
          //      console.log("productTotalSales " + productTotalSales);
          //      console.log("id: " + id);
                connection.query("UPDATE `products` SET ? WHERE ?", [
                    {
                    stock_quantity: updatedQuantity, product_sales: productTotalSales
                    }, 
                    {
                      item_id: id
                    }
                    ], function(err) { 
                      if (err) throw err("Error: did not update quantity and product_sales.");
                //      console.log("Price of item (tax free): $" + totalRevenue);
                //     console.log("Updated quantity and product_sales successfully in products Table!");
                //      QuantUpdatePossible = true;
                    });
                console.log("Price of item (tax free): $" + totalRevenue);
                console.log("Updated quantity and product_sales successfully in products Table!");
                QuantUpdatePossible = true;
                // update product sales for the department name
                updateDeptSales(productTotalSales, QuantUpdatePossible, prodAnswer, totalRevenue);
            } // end of if (willFillOrder)
      });  // end of connection query
/*
      connection.end(function(err){
              if (err) throw err;
              // shows the connection number established
              console.log('Disconnected!', connection.threadId);
      });  // end of connection end
*/

 //     displayAnyTable(allQuery, allColm, allColWid);
 //     console.log("QuantUpdatePossible " + QuantUpdatePossible);
    chooseItem();
}  // end of function checkStockQuant(id, quant) 


function updateDeptSales(totSales, quantityUpdate, prod, revenue) {

//  console.log("totSales: " + totSales + " quantityUpdate: " + quantityUpdate);
//  console.log(" prod department: " + prod.department_name);

// Update the departments database to add the product_sales the appropriate department_name
        var nextQuery = "SELECT * FROM `departments` WHERE `department_name` = ?";
//        console.log("WHAT?????" + nextQuery, prod.department_name);
        deptName = prod.department_name;
        connection.query(nextQuery, deptName, function(err, result3) {
          if (err) throw err;// (" updated the products, but not the department");
       //   console.log("WOOF totalRevenue: " + totalRevenue + " revenue " + revenue + " ");
        //  console.log("department from sale: " + result3[0].department_name);
        //  console.log("result3[0].total_sales: " + result3[0].total_sales);
   //     console.log("result3 ", result3);
          // deptProdTotalSales is the amount of total sales for the department plus the total amount purchased (totalRevenue above)
          deptProdTotalSales = parseFloat(result3[0].total_sales) + parseFloat(revenue);
          deptProdTotalSales = precise_round(deptProdTotalSales, 2);
          deptName = result3[0].department_name;
 //         console.log("before end deptProdTotalSales: " + deptProdTotalSales);
 //         console.log("before end deptName: " + deptName);

//          });  // end of result3 query

          // update the database with the        
  //      console.log("Mixer: " + deptProdTotalSales + " " +  deptName);

          connection.query("UPDATE `departments` SET ? WHERE ?", [
            {
              total_sales: deptProdTotalSales
            }, 
            {
              department_name: deptName
            }
            ], function(error3) {
              if (error3) throw error3;
            //  console.log("this is it! " + total_sales + " " + department_name);
   //           console.log("deptProdTotalSales" + deptProdTotalSales + " deptName " + deptName);
   //           console.log("Updated total_sales in departments Table successfully!");
              // Once the update goes through, show the customer the 
              // total cost of their purchase
          //console.log("Price of item (tax free): $" + totalRevenue);
          });
      });  // end of result3 query
/*  Future development
    if (quantityUpdate) {  // if our boolean variable is set to true - we had update the table

    }
    else {
        // back out of the products issues with posting (may need to place this above)
    } // end of if/else
*/
    resetVariables();
}  // end of updateDeptSales function

function resetVariables() {
    productTotalSales = 0;  
    deptProdTotalSales = 0;
    updatedQuantity = 0;
    deptName = 0;
    totalRevenue = 0;
    prodAnswer = [];
    willFillOrder = false;
    QuantUpdatePossible = false;
}
// precise_round is a function that gives two decimal places for our use (can change as necessary)
function precise_round(num, decimals) {
   var t = Math.pow(10, decimals);   
   return (Math.round((num * t) + (decimals>0?1:0)*(Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
}