DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE departments(
  id              INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name            VARCHAR(40),
  over_head_costs DECIMAL(8,4) DEFAULT 0
);

INSERT INTO departments (name, over_head_costs)
VALUES ('Pets', 500);

INSERT INTO departments (name, over_head_costs)
VALUES ('Housewares', 1000);

INSERT INTO departments (name, over_head_costs)
VALUES ('Electronics', 1500);

INSERT INTO departments (name, over_head_costs)
VALUES ('Books', 100);

CREATE TABLE products(
  id             INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name           VARCHAR(40),
  department_id  INT,
  price          DECIMAL(8,4),
  stock_quantity INT,
  sales          DECIMAL(8,4) DEFAULT 0,
  INDEX department_id_index (department_id),
  CONSTRAINT fk_department_id 
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
);

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
