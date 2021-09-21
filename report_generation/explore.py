import json
import os
from pathlib import Path

current_dir = Path('.')
versions = [str(dir) for dir in current_dir.iterdir() if dir.is_dir()]

cpp_20_headers = ["concepts", "coroutines", "compare", "version", "source_location", "format", "semaphore", "span", "ranges", "bit", "numbers", "syncstream", "stop_token", "latch", "barrier"]

def get_headers_from_dir(version):
    files_in_version_dir = sorted(os.listdir(version))
    return [file[7:-4] for file in files_in_version_dir]

for version in versions:
    includes = {}
    for header in get_headers_from_dir(version):
        if version == "c++17" and header in cpp_20_headers:
            continue

        includes[header] = []
        path = "{}\\report_{}.txt".format(version, header)
        with open(path, encoding='utf-16-le') as f:
            for line in f.readlines():
                if line.startswith("report_in"):
                    includes[header].append(line[11:-1])

    # Warn if headers don't include themselves. In particular, <cassert> and <version> are troublemakers
    for key, value in includes.items():
        if key not in value:
            print("Warning: {} doesn't include itself".format(key))

    sanitized_version = version.replace("+", "p")
    with open("..\{}_json.js".format(version), "w", encoding='utf-8') as f_out:
        f_out.write("let {}_json_data = {};".format(sanitized_version, json.dumps(includes)))
