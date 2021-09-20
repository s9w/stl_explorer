let json_data = cpp20_json_data;


function construct_node(type, attributes, inner_html){
   let new_el = document.createElement(type);
   for(let key in attributes)
      new_el.setAttribute(key, attributes[key]);
   if(inner_html !== null)
      new_el.innerHTML += inner_html;
   return new_el;
}


function load_dataset(){
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


function is_target_header_included(source_header, target_prompt){
   const does_include = (header) => header.includes(target_prompt);
   return json_data[source_header].some(does_include);
}


function mark_source_visibility(source_header, visibility){
   let li_el = document.getElementById(source_header);
   if(visibility)
      li_el.classList.remove("hidden");
   else
      li_el.classList.add("hidden");
}


function unhighlight_all(){
   const un_highlight = (el) => el.classList.remove("highlighted");
   document.querySelectorAll(".highlighted").forEach(un_highlight);
}


function highlight_element(element){
   element.classList.add("highlighted");
}


let source_input_handler = function(e) {
   document.getElementById('target').value = '';
   unhighlight_all();
   let prompt = e.target.value;
   for(const source_header in json_data)
      mark_source_visibility(source_header, source_header.includes(prompt));
}


let target_input_handler = function(e) {
   document.getElementById('source').value = '';
   unhighlight_all();
   let prompt = e.target.value;
   if(prompt.trim() === ""){
      for(const source_header in json_data)
         mark_source_visibility(source_header, true);
      return;
   }
   for(const source_header in json_data){
      let is_valid = is_target_header_included(source_header, prompt);
      mark_source_visibility(source_header, is_valid);
      if(is_valid){
         let source_li = document.getElementById(source_header);
         for (let i = 1; i < source_li.children.length; i++) {
            if(source_li.children[i].innerHTML.includes(prompt)){
               highlight_element(source_li.children[i]);
            }
         }
      }
   }
}


let option_input_handler = function(e) {
   if(e.target.value === "20")
      json_data = cpp20_json_data;
   else if(e.target.value === "latest")
      json_data = cpplatest_json_data;
   load_dataset();
}


// Event listener setup
{ 
   let source_el = document.getElementById('source');
   source_el.addEventListener('input', source_input_handler);
   let target_el = document.getElementById('target');
   target_el.addEventListener('input', target_input_handler);

   
   let option_el = document.getElementById('version_selector');
   option_el.addEventListener('change', option_input_handler);
}

// Initial dataset loading
load_dataset();
