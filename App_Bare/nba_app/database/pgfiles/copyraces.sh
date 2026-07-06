#!/bin/bash
DB=sport_db
USER=htron
psql -d "${DB}" --username "${USER}"  <<< "\copy nba.race FROM '/root/work/race.csv' DELIMITER ',' CSV HEADER"
