
-- SUPER USER RULES 

-- create database 
CREATE DATABASE sport_db;

-- SU create role (i.e. role) htron 
CREATE ROLE htron LOGIN PASSWORD 'abcd'; 

-- SU changes database owenership 
ALTER DATABASE sport_db OWNER TO htron;

-- SU changes schema ownership
ALTER SCHEMA nba OWNER TO htron;

-- SU grants user privlege for htron to connect to database (sign in)
GRANT CONNECT ON DATABASE sport_db TO htron;

-- SU grants role access to CREATE in database sport_db (example of creation would be creating a table or schema) 
GRANT CREATE ON DATABASE sport_db TO htron;

-- Grant user privulege to create table in schema 
-- GRANT CREATE ON SCHEMA nba TO htron;

-- SU revoke user ability to CREATE on database 
-- REVOKE CREATE ON DATABASE sport_db FROM htron;

-- SU revoke user to create on schema (user must own schema)
REVOKE CREATE ON SCHEMA nba FROM htron;



