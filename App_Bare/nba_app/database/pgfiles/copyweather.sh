#!/bin/bash
DB=sport_db
USER=htron
psql  -d "${DB}" --username "${USER}"  <<< "\copy binny.temp \
 FROM '/root/work/weatherdata.csv' DELIMITER ',' CSV HEADER"


