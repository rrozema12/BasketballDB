--   Ryan Rozema
--   Assignment 2
--   CPSC 321
--   September 12 2017

SET sql_mode = STRICT_ALL_TABLES; -- Invalid data values are rejected.

USE rrozema_DB; -- Use my own database for this assignment

-- Tables are in the right order to protect foreign key constraints
DROP TABLE IF EXISTS ShootingStats;
DROP TABLE IF EXISTS PerGameStats;
DROP TABLE IF EXISTS Draft;
DROP TABLE IF EXISTS Player;
DROP TABLE IF EXISTS Team;
DROP TABLE IF EXISTS College; -- Table with the most foreign key constraints is dropped last

CREATE TABLE College (
        college_id INTEGER NOT NULL,
        college_name CHAR(50) NOT NULL,

        PRIMARY KEY (college_id)
) ENGINE = InnoDB;

CREATE TABLE Team (
	team_code CHAR(5)  NOT NULL,
	team_name VARCHAR(50),
	
	PRIMARY KEY (team_code)
) ENGINE = InnoDB;

CREATE TABLE Player (
        player_id INTEGER NOT NULL,
        player_name VARCHAR(50) NOT NULL,
        age_drafted FLOAT NOT NULL,
        position CHAR(5) NOT NULL, 
	college_id INTEGER,
	start_year INTEGER,
	graduate_year INTEGER,
	round_drafted INTEGER,
	pick_number INTEGER,
	team_code CHAR(5), 

        PRIMARY KEY (player_id),
	FOREIGN KEY (college_id) REFERENCES College(college_id),
	FOREIGN KEY (team_code) REFERENCES Team(team_code)
) ENGINE = InnoDB;

CREATE TABLE PerGameStats (
	player_id INTEGER NOT NULL,
        games_played INTEGER NOT NULL,
        minuets_played FLOAT NOT NULL,
	points FLOAT NOT NULL,
	rebounds FLOAT NOT NULL,
	assists FLOAT NOT NULL,
	steals FLOAT NOT NULL,
	blocks FLOAT NOT NULL,

        PRIMARY KEY (player_id)
) ENGINE = InnoDB;

CREATE TABLE ShootingStats (
	player_id INTEGER NOT NULL,
        field_goal_pct FLOAT NOT NULL,
        two_point_pct FLOAT NOT NULL,
        three_point_pct FLOAT,
	free_throw_pct FLOAT NOT NULL,

	PRIMARY KEY (player_id)
) ENGINE = InnoDB;

