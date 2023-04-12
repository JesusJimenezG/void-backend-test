#!/bin/bash
# psql -U void -c "SELECT 'CREATE DATABASE void-test' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'void-test')"
# psql -U void -tc "SELECT 1 FROM pg_database WHERE datname = 'void_test'" | grep -q 1 || psql -U void -c "CREATE DATABASE void_test"
docker exec -it void-postgres sh -c "echo \"SELECT 'CREATE DATABASE void_test' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'void_test')\gexec\" | psql -U void"