-- Online Pharmacy Database Schema
-- Run this script to create all tables

CREATE DATABASE IF NOT EXISTS online_pharmacy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE online_pharmacy;

-- Users table (Customers, Pharmacists, Admins)
CREATE TABLE IF NOT EXISTS Users (
    user_ID INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'pharmacist', 'admin') NOT NULL DEFAULT 'customer',
    phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- Products table
CREATE TABLE IF NOT EXISTS Products (
    product_ID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    dosage VARCHAR(100),
    active_ingredients TEXT,
    category ENUM('OTC', 'Prescription') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(500),
    manufacturer VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_active (is_active)
) ENGINE=InnoDB;

-- Prescriptions table
CREATE TABLE IF NOT EXISTS Prescriptions (
    prescription_ID INT AUTO_INCREMENT PRIMARY KEY,
    user_ID INT NOT NULL,
    pharmacist_ID INT,
    image_url VARCHAR(500) NOT NULL,
    prescription_date DATE NOT NULL,
    expiry_date DATE,
    verification_status ENUM('Pending', 'Verified', 'Rejected') DEFAULT 'Pending',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_ID) REFERENCES Users(user_ID) ON DELETE CASCADE,
    FOREIGN KEY (pharmacist_ID) REFERENCES Users(user_ID) ON DELETE SET NULL,
    INDEX idx_user (user_ID),
    INDEX idx_status (verification_status)
) ENGINE=InnoDB;

-- Shipping Addresses table
CREATE TABLE IF NOT EXISTS ShippingAddresses (
    address_ID INT AUTO_INCREMENT PRIMARY KEY,
    user_ID INT NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'USA',
    
    
    FOREIGN KEY (user_ID) REFERENCES Users(user_ID) ON DELETE CASCADE,
    INDEX idx_user (user_ID)
) ENGINE=InnoDB;

-- Orders table
CREATE TABLE IF NOT EXISTS Orders (
    order_ID INT AUTO_INCREMENT PRIMARY KEY,
    user_ID INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('Pending', 'Paid', 'Failed', 'Refunded') DEFAULT 'Pending',
    shipping_address_ID INT,
    order_status ENUM('Pending', 'Processing', 'Dispensed', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_ID) REFERENCES Users(user_ID) ON DELETE CASCADE,
    FOREIGN KEY (shipping_address_ID) REFERENCES ShippingAddresses(address_ID) ON DELETE SET NULL,
    INDEX idx_user (user_ID),
    INDEX idx_status (order_status),
    INDEX idx_payment (payment_status)
) ENGINE=InnoDB;

-- Order Items table
CREATE TABLE IF NOT EXISTS OrderItems (
    order_item_ID INT AUTO_INCREMENT PRIMARY KEY,
    order_ID INT NOT NULL,
    product_ID INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    prescription_ID INT,
    FOREIGN KEY (order_ID) REFERENCES Orders(order_ID) ON DELETE CASCADE,
    FOREIGN KEY (product_ID) REFERENCES Products(product_ID) ON DELETE RESTRICT,
    FOREIGN KEY (prescription_ID) REFERENCES Prescriptions(prescription_ID) ON DELETE SET NULL,
    INDEX idx_order (order_ID)
) ENGINE=InnoDB;

-- Payments table
CREATE TABLE IF NOT EXISTS Payments (
    payment_ID INT AUTO_INCREMENT PRIMARY KEY,
    order_ID INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    stripe_transaction_ID VARCHAR(255),
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Success', 'Failed', 'Refunded', 'Pending') DEFAULT 'Pending',
    FOREIGN KEY (order_ID) REFERENCES Orders(order_ID) ON DELETE CASCADE,
    INDEX idx_order (order_ID),
    INDEX idx_stripe (stripe_transaction_ID)
) ENGINE=InnoDB;

-- Pharmacists extended info table
CREATE TABLE IF NOT EXISTS Pharmacists (
    pharmacist_ID INT AUTO_INCREMENT PRIMARY KEY,
    user_ID INT NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_ID) REFERENCES Users(user_ID) ON DELETE CASCADE,
    INDEX idx_user (user_ID)
) ENGINE=InnoDB;

-- Audit Logs table
CREATE TABLE IF NOT EXISTS AuditLogs (
    log_ID INT AUTO_INCREMENT PRIMARY KEY,
    user_ID INT,
    action VARCHAR(255) NOT NULL,
    target_entity VARCHAR(100),
    target_id INT,
    details TEXT,
    ip_address VARCHAR(50),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_ID) REFERENCES Users(user_ID) ON DELETE SET NULL,
    INDEX idx_user (user_ID),
    INDEX idx_action (action),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB;

-- Coupons/Discounts table
CREATE TABLE IF NOT EXISTS Coupons (
    coupon_ID INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    max_uses INT,
    uses_count INT DEFAULT 0,
    valid_from DATE,
    valid_until DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_active (is_active)
) ENGINE=InnoDB;

-- Insert sample data
-- Sample users (password: 'password' hashed with bcrypt)
INSERT INTO Users (first_name, last_name, email, password_hash, role, phone) VALUES
('John', 'Doe', 'john@example.com', '$2a$10$YourHashedPasswordHere', 'customer', '555-0101'),
('Jane', 'Smith', 'jane@example.com', '$2a$10$YourHashedPasswordHere', 'customer', '555-0102'),
('Dr. Michael', 'Johnson', 'michael@pharmacy.com', '$2a$10$YourHashedPasswordHere', 'pharmacist', '555-0201'),
('Sarah', 'Williams', 'sarah@pharmacy.com', '$2a$10$YourHashedPasswordHere', 'pharmacist', '555-0202'),
('Admin', 'User', 'admin@pharmacy.com', '$2a$10$YourHashedPasswordHere', 'admin', '555-0301');

-- Sample pharmacist licenses
INSERT INTO Pharmacists (user_ID, license_number) VALUES
(3, 'PH-12345-CA'),
(4, 'PH-67890-CA');

-- Sample products
INSERT INTO Products (name, description, dosage, active_ingredients, category, price, stock_quantity, image_url, manufacturer) VALUES
('Ibuprofen 200mg', 'Pain reliever and fever reducer', '200mg tablets', 'Ibuprofen', 'OTC', 8.99, 150, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', 'HealthCare Plus'),
('Amoxicillin 500mg', 'Antibiotic for bacterial infections', '500mg capsules', 'Amoxicillin', 'Prescription', 24.99, 75, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400', 'PharmaCare Ltd'),
('Vitamin D3 1000 IU', 'Essential vitamin for bone health', '1000 IU softgels', 'Cholecalciferol', 'OTC', 12.49, 200, 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400', 'NutriWell'),
('Lisinopril 10mg', 'ACE inhibitor for blood pressure', '10mg tablets', 'Lisinopril', 'Prescription', 18.50, 100, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400', 'CardioMed'),
('Cetirizine 10mg', 'Antihistamine for allergy relief', '10mg tablets', 'Cetirizine', 'OTC', 15.99, 120, 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400', 'AllergyFree');
