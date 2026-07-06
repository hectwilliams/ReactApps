#!/bin/bash
DB=sport_db
USER=htron
psql  -d "${DB}" --username "${USER}"  <<< "\copy nba.players FROM '/root/work/nba.csv' DELIMITER ',' CSV HEADER"
