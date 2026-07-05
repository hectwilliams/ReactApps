#!/bin/bash

psql -U postgres <<< "\copy nba.teams FROM '/root/work/nbateams.csv' DELIMITER ',' CSV HEADER"
