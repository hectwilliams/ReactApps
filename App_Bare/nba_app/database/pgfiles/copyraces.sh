#!/bin/bash

psql -U postgres <<< "\copy nba.race FROM '/root/work/race.csv' DELIMITER ',' CSV HEADER"
