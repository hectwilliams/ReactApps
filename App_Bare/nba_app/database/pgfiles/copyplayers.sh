#!/bin/bash
DB=sport_db
USER=htron

psql  -d "${DB}" --username "${USER}"  <<< "\copy nba.players2025 FROM '/root/work/nba.csv' DELIMITER ',' CSV HEADER;"
psql  -d "${DB}" --username "${USER}"  <<< "\copy nba.players2026 FROM '/root/work/nba.csv' DELIMITER ',' CSV HEADER;"
