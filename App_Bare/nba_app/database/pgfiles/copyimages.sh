#!/bin/bash
DB=sport_db
USER=htron
psql  -d "${DB}" --username "${USER}"  <<< "\copy nba.playerimg FROM '/root/work/images_list.csv' DELIMITER ',' CSV HEADER"


