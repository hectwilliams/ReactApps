#!/bin/bash
DB=sport_db
USER=htron
psql  -d "${DB}" --username "${USER}"  <<< "\copy nba.plot_gamesplayed FROM '/root/work/plot_played.csv' DELIMITER ',' CSV HEADER"


