function is_target_header_included(source_header, target_prompt){
   for(const sub_header of json_data[source_header]){
      if(sub_header.includes(target_prompt))
         return true;
   }
   return false;
}

function mark_source_visibility(source_header, visibility){
   let li_el = document.getElementById(source_header);
   if(visibility)
      li_el.classList.remove("hidden");
   else
      li_el.classList.add("hidden");
}

function unhighlight_all(){
   const highlighted = document.querySelectorAll(".highlighted");

   highlighted.forEach(function(el) {
      el.classList.remove("highlighted");
   });
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


let source_el = document.getElementById('source');
source_el.addEventListener('input', source_input_handler);
let target_el = document.getElementById('target');
target_el.addEventListener('input', target_input_handler);

// var ul = document.getElementById("main_list");
for(const source_header in json_data){
   var li = document.createElement('li');
   li.setAttribute('id', `${source_header}`);
   
   let code_el = document.createElement('code');
   code_el.setAttribute('class', `source`);
   code_el.innerHTML += source_header;
   // code_el.innerHTML += `&lt;${source_header}&gt;`;
   li.appendChild(code_el);
   
   for(const sub_header of json_data[source_header]){
      let code_el = document.createElement('code');
      code_el.setAttribute('class', `target`);
      code_el.innerHTML += sub_header;
      li.appendChild(code_el);
   }
   
   document.getElementById("main_list").appendChild(li);
}
