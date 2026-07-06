
--  USER HTRON RULES  


-- SET client_min_messages = WARNING;
-- CREATE DATABASE sport_db;

-- nba namespace 
DROP SCHEMA nba CASCADE;
create SCHEMA nba; 


-- -- grant role access to schema 
-- GRANT USAGE ON SCHEMA nba TO htron;

-- -- grant select access to schema table 
-- GRANT SELECT ON nba.race TO htron;


DROP TABLE IF EXISTS  nba.teams  CASCADE;
DROP TABLE IF EXISTS  nba.players  CASCADE;
DROP TABLE IF EXISTS  nba.race  CASCADE;
DROP TABLE IF EXISTS  nba.test  CASCADE;

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

--prevents further table creation from htron on schema nba (htron owns schema )
REVOKE CREATE ON SCHEMA nba FROM htron;


CREATE TABLE  nba.test (
    
    id serial primary key,
    name text DEFAULT ''
);

-- prevent delete of nba.players from htron (htron is owner of sport_db database; only super user can view  )
REVOKE DELETE ON TABLE nba.players FROM htron;
REVOKE DELETE ON TABLE nba.race FROM htron;
REVOKE DELETE ON TABLE nba.teams FROM htron;


--  psql -d "postgresql://postgres:password@localhost:5432/postgres" -c "SELECT * from nba.players" 
-- TODO -- password not rquired for htron + sport_db ( where is the superuser )
-- psql -d "postgres://htron:password@localhost:5432/sport_db" -c "SELECT * from nba.players";
