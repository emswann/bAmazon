-- SQL schema file used to create the bAmazon application database and tables.
-- NAME: schema.sql
-- AUTHOR: Elaina Swann
-- DATE: 02/24/2018
-- REVISION LOG:

DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE departments(
  id              INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name            VARCHAR(40),
  over_head_costs DECIMAL(8,4) DEFAULT 0
);

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
