# bamazon

####  Bamazon is a "One of a kind" storefront app that can take orders from customers, add stock to inventory, deplete stock from inventory, tally products' and departments' sales, and more using MySQL and Node.js.  It also tracks overhead costs and calculates total profit for each department.

### The Customer Level will do the following (using node bamazonCustomer.js):

    1.  Allows customers to view a list of products. (see Screenshot #1).
    
######       ![Alt text](images/custDisplayList3.png?raw=true "Screenshot #1") 
    
    2.  Allows customers to order from the list of products. (see Screenshot #2)
    
######    ![Alt text](images/purchase.png?raw=true "Screenshot #2")

    3.  Check to see if to see if the store has enough supply to fill the order.
        * If enough inventory:
        a.  subtract from inventory by updating the SQL database to reflect the remaining stock quantity in the 
            products file. (see Screenshot #3)
######   ![Alt text](images/productsMySQL.png?raw=true "Screenshot #3")

        b.  update the products table with the amount purchased (total revenue of each transaction) added to the 
            products' sales column.  (see Screenshot #3 above)
        c.  and updates the departments table with the total sales for the related department (running tally of 
        departments' sales).  (see Screenshot #4)
######   ![Alt text](images/departmentsMySQL.png?raw=true "Screenshot #4")            
       
        * If not enough inventory:
        a.  Tell the user that there is "Insufficient Inventory" (see Screenshot #5)
        
######     ![Alt text](images/departmentsMySQL.png?raw=true "Screenshot #5")
        
### The Manager Level will do the following (using node bamazonManager.js):
    1.  Provides Managers the following list of menu options:  (see Screenshot #6)
######        ![Alt text](images/managerOptions.png?raw=true "Screenshot #6")
    
        * View Products forvisornts a table of every available item for sale.  (screenshot provided #7),
######        ![Alt text](images/managerDispAndMenu.png?raw=true "Screenshot #7")
        
        * View Low Inventory - prints a table of each item with an inventory less than 5,
        * Add to Inventory - Allows manager to add a specific amount the an item's inventory, (screenshot provided #8)
######        ![Alt text](images/addInventoryAndLowInventory.png?raw=true "Screenshot #8")
        * Add New Product - Allows manager to add a new item (the name, along with its department, price, and stock 
          quantity),  (screenshot provided #9)
######        ![Alt text](images/addNewInventoryItem.png?raw=true "Screenshot #9")  
        * Quit the application.
        
 ### The Supervisor Level will do the following (using node bamazonSupervisor.js):
    1.  Provides Supervisors the following list of menu options (see Screenshot #):
        
        * View Product Sales by Department (Department ID, Department Name, Overhead Costs, Product Sales, and 
          Total Profit,  (screenshot provided #10)
        ![Alt text](images/supervisor.png?raw=true "Screenshot #10")
        * Create New Department,  (screenshot provided #11)
        ![Alt text](images/superViewAndAddNewDept.png?raw=true "Screenshot #11")
        * Quit the application.
