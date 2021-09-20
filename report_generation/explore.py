import json

std_headers = ["algorithm","any","array","atomic","barrier","bit","bitset","cassert","cctype","cerrno","cfenv","cfloat","charconv","chrono","cinttypes","climits","clocale","cmath","compare","complex","concepts","condition_variable","coroutine","csetjmp","csignal","cstdarg","cstddef","cstdint","cstdio","cstdlib","cstring","ctime","cuchar","cwchar","cwctype","deque","exception","execution","filesystem","format","forward_list","fstream","functional","future","initializer_list","iomanip","ios","iosfwd","iostream","istream","iterator","latch","limits","list","locale","map","memory","memory_resource","mutex","new","numbers","numeric","optional","ostream","queue","random","ranges","ratio","regex","scoped_allocator","semaphore","set","shared_mutex","source_location","span","sstream","stack","stdexcept","stop_token","streambuf","string","string_view","syncstream","system_error","thread","tuple","type_traits","typeindex","typeinfo","unordered_map","unordered_set","utility","valarray","variant","vector","version"]

includes = {}
for head in std_headers:
    includes[head] = []
    path = "reports\\report_" + head + ".txt"
    with open(path, encoding='utf-16-le') as f:
        for line in f.readlines():
            if line.startswith("report_in"):
                includes[head].append(line[11:-1])

for key, value in includes.items():
    if key not in value:
        print("{} doesn't include itself".format(key))

with open("..\json.js", "w", encoding='utf-8') as f_out:
    f_out.write("let json_data = " + json.dumps(includes) + ";")
