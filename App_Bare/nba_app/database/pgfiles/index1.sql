
--  USER HTRON RULES  

-- SET client_min_messages = WARNING;
-- CREATE DATABASE sport_db;

-- nba namespace 
DROP SCHEMA nba CASCADE;
create SCHEMA nba; 


-- -- grant role access to schema 
-- GRANT USAGE ON SCHEMA nba TO htron;

-- grant select access to schema table 
GRANT SELECT, UPDATE, DELETE ON nba.race TO htron;

DROP TABLE IF EXISTS  nba.teams  CASCADE;
DROP TABLE IF EXISTS  nba.players2025  CASCADE;
DROP TABLE IF EXISTS  nba.players2026  CASCADE;
DROP TABLE IF EXISTS  nba.player  CASCADE;
DROP TABLE IF EXISTS  nba.race  CASCADE;
DROP TABLE IF EXISTS  nba.info  CASCADE;
DROP TABLE IF EXISTS  nba.playerimg  CASCADE;

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



CREATE TABLE  nba.info (
    npages integer,
    nlastpage integer ,
    nperpage integer DEFAULT 50,
    nsamples integer
);

CREATE TABLE nba.player (
    
    id BIGSERIAL   PRIMARY KEY ,
    player      text  DEFAULT '',
    tm          text references nba.teams(tm),
    unnamed     text DEFAULT '',
    opp         text DEFAULT '',
    result      text DEFAULT '',
    mp          text DEFAULT '',
    fg          text DEFAULT '', 
    fga         text DEFAULT '',
    fpp         text DEFAULT '',
    trep        text DEFAULT '',  
    trepa       text DEFAULT '', 
    trepp       text DEFAULT '', 
    ft          text DEFAULT '',
    fta         text DEFAULT '', 
    ftp         text DEFAULT '',
    orb         text DEFAULT '',
    drb         text DEFAULT '',
    trb         text DEFAULT '',
    ast         text DEFAULT '',
    stl         text DEFAULT '', 
    blk         text DEFAULT '',
    tov         text DEFAULT '',
    pf          text DEFAULT '',
    pts         text DEFAULT '',
    plusminus   text DEFAULT '',
    gmsc        text DEFAULT '',
    date        text DEFAULT ''

);

-- #player stats for year 2025 ( ideally 2-3 million records  num_active_players * 82_games )
CREATE TABLE nba.players2025  (LIKE  nba.player  INCLUDING ALL  );

CREATE TABLE nba.players2026 () INHERITS (nba.player);

CREATE TABLE  nba.race (
    id BIGSERIAL  primary key,
    race text NOT NULL,
    player_id integer references nba.players2025(id)
);

CREATE TABLE  nba.plot_pts (
    player_id integer references nba.players2025(id),
    pts text NOT NULL DEFAULT ''
);

CREATE TABLE  nba.plot_gamesplayed (
    player_id integer references nba.players2025(id),
    played text NOT NULL DEFAULT ''
);

CREATE TABLE  nba.playerimg (
    player_id integer references nba.players2025(id),
    img text NOT NULL DEFAULT ''
);

--prevents further table creation from htron on schema nba (htron owns schema )
REVOKE CREATE ON SCHEMA nba FROM htron;

-- prevent delete of nba.players from htron (htron is owner of sport_db database; only super user can view  )
REVOKE DELETE ON TABLE nba.player FROM htron;
REVOKE DELETE ON TABLE nba.race FROM htron;
REVOKE DELETE ON TABLE nba.teams FROM htron;

-- TODO -- password must be rquired for htron + sport_db ( where is the superuser )
