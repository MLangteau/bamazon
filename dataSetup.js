CREATE SCHEMA bamazon;
USE bamazon;

// new table 
CREATE TABLE `departments` (
	`department_id` INT AUTO_INCREMENT,
	`department_name` VARCHAR (255) NULL,
	`over_head_costs` DECIMAL(10,2) NULL,
	`total_sales` DECIMAL(10,2) NULL,
	PRIMARY KEY (`department_id`)
);

SELECT * FROM `departments`;
SELECT * FROM `products`;

ALTER TABLE `departments` MODIFY total_sales DECIMAL(10,2) NOT NULL DEFAULT 0;

ALTER TABLE `products`
ADD `product_sales` DECIMAL(10,2) NULL,
DEFAULT 0

ALTER TABLE `products`
ADD `product_sales` DECIMAL(10,2) NOT NULL


ALTER TABLE `departments` (over_head_costs)
VALUES `product_sales` DECIMAL(10,2) NULL,
DEFAULT 0

ALTER TABLE `products` (stock_quantity)
VALUES `stock_quantity` DECIMAL(10,2) NOT NULL
DEFAULT 0

ALTER TABLE `departments` (over_head_costs)
VALUES `product_sales` 1000

"UPDATE `products` SET ?",[{over_head_costs: 1000}]

INSERT INTO `departments` (total_sales)
VALUES ("Appliances",.43,0),("Arts and Crafts",.59,0),("Automotive",1.19,0),
	("Books",.69,0),("Electronics",.79,0),("Fish",.39,0),
	("Home",.50,0),("Pets",.64,0),("Tools",.27,0);


INSERT INTO `departments` (department_name, over_head_costs, total_sales)
VALUES ("Appliances",.43,0),("Arts and Crafts",.59,0),("Automotive",1.19,0),
	("Books",.69,0),("Electronics",.79,0),("Fish",.39,0),
	("Home",.50,0),("Pets",.64,0),("Tools",.27,0);

// price is the cost to the customer
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
	("Apple Watch Sport","Electronics",317.98,7),
	("Samsung 55-Inch TV","Electronics",150.00,3),
	("Kindle Voyage","Electronics",199.99,30),
	("Escort Passport Radar Detector","Electronics",188.00,35),
	("Mobil 1 Synthetic Motor Oil","Automotive",.99,40),
	("Red Line Manual Transmission Fluid","Automotive",5.33,300),
	("Singer Heavy Duty Sewing Machine","Arts and Crafts",250.45,50);
