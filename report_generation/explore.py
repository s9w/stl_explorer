import json
import os

for version in ["c++20", "c++latest"]:
    includes = {}
    for file in sorted(os.listdir('{}'.format(version))):
        head = file[7:-4]
        includes[head] = []
        path = "{}\\report_{}.txt".format(version, head)
        with open(path, encoding='utf-16-le') as f:
            for line in f.readlines():
                if line.startswith("report_in"):
                    includes[head].append(line[11:-1])

    for key, value in includes.items():
        if key not in value:
            print("{} doesn't include itself".format(key))

    sanitized_version = version.replace("+", "p")
    with open("..\{}_json.js".format(version), "w", encoding='utf-8') as f_out:
        f_out.write("let {}_json_data = {};".format(sanitized_version, json.dumps(includes)))
