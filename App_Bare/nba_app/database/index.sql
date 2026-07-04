

SET client_min_messages = WARNING;

-- nba namespace 
create SCHEMA nba; 


DROP TABLE IF EXISTS  nba.teams  CASCADE;
DROP TABLE IF EXISTS  nba.players  CASCADE;
DROP TABLE IF EXISTS  nba.race  CASCADE;


CREATE TABLE IF NOT EXISTS nba.teams (
    
    id serial primary key,
    tm varchar(100)  UNIQUE, 
    established varchar(100),
    n_championships varchar(100),
    n_hof smallint

);


CREATE TABLE IF NOT EXISTS  nba.players (
    
    id serial primary key,
    tm varchar(100) references nba.teams(tm),
    player varchar(100) UNIQUE,
    unnamed char(5),
    opp varchar(50),
    result char(1),
    mp time,
    fg smallint, 
    fga smallint,
    fpp real,
    trep smallint,   -- tre is 3
    trepa smallint, 
    trepp real, 
    ft smallint,
    fta smallint, 
    ftp real,
    orb smallint,
    drb smallint,
    trb smallint,
    ast smallint,
    stl smallint, 
    blk smallint,
    tov smallint,
    pf smallint,
    pts smallint,
    plusminus smallint,
    gmsc real,
    date date 
);


CREATE TABLE IF NOT EXISTS  nba.race (
    
    id serial primary key,
    race varchar(100),
    player_id integer references nba.players(id)

);



