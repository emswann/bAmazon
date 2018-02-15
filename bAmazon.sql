DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
  item_id         INT AUTO_INCREMENT NOT NULL,
  product_name    VARCHAR(40),
  department_name VARCHAR(40),
  price           DECIMAL(8,4),
  stock_quantity  INT,
  product_sales   DECIMAL(8,4) DEFAULT 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Purina Cat Chow', 'Pets', 11.29, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Purina Beneful Dog Food', 'Pets', 22.50, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Pet Cuisine Puppy Chews', 'Pets', 8.23, 150);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Nutribullet Speed Blender', 'Housewares', 69.99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Fruit Basket Bowl', 'Housewares', 14.87, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Organizer Pantry Rack', 'Housewares', 9.59, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Professional Knife Sharpener', 'Housewares', 8.19, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Echo Dot', 'Electronics', 39.99, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Tablet Stand Multi-Angle', 'Electronics', 16.88, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('LG 55-Inch Smart TV', 'Electronics', 599.99, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('To Kill a Mockingbird', 'Books', 5.95, 30);

CREATE TABLE departments(
  department_id   INT AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(40),
  over_head_costs DECIMAL(8,4) DEFAULT 0,
  PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ('Pets', 500);

INSERT INTO departments (department_name, over_head_costs)
VALUES ('Housewares', 1000);

INSERT INTO departments (department_name, over_head_costs)
VALUES ('Electronics', 1500);

INSERT INTO departments (department_name, over_head_costs)
VALUES ('Books', 100);