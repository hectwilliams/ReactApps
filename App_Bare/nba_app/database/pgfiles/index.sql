

-- SET client_min_messages = WARNING;

-- nba namespace 
create SCHEMA nba; 


DROP TABLE IF EXISTS  nba.teams  CASCADE;
DROP TABLE IF EXISTS  nba.players  CASCADE;
DROP TABLE IF EXISTS  nba.race  CASCADE;

CREATE TABLE  nba.teams (
    
    id serial primary key,
    tm text  UNIQUE not null, 
    conference text not null,
    division text not null,
    established text DEFAULT '',
    n_championships text DEFAULT '',
    n_hof text DEFAULT ''
);


CREATE TABLE nba.players (
    
    id          serial primary key,
    player      text,
    tm          text references nba.teams(tm),
    unnamed     text,
    opp         text,
    result      text,
    mp          text,
    fg          text, 
    fga        text,
    fpp         text,
    trep        text,   -- tre is 3
    trepa       text, 
    trepp       text, 
    ft          text,
    fta          text, 
    ftp         text,
    orb         text,
    drb         text,
    trb         text,
    ast         text,
    stl         text, 
    blk         text,
    tov         text,
    pf          text,
    pts         text,
    plusminus   text,
    gmsc        text,
    date        text 
);

CREATE TABLE  nba.race (
    
    id serial primary key,
    race text,
    player_id integer references nba.players(id)

);

-- COPY nba.teams FROM '/root/work/nbateams.csv' DELIMITER ',' CSV HEADER;


-- select * from nba.teams;