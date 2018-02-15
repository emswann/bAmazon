DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
  item_id         INT AUTO_INCREMENT NOT NULL,
  product_name    VARCHAR(40),
  department_name VARCHAR(40),
  price           DECIMAL(8,4),
  stock_quantity  INT,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Purina Cat Chow', 'pets', 11.29, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Purina Beneful Dog Food', 'pets', 22.50, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Pet Cuisine Puppy Chews', 'pets', 8.23, 150);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Nutribullet Speed Blender', 'housewares', 69.99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Fruit Basket Bowl', 'housewares', 14.87, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Organizer Pantry Rack', 'housewares', 9.59, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Professional Knife Sharpener', 'housewares', 8.19, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Echo Dot', 'electronics', 39.99, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Tablet Stand Multi-Angle', 'electronics', 16.88, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('LG 55-Inch Smart TV', 'electronics', 599.99, 5);