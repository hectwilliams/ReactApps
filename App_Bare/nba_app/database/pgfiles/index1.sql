
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
DROP TABLE IF EXISTS  nba.info  CASCADE;

CREATE TABLE  nba.teams (
    
    id serial primary key,
    tm text  UNIQUE not null, 
    conference text not null,
    division text not null,
    established text DEFAULT '',
    n_championships text DEFAULT '',
    n_hof text DEFAULT '', 
    tmpic text 
);

CREATE TABLE nba.players (
    
    id BIGSERIAL ,
    player      text,
    tm          text references nba.teams(tm),
    unnamed     text,
    opp         text,
    result      text,
    mp          text,
    fg          text, 
    fga         text,
    fpp         text,
    trep        text,   -- tre is 3
    trepa       text, 
    trepp       text, 
    ft          text,
    fta         text, 
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
    date        text,
    primary key (id)
) ;

CREATE TABLE  nba.race (
    id BIGSERIAL ,
    race text,
    player_id integer references nba.players(id),
    primary key (id)
) ;

CREATE TABLE  nba.info (
    npages integer ,
    nlastpage integer ,
    nperpage integer DEFAULT 50,
    nsamples integer
) ;

--prevents further table creation from htron on schema nba (htron owns schema )
REVOKE CREATE ON SCHEMA nba FROM htron;


-- prevent delete of nba.players from htron (htron is owner of sport_db database; only super user can view  )
REVOKE DELETE ON TABLE nba.players FROM htron;
REVOKE DELETE ON TABLE nba.race FROM htron;
REVOKE DELETE ON TABLE nba.teams FROM htron;

-- TODO -- password must be rquired for htron + sport_db ( where is the superuser )
