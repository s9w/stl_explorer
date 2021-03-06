# STL explorer
In C++, including header files is recursive: All sub-includes are also included. This is no different in the C++ standard library (incorrectly but commonly known as STL). Knowing what total includes you get by using `#include <algorithm>` for example can be useful and is not always easy to find out. For example, it can tell what other headers you can use for "free" since they're already there from your previous includes.

This offers a tiny [website](https://s9w.github.io/stl_explorer/explorer.html) to list, forward- and reverse search that information. You can find what total sub-includes a header brings with it, but also where a certain header is included. `<vector>` for example is included surprisingly often.

Note that includes are not defined in the standard and depend on the implementation (compiler). The information in this tool are based on VS2019 16.11.3 and VS2022 17.0 Preview 4.1 with `/std:c++20` and `/std:c++latest`.

The time cost of standard library includes can be found in the [cpp-lit](https://github.com/s9w/cpp-lit) project.