#!/usr/bin/env python3
"""
CLI client for the toll management system (se2401).

Usage examples:
  $ se2401 healthcheck
  $ se2401 resetpasses --source passes01.csv
  $ se2401 resetstations --source stations01.csv
  $ se2401 login --username admin --passw mypassword
  $ se2401 tollstationpasses --station NAO01 --from 20241101 --to 20241130 --format json
  $ se2401 passanalysis --stationop AM --tagop NAO --from 20220305 --to 20220319 --format csv
  $ se2401 admin --addpasses --source passes01.csv
"""

import argparse
import requests
import sys
import json
import csv
import io
import os
import warnings
from urllib3.exceptions import InsecureRequestWarning

# Disable SSL warnings.
warnings.filterwarnings('ignore', category=InsecureRequestWarning)


# Create a global session that disables certificate validation.
session = requests.Session()
session.verify = False  # Disable certificate validation for all calls.

# Base URL for the REST API endpoints.
# (Adjust the host and port as needed.)
BASE_URL = "https://localhost:9115/api"


def json_to_csv(data):
    """
    Convert JSON data to CSV format.
    If data is a list of dicts, output a header row then rows.
    If data is a dict, output key/value pairs.
    If the dict has a list under a key (e.g. 'passList'), that list is output below.
    """
    output = io.StringIO()
    if isinstance(data, list):
        if not data:
            return ""
        headers = list(data[0].keys())
        writer = csv.DictWriter(output, fieldnames=headers)
        writer.writeheader()
        for row in data:
            writer.writerow(row)
    elif isinstance(data, dict):
        # If the dict contains a key holding a list (e.g. passList), output top-level keys first
        if 'passList' in data and isinstance(data['passList'], list):
            # Output the top-level key/values (excluding passList)
            top_keys = [k for k in data.keys() if k != 'passList']
            writer = csv.writer(output)
            writer.writerow(top_keys)
            writer.writerow([data[k] for k in top_keys])
            output.write("\n")
            # Now output the passList
            if data['passList']:
                headers = list(data['passList'][0].keys())
                writer = csv.DictWriter(output, fieldnames=headers)
                writer.writeheader()
                for row in data['passList']:
                    writer.writerow(row)
        else:
            writer = csv.writer(output)
            writer.writerow(["key", "value"])
            for k, v in data.items():
                writer.writerow([k, v])
    else:
        return str(data)
    return output.getvalue()


def print_response(response, output_format):
    """
    Print the response from the API in either JSON or CSV format.
    """
    try:
        data = response.json()
        if data.get('status') == 'failed':
            print(f"Error: {data.get('info', 'Unknown error')}")
            return
            
        if output_format == "json":
            print(json.dumps(data, indent=2))
        else:  # default CSV
            # Only print the values, not the key,value header
            if isinstance(data, dict):
                for k, v in data.items():
                    print(f"{v}")
            else:
                csv_data = json_to_csv(data)
                print(csv_data)
    except ValueError:
        print("Response is not valid JSON:")
        print(response.text)
        return

# -------------------------------------------------------------------
# Endpoint functions – each CLI “scope” calls its corresponding REST API endpoint.
# -------------------------------------------------------------------

def healthcheck(args):
    url = f"{BASE_URL}/admin/healthcheck"
    try:
        r = session.get(url)
        print_response(r, args.format)
    except Exception as e:
        print(f"Error connecting to server: {e}")

def resetpasses(args):
    url = f"{BASE_URL}/admin/resetpasses"
    try:
        r = session.post(url)
        print_response(r, args.format)
    except Exception as e:
        print(f"Error connecting to server: {e}")

def resetstations(args):
    url = f"{BASE_URL}/admin/resetstations"
    try:
        r = session.post(url)
        print_response(r, args.format)
    except Exception as e:
        print(f"Error connecting to server: {e}")

def tollstationpasses(args):
    url = f"{BASE_URL}/tollStationPasses/{args.station}/{args.from_date}/{args.to_date}"
    try:
        r = session.get(url)
        print_response(r, args.format)
    except Exception as e:
        print(f"Error connecting to server: {e}")


def passanalysis(args):
    url = f"{BASE_URL}/passAnalysis/{args.stationop}/{args.tagop}/{args.from_date}/{args.to_date}"
    try:
        r = session.get(url)
        print_response(r, args.format)
    except Exception as e:
        print(f"Error connecting to server: {e}")


def passescost(args):
    url = f"{BASE_URL}/passesCost/{args.stationop}/{args.tagop}/{args.from_date}/{args.to_date}"
    try:
        r = session.get(url)
        print_response(r, args.format)
    except Exception as e:
        print(f"Error connecting to server: {e}")


