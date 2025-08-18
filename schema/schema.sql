CREATE DATABASE yesha_reality;
USE yesha_reality;

CREATE TABLE properties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    estate VARCHAR(255) NOT NULL,
    landSize INT,
    bedroom INT,
    image VARCHAR(255) NOT NULL, -- stores filename or full URL
    houseType VARCHAR(255) NOT NULL,
    price VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO properties (estate, landSize, bedroom, image, houseType, price, location, featured)
VALUES
('Soteria City, Jikoyi', 250, 2, '/uploads/Fully-Detached-Bungalow.jpeg', 'Fully Detached Bungalow', '5,000,000', 'Abuja', FALSE),
('Soteria City, Jikoyi', 350, 3, '/uploads/Fully-Detached-Bungalow.jpeg', 'Fully Detached Bungalow', '6,000,000', 'Abuja', FALSE),
('Soteria City, Jikoyi', 400, 4, '/uploads/Fully-Detached-Bungalow.jpeg', 'Fully Detached Bungalow', '8,000,000', 'Abuja', FALSE),
('Soteria City, Jikoyi', 450, 4, '/uploads/Fully-Detached-Bungalow.jpeg', 'Fully Detached Bungalow', '10,000,000', 'Abuja', TRUE),
('Soteria City Phase II, Kuje', 150, 2, '/uploads/Fully-Terrace-Duplex.jpeg', 'Fully Terrace Duplex', '2,000,000', 'Abuja', TRUE),
('Soteria City Phase II, Kuje', 250, 3, '/uploads/Fully-Terrace-Duplex.jpeg', 'Fully Terrace Duplex', '3,500,000', 'Abuja', TRUE),
('Soteria City Phase II, Kuje', 350, 3, '/uploads/Fully-Detached-Bungalow.jpeg', 'Fully Detached Bungalow', '4,500,000', 'Abuja', FALSE),
('Soteria City Phase II, Kuje', 400, 4, '/uploads/Fully-Detached-Bungalow.jpeg', 'Fully Detached Bungalow', '5,500,000', 'Abuja', TRUE),
('Soteria City Phase II, Kuje', 500, 4, '/uploads/Fully-Detached-Duplex.jpeg', 'Terrace Duplex with BQ', '7,000,000', 'Abuja', TRUE),
('Soteria City Phase II, Kuje', 500, 3, '/uploads/Penthouse.jpeg', 'Penthouse', '7,000,000', 'Abuja', FALSE),
('Soteria City Phase II, Kuje', 500, 4, '/uploads/Penthouse.jpeg', 'Penthouse', '9,000,000', 'Abuja', TRUE);


CREATE TABLE agents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phoneNumber VARCHAR(20),
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    state VARCHAR(255) NOT NULL,
    experience ENUM('0-1', '2-3', '4+'),
    agency VARCHAR(255) NOT NULL DEFAULT 'Freelancer',
    image VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
