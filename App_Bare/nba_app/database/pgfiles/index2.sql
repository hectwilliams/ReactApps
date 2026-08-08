

DROP SCHEMA binny CASCADE;
create SCHEMA binny; 

GRANT SELECT, UPDATE, DELETE ON binny.temp TO htron;


-- grant select access to schema table 
DROP TABLE IF EXISTS  binny.temp  CASCADE;

CREATE TABLE  binny.temp (
    date_time text,
    temp real , -- celcius 
    dew_point_temp real,
    humidity decimal, 
    wind_speed decimal,
    visibility decimal,
    kpa decimal,
    weather text
);

--prevents further table creation from htron on schema binny (htron owns schema )
REVOKE CREATE ON SCHEMA binny FROM htron;

-- prevent deletion of binny.temp by htron 
REVOKE DELETE ON TABLE binny.temp FROM htron;


-- Date/Time,
-- Temp_C,
-- Dew Point Temp_C,
-- Rel Hum_%,
-- Wind Speed_km/h,
-- Visibility_km,
-- Press_kPa,
-- Weather
