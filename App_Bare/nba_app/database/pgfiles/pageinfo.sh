#!/bin/bash
DB=sport_db
USER=htron

psql -d "${DB}" --username "${USER}" <<< "INSERT INTO nba.info (npages, nlastpage, nsamples) VALUES(${1}, ${2}, ${3}); "
