CREATE TABLE Dossier (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(80) NOT NULL,
    surname VARCHAR(80) NOT NULL,
    race VARCHAR(20),
    sex TINYINT,
    passport VARCHAR(10) UNIQUE,
    publish_date DATETIME DEFAULT NOW()
);

ALTER TABLE Dossier
AUTO_INCREMENT = 1000;

CREATE TABLE DossierNote (
	id INT PRIMARY KEY AUTO_INCREMENT,
    dossier INT NOT NULL,
    text TEXT NOT NULL,
    publish_date DATETIME DEFAULT NOW()
);

ALTER TABLE DossierNote
AUTO_INCREMENT = 1000;

ALTER TABLE DossierNote
ADD CONSTRAINT fk_DossierNote_dossier
FOREIGN KEY(dossier) REFERENCES Dossier(id);

CREATE TABLE Account (
	id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(80) NOT NULL UNIQUE,
    password VARCHAR(2048) NOT NULL,
    dossier INT UNIQUE,
    publishDate DATETIME
);

ALTER TABLE Account
ADD CONSTRAINT fk_Account_dossier
FOREIGN KEY(dossier) REFERENCES Dossier(id);

ALTER TABLE Account
AUTO_INCREMENT = 1000;

CREATE TABLE Roles (
	id INT PRIMARY KEY AUTO_INCREMENT,
    dossier INT NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL,
    publish_date DATETIME DEFAULT NOW()
);

ALTER TABLE Roles
ADD CONSTRAINT fk_Roles_dossier
FOREIGN KEY(dossier) REFERENCES Dossier(id);

ALTER TABLE Roles
AUTO_INCREMENT = 1000;

CREATE TABLE Vehicle (
	id INT PRIMARY KEY AUTO_INCREMENT,
    owner INT,
    model VARCHAR(80),
    number VARCHAR(20),
    color VARCHAR(30),
    colorTitle VARCHAR(30),
    publish_date DATETIME
);

ALTER TABLE Vehicle
ADD CONSTRAINT fk_Vehicle_owner
FOREIGN KEY(owner) REFERENCES Dossier(id);

ALTER TABLE Vehicle
AUTO_INCREMENT = 1000;

CREATE TABLE Organization (
	id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(80) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    picture VARCHAR(256),
    publish_date DATETIME
);

ALTER TABLE Organization
AUTO_INCREMENT = 1000;

CREATE TABLE OrganizationNote (
	id INT PRIMARY KEY AUTO_INCREMENT,
    organization INT NOT NULL,
    text TEXT NOT NULL,
    publish_date DATETIME DEFAULT NOW()
);

ALTER TABLE OrganizationNote
AUTO_INCREMENT = 1000;

ALTER TABLE OrganizationNote
ADD CONSTRAINT fk_OrganizationNote_organization
FOREIGN KEY(organization) REFERENCES Organization(id);

CREATE TABLE Membership ( 
	id INT PRIMARY KEY AUTO_INCREMENT,
    member INT NOT NULL,
    organization INT NOT NULL
);

ALTER TABLE Membership
AUTO_INCREMENT = 1000;

ALTER TABLE Membership
ADD CONSTRAINT fk_Membership_member
FOREIGN KEY(member) REFERENCES Dossier(id);

ALTER TABLE Membership
ADD CONSTRAINT fk_Membership_organization
FOREIGN KEY(organization) REFERENCES Organization(id);