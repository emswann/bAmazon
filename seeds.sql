-- SQL seeds file used to populate the bAmazon application tables with data.
-- NAME: seeds.sql
-- AUTHOR: Elaina Swann
-- DATE: 02/24/2018
-- REVISION LOG:

USE bamazon;

-- Populate departments table.
INSERT INTO departments (name, over_head_costs)
VALUES ('Pets', 500);

INSERT INTO departments (name, over_head_costs)
VALUES ('Housewares', 1000);

INSERT INTO departments (name, over_head_costs)
VALUES ('Electronics', 1500);

INSERT INTO departments (name, over_head_costs)
VALUES ('Books', 100);

-- Populate products table.
INSERT INTO products (name, department_id, price, stock_quantity)
VALUES ('Purina Cat Chow', 1, 11.29, 100);

INSERT INTO products (name, department_id, price, stock_quantity)
VALUES ('Purina Beneful Dog Food', 1, 22.50, 100);

INSERT INTO products (name, department_id, price, stock_quantity)
VALUES ('Pet Cuisine Puppy Chews', 1, 8.23, 150);

INSERT INTO products (name, department_id, price, stock_quantity)
VALUES ('Nutribullet Speed Blender', 2, 69.99, 50);

INSERT INTO products (name, department_id, price, stock_quantity)
VALUES ('Fruit Basket Bowl', 2, 14.87, 50);

INSERT INTO products (name, department_id, price, stock_quantity)
VALUES ('Organizer Pantry Rack', 2, 9.59, 50);

INSERT INTO products (name, department_id, price, stock_quantity)
VALUES ('Professional Knife Sharpener', 2, 8.19, 50);

INSERT INTO products (name, department_id, price, stock_quantity)
VALUES ('Echo Dot', 3, 39.99, 25);

INSERT INTO products (name, department_id, price, stock_quantity)
VALUES ('Tablet Stand Multi-Angle', 3, 16.88, 25);

INSERT INTO products (name, department_id, price, stock_quantity)
VALUES ('LG 55-Inch Smart TV', 3, 599.99, 5);

INSERT INTO products (name, department_id, price, stock_quantity)
VALUES ('To Kill a Mockingbird', 4, 5.95, 30);
