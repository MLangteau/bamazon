# bamazon

####  Bamazon is a "One of a kind" storefront app to take orders from customers, add stock to inventory, and deplete stock from inventory tally products' and departments' sales, and lots more using MySQL and Node.js.  It also tracks overhead costs and calculates total profit for each department.

### The Customer Level will do the following (using node bamazonCustomer.js):

    1.  Allows customers to view a list of products (see screenshot #1)
    2.  Allows customers to order from the list of products.
    3.  Check to see if to see if the store has enough supply to fill the order.
        If so, it:
        a.  subtracts from inventory by updating the SQL database to reflect the remaining stock quantity in the products file.
        b.  updates the products table with the amount purchased (total revenue of each transaction) added to the products' sales column.
        c.  and updates the departments table with the total sales for the related department (running tally of departments' sales).
        
### The Manager Level will do the following (using node bamazonManager.js):
    1.  Provides Managers the following list of menu options (see screenshot #2):
    
        * View Products for Sale - which prints a table of every available item for sale.  (screenshot provided #3),
        * View Low Inventory - prints a table of each item with an inventory less than 5,
        * Add to Inventory - Allows manager to add a specific amount the an item's inventory,
        * Add New Product - Allows manager to add a new item (the name, along with its department, price, and stock quantity),
        * Quit the application.
        
 ### The Supervisor Level will do the following (using node bamazonSupervisor.js):
    1.  Provides Supervisors the following list of menu options (see screenshot #4):
        
        * View Product Sales by Department (Department ID, Department Name, Overhead Costs, Product Sales, Total Profit,
        * Create New Department,
        * Quit the application.
