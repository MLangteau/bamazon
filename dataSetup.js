USE bamazon;
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


SELECT * FROM `products`;
