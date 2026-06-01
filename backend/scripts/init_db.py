#!/usr/bin/env python3
"""
Init script to ensure the PostgreSQL database exists before the app starts.
Connects to the Postgres server using credentials from DATABASE_URL (or env vars)
and creates the configured database if it does not already exist.

This is safe for development: it retries until Postgres is available and will
create the database without dropping any existing data.
"""
import os
import time
import urllib.parse
import sys

import psycopg2
from psycopg2 import sql


def parse_database_url(url):
    if not url:
        return {
            'user': os.environ.get('POSTGRES_USER', 'postgres'),
            'password': os.environ.get('POSTGRES_PASSWORD', 'postgres'),
            'host': os.environ.get('POSTGRES_HOST', os.environ.get('DB_HOST', 'postgres')),
            'port': int(os.environ.get('POSTGRES_PORT', os.environ.get('DB_PORT', 5432))),
            'dbname': os.environ.get('POSTGRES_DB', os.environ.get('DB_NAME', 'mlstack_db')),
        }

    parsed = urllib.parse.urlparse(url)
    dbname = parsed.path.lstrip('/') if parsed.path else os.environ.get('POSTGRES_DB', 'mlstack_db')
    return {
        'user': parsed.username or os.environ.get('POSTGRES_USER', 'postgres'),
        'password': parsed.password or os.environ.get('POSTGRES_PASSWORD', 'postgres'),
        'host': parsed.hostname or os.environ.get('POSTGRES_HOST', 'postgres'),
        'port': parsed.port or int(os.environ.get('POSTGRES_PORT', 5432)),
        'dbname': dbname,
    }


def wait_for_postgres(conn_info, timeout=60):
    start = time.time()
    while True:
        try:
            conn = psycopg2.connect(dbname='postgres', user=conn_info['user'], password=conn_info['password'], host=conn_info['host'], port=conn_info['port'])
            conn.close()
            return True
        except Exception:
            if time.time() - start > timeout:
                return False
            time.sleep(1)


def ensure_database(conn_info):
    target_db = conn_info['dbname']
    print(f"Ensuring database exists: {target_db} on {conn_info['host']}:{conn_info['port']}")

    if not wait_for_postgres(conn_info, timeout=120):
        print("Timed out waiting for Postgres to become available", file=sys.stderr)
        return 2

    try:
        conn = psycopg2.connect(dbname='postgres', user=conn_info['user'], password=conn_info['password'], host=conn_info['host'], port=conn_info['port'])
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (target_db,))
        exists = cur.fetchone() is not None
        if exists:
            print(f"Database '{target_db}' already exists. Skipping creation.")
        else:
            print(f"Creating database '{target_db}'...")
            cur.execute(sql.SQL('CREATE DATABASE {}').format(sql.Identifier(target_db)))
            print("Database created.")
        cur.close()
        conn.close()
        return 0
    except Exception as e:
        print("Error while ensuring database:", e, file=sys.stderr)
        return 3


if __name__ == '__main__':
    database_url = os.environ.get('DATABASE_URL') or os.environ.get('DB_URL')
    info = parse_database_url(database_url)
    rc = ensure_database(info)
    sys.exit(rc)
