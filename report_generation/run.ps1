function Invoke-CmdScript {
   param(
      [String] $script_path
   )
   Write-Output "running script $script_path"
   $cmdLine = """$script_path"" $args & set"
   & $Env:SystemRoot\system32\cmd.exe /c $cmdLine |
   select-string '^([^=]*)=(.*)$' | foreach-object {
      $varName = $_.Matches[0].Groups[1].Value
      $varValue = $_.Matches[0].Groups[2].Value
      set-item Env:$varName $varValue
   }
}

$vs2019_dir = "C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise"
$vs2022_dir = "C:\Program Files\Microsoft Visual Studio\2022\Preview"

$vs_choice = "2022" # 2019 or 2022

if ($vs_choice -eq "2022"){
   $vcvars_dir = "{0}\VC\Auxiliary\Build\vcvars64.bat" -f $vs2022_dir
}
else{
   $vcvars_dir = "{0}\VC\Auxiliary\Build\vcvars64.bat" -f $vs2019_dir
}
if((-Not (Test-Path env:cvars_invoked)) -And (-Not $env:cvars_invoked)){
   Invoke-CmdScript -script_path $vcvars_dir
   # prevent running that script more than once per session. It's slow and there's an issue with multiple invokations
   $env:cvars_invoked = $true
}

Write-Output "catalog.productDisplayVersion: $vcvars_dir"
Read-Host -Prompt "Press Enter to continue"

$std_headers = "algorithm","any","array","atomic","barrier","bit","bitset","cassert","cctype","cerrno","cfenv","cfloat","charconv","chrono","cinttypes","climits","clocale","cmath","compare","complex","concepts","condition_variable","coroutine","csetjmp","csignal","cstdarg","cstddef","cstdint","cstdio","cstdlib","cstring","ctime","cuchar","cwchar","cwctype","deque","exception","execution","filesystem","format","forward_list","fstream","functional","future","initializer_list","iomanip","ios","iosfwd","iostream","istream","iterator","latch","limits","list","locale","map","memory","memory_resource","mutex","new","numbers","numeric","optional","ostream","queue","random","ranges","ratio","regex","scoped_allocator","semaphore","set","shared_mutex","source_location","span","sstream","stack","stdexcept","stop_token","streambuf","string","string_view","syncstream","system_error","thread","tuple","type_traits","typeindex","typeinfo","unordered_map","unordered_set","utility","valarray","variant","vector","version"


$std_versions = "c++17","c++20","c++latest"

Foreach($std_version in $std_versions){
   $create_path = "vs{0}_{1}" -f $vs_choice, $std_version
   New-Item -ItemType Directory -Force -Path $create_path

   Foreach($header in $std_headers){
      $include_string = "/D i_{0}" -f $header
      $version_string = "/std:{0}" -f $std_version
      $cl_command = "CL /Od /MDd /D _DEBUG $include_string $version_string /experimental:module /EHsc /nologo /permissive- /W4 /wd4189 /utf-8 /Feout.exe reporter.cpp /link /MACHINE:X64"

      $report_file = "{0}\report_{1}.txt" -f $create_path, $header
      Invoke-Expression $cl_command | Tee-Object $report_file

      # Cleanup temporary files
      Remove-Item -Path *.obj
      Remove-Item -Path *.iobj
      Remove-Item -Path *.ipdb
      Remove-Item -Path out.exe
   }
}