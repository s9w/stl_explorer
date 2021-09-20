# STL explorer
In C++, including header files is recursive: All sub-includes are also included. This is no different in the C++ standard library. Knowing what total includes you get by using `#include <algorithm>` for example can be useful and is not always easy to find out.

This offers a tiny website to list, forward- and reverse search that information. You can find what total sub-includes a header brings with it, but also where a certain header is included. `<vector>` for example is included surprisingly often.

Note that includes are not defined in the standard and depend on the implementation (compiler). The information in this tool are based on Visual Studio v16.11 with `/std:c++20`.

The time cost of standard library includes can be found in the [cpp-lit](https://github.com/s9w/cpp-lit) project.