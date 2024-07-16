#!/usr/bin/env python3

"""
This simple script takes the CSV output file from a Prowler scan and 
converts it into a simple JSON output. Prowler does offer a JSON output but
the payload is nested and pretty complex - I just wanted the simplicity from the 
CSV but in JSON format so I could plug it right into my React site.

Pass the location of the CSV file as the argument to the script:

./compile_prowler_data.py ~/Downloads/prowler_scan_20240712-0839.csv

The data gets placed into ./src/data as:

* metadata.json (Prowler version and AWS account ID)
* raw_data.json (a list of all scan items sorted by STATUS)
"""

import csv
import json
import argparse


def load_csv_data(file_path):
    data = []
    with open(file_path, 'r', newline='') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=';')
        for row in reader:
            data.append(row)
    return data

def save_data(data, file_name):
    with open(f'src/data/{file_name}', 'w') as f:
        f.write(data)

if __name__ == '__main__':
    raw_data = {}
    raw_data_points = []
    parser = argparse.ArgumentParser(description="A script that accepts a single argument")
    parser.add_argument('prowler_csv', type=str, help="Path to the Prowler CSV output")
    args = parser.parse_args()
    data = load_csv_data(args.prowler_csv)
    # Save metadata
    save_data(json.dumps({
        'ACCOUNT_UID': data[0]['ACCOUNT_UID'],
        'PROWLER_VERSION': data[0]['PROWLER_VERSION']
    }), 'metadata.json')
    # Save sorted and uniq'ed data
    sorted_data = sorted(data, key=lambda x: x['STATUS'])
    for i in sorted_data:
        if i['FINDING_UID'] not in raw_data:
            raw_data[i['FINDING_UID']] = i
            raw_data_points.append(i)
    save_data(json.dumps(raw_data_points), 'raw_data.json')
