#!/bin/bash
DB=sport_db
USER=htron
psql  -d "${DB}" --username "${USER}"  <<< "\copy nba.plot_pts FROM '/root/work/plot_pts.csv' DELIMITER ',' CSV HEADER"
