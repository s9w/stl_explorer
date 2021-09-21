import json
import os
from pathlib import Path

current_dir = Path('.')

dirs = [str(dir) for dir in current_dir.iterdir() if dir.is_dir() and str(dir).startswith("vs")]

cpp_20_headers = ["concepts", "coroutines", "compare", "version", "source_location", "format", "semaphore", "span", "ranges", "bit", "numbers", "syncstream", "stop_token", "latch", "barrier"]

def get_headers_from_dir(dir):
    files_in_version_dir = sorted(os.listdir(dir))
    return [file[7:-4] for file in files_in_version_dir]

for dir in dirs:
    vs, std = dir.split("_")
    platform = "{}_{}".format(vs, std)
    includes = {}
    for header in get_headers_from_dir(dir):
        if std == "c++17" and header in cpp_20_headers:
            continue

        includes[header] = []
        path = "{}\\report_{}.txt".format(platform, header)
        try:
            with open(path, encoding='utf-16-le') as f:
                for line in f.readlines():
                    if line.startswith("report_in"):
                        includes[header].append(line[11:-1])
        except:
            print("exception. vs: {}, version: {}, header: {}".format(vs, std, header))

    if len(includes["cassert"]) == 0:
        includes["cassert"].append("cassert")

    # Warn if headers don't include themselves. In particular, <cassert> and <version> are troublemakers
    for key, value in includes.items():
        if key not in value:
            print("Warning: {} doesn't include itself".format(key))

    sanitized_platform = platform.replace("+", "p")
    with open("..\{}_json.js".format(platform), "w", encoding='utf-8') as f_out:
        f_out.write("json_data['{}'] = {};".format(sanitized_platform, json.dumps(includes, indent=4)))