def chargesby(args):
    url = f"{BASE_URL}/chargesBy/{args.opid}/{args.from_date}/{args.to_date}"
    try:
        r = session.get(url)
        print_response(r, args.format)
    except Exception as e:
        print(f"Error connecting to server: {e}")


def admin(args):
    if args.usermod:
        if not (args.username and args.passw):
            print("Error: --username and --passw are required when using --usermod")
            sys.exit(1)
        url = f"{BASE_URL}/admin/usermod"
        payload = {"username": args.username, "password": args.passw}
        try:
            r = session.post(url, data=payload)
            print_response(r, args.format)
        except Exception as e:
            print(f"Error connecting to server: {e}")
    elif args.addpasses:
        if not args.source:
            print("Error: --source is required when using --addpasses")
            sys.exit(1)
        if not os.path.isfile(args.source):
            print(f"Error: File '{args.source}' does not exist.")
            sys.exit(1)
        url = f"{BASE_URL}/admin/addpasses"
        try:
            with open(args.source, "rb") as f:
                files = {"file": (os.path.basename(args.source), f, "text/csv")}
                r = session.post(url, files=files)
                print_response(r, args.format)
        except Exception as e:
            print(f"Error connecting to server: {e}")
    else:
        url = f"{BASE_URL}/admin/users"
        try:
            r = session.get(url)
            print_response(r, args.format)
        except Exception as e:
            print(f"Error connecting to server: {e}")


def main():
    parser = argparse.ArgumentParser(
        prog="se2401",
        description="CLI client for the toll management system"
    )
    parser.add_argument(
        "--format", default="csv", choices=["csv", "json"],
        help="Output format (default: csv)"
    )
    subparsers = parser.add_subparsers(dest="scope", required=True, help="Available scopes")

    parser_health = subparsers.add_parser("healthcheck", help="Check system health")
    parser_health.set_defaults(func=healthcheck)

    parser_resetpasses = subparsers.add_parser("resetpasses", help="Reset all pass records")
    parser_resetpasses.set_defaults(func=resetpasses)

    parser_resetstations = subparsers.add_parser("resetstations", help="Reset toll stations using tollstations2024.csv")
    parser_resetstations.set_defaults(func=resetstations)

    parser_tsp = subparsers.add_parser("tollstationpasses", help="Retrieve toll station passes")
    parser_tsp.add_argument("--station", required=True, help="Toll station ID")
    parser_tsp.add_argument("--from", dest="from_date", required=True, help="Start date (YYYYMMDD)")
    parser_tsp.add_argument("--to", dest="to_date", required=True, help="End date (YYYYMMDD)")
    parser_tsp.set_defaults(func=tollstationpasses)

    parser_pa = subparsers.add_parser("passanalysis", help="Analyze passes between operators")
    parser_pa.add_argument("--stationop", required=True, help="Station operator ID")
    parser_pa.add_argument("--tagop", required=True, help="Tag operator ID")
    parser_pa.add_argument("--from", dest="from_date", required=True, help="Start date (YYYYMMDD)")
    parser_pa.add_argument("--to", dest="to_date", required=True, help="End date (YYYYMMDD)")
    parser_pa.set_defaults(func=passanalysis)

    parser_pc = subparsers.add_parser("passescost", help="Calculate cost of passes")
    parser_pc.add_argument("--stationop", required=True, help="Station operator ID")
    parser_pc.add_argument("--tagop", required=True, help="Tag operator ID")
    parser_pc.add_argument("--from", dest="from_date", required=True, help="Start date (YYYYMMDD)")
    parser_pc.add_argument("--to", dest="to_date", required=True, help="End date (YYYYMMDD)")
    parser_pc.set_defaults(func=passescost)

    parser_cb = subparsers.add_parser("chargesby", help="Retrieve charges by operator")
    parser_cb.add_argument("--opid", required=True, help="Operator ID")
    parser_cb.add_argument("--from", dest="from_date", required=True, help="Start date (YYYYMMDD)")
    parser_cb.add_argument("--to", dest="to_date", required=True, help="End date (YYYYMMDD)")
    parser_cb.set_defaults(func=chargesby)

    parser_admin = subparsers.add_parser("admin", help="Admin functions")
    parser_admin.add_argument("--usermod", action="store_true", help="Modify user password")
    parser_admin.add_argument("--username", help="Username (for user modification)")
    parser_admin.add_argument("--passw", help="Password (for user modification)")
    parser_admin.add_argument("--addpasses", action="store_true", help="Import passes from CSV file")
    parser_admin.add_argument("--source", help="CSV file source for pass records (required for --addpasses)")
    parser_admin.set_defaults(func=admin)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
