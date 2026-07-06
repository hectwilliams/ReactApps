#!/bin/bash
DB=sport_db
USER=htron
psql -d "${DB}" --username "${USER}" <<< "\copy nba.teams FROM '/root/work/nbateams.csv' DELIMITER ',' CSV HEADER"
