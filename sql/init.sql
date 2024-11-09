-- create user
CREATE USER 'devUser'@'localhost' IDENTIFIED BY 'devUser';

-- drop database if exists
DROP DATABASE IF EXISTS vuetest;

-- create database
CREATE DATABASE vuetest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vuetest;

-- drop table if exists
DROP TABLE IF EXISTS sales_order;
DROP TABLE IF EXISTS product_category;

-- create table
CREATE TABLE product_category
    (
        object_id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(30) NOT NULL,
        is_active TINYINT DEFAULT 1,
        created_date DATETIME,
        updated_date DATETIME,
        PRIMARY KEY (object_id)
    );

CREATE TABLE sales_order
(
    object_id BIGINT NOT NULL AUTO_INCREMENT,
    customer_name VARCHAR(128) NOT NULL,
    status VARCHAR(15) NOT NULL,
    category_id INT NOT NULL,
    country VARCHAR(30),
    created_date DATETIME,
    updated_date DATETIME,
    PRIMARY KEY (object_id),
    FOREIGN KEY (category_id) REFERENCES product_category(object_id)
);

-- dummy data product_category
INSERT INTO product_category (name, created_date) VALUES ('Electronics', '2019-01-01');
INSERT INTO product_category (name, created_date) VALUES ('Furniture', '2019-01-01');
INSERT INTO product_category (name, created_date) VALUES ('Stationery', '2019-01-01');
INSERT INTO product_category (name, created_date) VALUES ('Sports', '2019-01-01');
INSERT INTO product_category (name, created_date) VALUES ('Hardware', '2019-01-01');

-- dummy data sales_order
INSERT INTO sales_order (customer_name, status, category_id, country, created_date)
VALUES ('Kivell', 'Accepted', 1, 'United Kingdom', '2019-01-23');
INSERT INTO sales_order (customer_name, status, category_id, country, created_date)
VALUES ('Jardine', 'Processing', 2, 'Russia', '2019-02-09');
INSERT INTO sales_order (customer_name, status, category_id, country, created_date)
VALUES ('Gill', 'Rejected', 3, 'German', '2019-02-26');
INSERT INTO sales_order (customer_name, status, category_id, country, created_date)
VALUES ('Sor''vino', 'Open', 2, 'Singapore', '2019-03-15');
INSERT INTO sales_order (customer_name, status, category_id, country, created_date)
VALUES ('Jones', 'Rejected', 4, 'German', '2019-04-01');
INSERT INTO sales_order (customer_name, status, category_id, country, created_date) 
VALUES ('Andrews', 'Processing', 1, 'Malaysia', '2019-04-18');
INSERT INTO sales_order (customer_name, status, category_id, country, created_date)
VALUES ('Jardine', 'Processing', 4, 'German', '2019-05-05');
INSERT INTO sales_order (customer_name, status, category_id, country, created_date)
VALUES ('Thompson', 'Accepted', 5, 'Malaysia', '2019-05-22');
INSERT INTO sales_order (customer_name, status, category_id, country, created_date)
VALUES ('Jones', 'Open', 2, 'Taiwan', '2019-06-08');
INSERT INTO sales_order (customer_name, status, category_id, country, created_date)
VALUES ('Morgan', 'Processing', 4, 'China', '2019-04-18');
INSERT INTO sales_order (customer_name, status, category_id, country, created_date)
VALUES ('Sarah', 'Processing', 4, 'Singapore', '2019-04-18');