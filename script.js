const $=id=>document.getElementById(id);

$("formatJson").addEventListener("click",()=>{
  const input=$("jsonInput").value.trim();
  try{$("jsonOutput").textContent=JSON.stringify(JSON.parse(input),null,2)}
  catch(e){$("jsonOutput").textContent="Invalid JSON: "+e.message}
});
$("copyJson").addEventListener("click",async()=>{
  const text=$("jsonOutput").textContent;
  await navigator.clipboard.writeText(text); $("copyJson").textContent="Copied";
  setTimeout(()=>$("copyJson").textContent="Copy",1000);
});

function updateColor(){
  const hex=$("colorInput").value;
  const n=parseInt(hex.slice(1),16);
  const rgb=[n>>16,(n>>8)&255,n&255];
  $("colorPreview").style.background=hex;
  $("hexValue").value=hex.toUpperCase();
  $("rgbValue").value="rgb("+rgb.join(", ")+")";
}
$("colorInput").addEventListener("input",updateColor); updateColor();
$("copyHex").addEventListener("click",async()=>{
  await navigator.clipboard.writeText($("hexValue").value);
  $("copyHex").textContent="Copied"; setTimeout(()=>$("copyHex").textContent="Copy HEX",1000);
});

function convert(){
  const v=parseFloat($("unitInput").value);
  if(Number.isNaN(v)){$("unitResult").textContent="Enter a value.";return}
  const type=$("unitType").value;
  const map={"px-rem":[v/16,"rem"],"rem-px":[v*16,"px"],"kb-mb":[v/1024,"MB"],"mb-gb":[v/1024,"GB"]};
  const [result,unit]=map[type]; $("unitResult").textContent=result+" "+unit;
}
$("unitInput").addEventListener("input",convert); $("unitType").addEventListener("change",convert);

const saved=localStorage.getItem("devkit-notes"); if(saved)$("notesInput").value=saved;
$("saveNotes").addEventListener("click",()=>{
  localStorage.setItem("devkit-notes",$("notesInput").value);
  $("noteStatus").textContent="Saved locally in this browser.";
});
$("clearNotes").addEventListener("click",()=>{
  $("notesInput").value="";localStorage.removeItem("devkit-notes");$("noteStatus").textContent="Notes cleared.";
});

$("themeToggle").addEventListener("click",()=>{
  document.body.classList.toggle("light");
  const light=document.body.classList.contains("light");
  localStorage.setItem("devkit-theme",light?"light":"dark");
  $("themeToggle").textContent=light?"☀":"☾";
});
if(localStorage.getItem("devkit-theme")==="light"){document.body.classList.add("light");$("themeToggle").textContent="☀"}
