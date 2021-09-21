let json_data = cpp20_json_data;


function set_id_class(id, classs, state)
{
   let element = document.getElementById(id);
   if(state)
      element.classList.add(classs);
   else
      element.classList.remove(classs);
}


function get_headers()
{
   return Object.keys(json_data);
}


function construct_node(type, attributes, inner_html)
{
   let new_el = document.createElement(type);
   for(let key in attributes)
      new_el.setAttribute(key, attributes[key]);
   if(inner_html !== null)
      new_el.innerHTML += inner_html;
   return new_el;
}


function load_dataset()
{
   let list_el = document.getElementById("main_list");
   list_el.textContent = '';
   for(const source_header in json_data){
      let li = construct_node('li', {id: source_header}, null);
      li.appendChild(construct_node('code', {class: 'source'}, source_header));
      for(const target_header of json_data[source_header])
         li.appendChild(construct_node('code', {class: 'target'}, target_header));
      list_el.appendChild(li);
   }
}


function is_target_header_included(source_header, target_prompt)
{
   const does_include_target_prompt = (header) => header.includes(target_prompt);
   return json_data[source_header].some(does_include_target_prompt);
}


function clear_all_attributes(attribute)
{
   const un_highlight = (el) => el.classList.remove(attribute);
   document.querySelectorAll(`.${attribute}`).forEach(un_highlight);
}


function highlight_element(element)
{
   element.classList.add("highlighted");
}


function set_row_visililities(header_names)
{
   for(const source_header in json_data){
      set_id_class(source_header, "hidden", !header_names.includes(source_header));
   }
}


function filter()
{
   clear_all_attributes("highlighted");
   clear_all_attributes("hidden");

   let source_filter = document.getElementById('source').value;
   let target_filter = document.getElementById('target').value;

   if(source_filter.trim() !== "" && target_filter.trim() !== ""){
      console.log("both inputs not empty. That shouldn't happen");
      return;
   }

   set_id_class("body", "fade_possible", target_filter.trim() !== "");

   // Source filter -> filter rows
   if(source_filter.trim() !== ""){
      let matching = get_headers().filter(header => header.includes(source_filter));
      set_row_visililities(matching);
   }

   // Target filter -> filter rows + highlight matches
   if(target_filter.trim() !== ""){
      let matching = get_headers().filter(header => is_target_header_included(header, target_filter));
      set_row_visililities(matching);

      // If target filter is empty, don't highlight matches (because all are matching)
      if(target_filter.trim() === "")
         return;
      for(matching_header of matching){
         let source_li = document.getElementById(matching_header);
         const fun = (el) => {if(el.innerHTML.includes(target_filter)) highlight_element(el)};
         source_li.querySelectorAll(".target").forEach(fun);
      }
   }
}


let source_input_handler = function(e) {
   document.getElementById('target').value = ''; // Clear the other input
   filter();
}


let target_input_handler = function(e) {
   document.getElementById('source').value = ''; // Clear the other input
   filter();
}


let filter_toggle_handler = function() {
   let is_checked = document.getElementById('hide_filtered').checked;
   set_id_class("body", "filter_checked", is_checked);
}


let option_input_handler = function(e) {
   if(e.target.value === "17")
      json_data = cpp17_json_data;
   else if(e.target.value === "20")
      json_data = cpp20_json_data;
   else if(e.target.value === "latest")
      json_data = cpplatest_json_data;
   load_dataset();
   filter();
}


// Event listener setup
{ 
   let source_el = document.getElementById('source');
   source_el.addEventListener('input', source_input_handler);

   let target_el = document.getElementById('target');
   target_el.addEventListener('input', target_input_handler);
   
   let option_el = document.getElementById('version_selector');
   option_el.addEventListener('change', option_input_handler);

   let hide_el = document.getElementById('hide_filtered');
   hide_el.addEventListener('change', filter_toggle_handler);
}

// Initial dataset loading
load_dataset();

// Synchronize initial filter setting with body classes
filter_toggle_handler();
filter();