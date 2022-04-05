# Must be using MariaDB; MySQL will error when creating the UUID functions

# Create the database
CREATE DATABASE azroberts;
USE azroberts;

# Create necessary functions (delimiter prevents commend from executing while writing function)
DELIMITER //
CREATE FUNCTION BIN_TO_UUID(b BINARY(16))
RETURNS CHAR(36)
BEGIN
   DECLARE hexStr CHAR(32);
   SET hexStr = HEX(b);
   RETURN LOWER(CONCAT(SUBSTR(hexStr, 1, 8), '-', SUBSTR(hexStr, 9, 4), '-', SUBSTR(hexStr, 13, 4), '-', SUBSTR(hexStr, 17, 4), '-', SUBSTR(hexStr, 21)));
END//

CREATE FUNCTION UUID_TO_BIN(uuid CHAR(36))
RETURNS BINARY(16)
BEGIN
    RETURN UNHEX(REPLACE(uuid, '-', ''));
END//
DELIMITER ;

# Create the new user and grant proper permissions
CREATE USER 'deno'@'localhost' IDENTIFIED BY 'denosaur';
GRANT SELECT, INSERT ON azroberts.Sessions TO 'deno'@'localhost';
GRANT SELECT, INSERT ON azroberts.Views TO 'deno'@'localhost';
GRANT EXECUTE ON FUNCTION BIN_TO_UUID TO 'deno'@'localhost';
GRANT EXECUTE ON FUNCTION UUID_TO_BIN TO 'deno'@'localhost';
FLUSH PRIVILEGES;

# Create the Traffic tables
CREATE TABLE Sessions (
	Timestamp timestamp NOT NULL,
	ID binary(16) NOT NULL,
	IP int unsigned NOT NULL,
	Country char(2),
	Region char(2),
	City varchar(20),
	Platform varchar(8),
	Browser varchar(15),
	Version int unsigned,
	Format enum('smartphone','desktop','tablet','crawler','unknown'),
	PRIMARY KEY (ID)
);

CREATE TABLE Views (
	Timestamp timestamp NOT NULL,
	ID binary(16) NOT NULL,
	Page varchar(14) NOT NULL,
	FOREIGN KEY (ID) REFERENCES Sessions(ID),
	CONSTRAINT uni UNIQUE (Timestamp, ID)
);

# Insertting data
INSERT INTO Sessions (ID, IP, Country, Region, City, Platform, Browser, Version, Format) VALUES(UUID_TO_BIN(UUID()), INET_ATON('127.0.0.1'), 'US', 'FL', 'Tampa', 'macOS', 'Chrome', '96', 'desktop');
INSERT INTO Views (ID, Page) VALUES(UUID_TO_BIN(''), 'home');

# Get last inserted ID
#SELECT BIN_TO_UUID(ID) AS ID FROM Sessions ORDER BY Timestamp DESC LIMIT 

# Reading data
