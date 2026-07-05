#!/bin/bash

psql -U postgres <<< "\copy nba.players FROM '/root/work/nba.csv' DELIMITER ',' CSV HEADER"
