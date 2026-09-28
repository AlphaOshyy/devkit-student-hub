const $=id=>document.getElementById(id);
const toast=(message)=>{let t=document.querySelector(".toast");if(!t){t=document.createElement("div");t.className="toast";document.body.appendChild(t)}t.textContent=message;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),1400)};
$("formatJson").addEventListener("click",()=>{const input=$("jsonInput").value.trim();try{$("jsonOutput").textContent=JSON.stringify(JSON.parse(input),null,2);toast("JSON formatted")}catch(e){$("jsonOutput").textContent="Invalid JSON: "+e.message;toast("Invalid JSON")}});
$("copyJson").addEventListener("click",async()=>{try{await navigator.clipboard.writeText($("jsonOutput").textContent);toast("JSON copied")}catch(e){toast("Copy failed")}});
function updateColor(){const hex=$("colorInput").value,n=parseInt(hex.slice(1),16),rgb=[n>>16,(n>>8)&255,n&255];$("colorPreview").style.background=hex;$("hexValue").value=hex.toUpperCase();$("rgbValue").value="rgb("+rgb.join(", ")+")"}
$("colorInput").addEventListener("input",updateColor);updateColor();
$("copyHex").addEventListener("click",async()=>{try{await navigator.clipboard.writeText($("hexValue").value);toast("HEX copied")}catch(e){toast("Copy failed")}});
function convert(){const v=parseFloat($("unitInput").value);if(Number.isNaN(v)){$("unitResult").textContent="Enter a value.";return}const type=$("unitType").value,map={"px-rem":[v/16,"rem"],"rem-px":[v*16,"px"],"kb-mb":[v/1024,"MB"],"mb-gb":[v/1024,"GB"]};const [result,unit]=map[type];$("unitResult").textContent=Number(result.toFixed(4))+" "+unit}
$("unitInput").addEventListener("input",convert);$("unitType").addEventListener("change",convert);
const saved=localStorage.getItem("devkit-notes");if(saved)$("notesInput").value=saved;
$("saveNotes").addEventListener("click",()=>{localStorage.setItem("devkit-notes",$("notesInput").value);$("noteStatus").textContent="Saved locally in this browser.";toast("Note saved")});
$("clearNotes").addEventListener("click",()=>{$("notesInput").value="";localStorage.removeItem("devkit-notes");$("noteStatus").textContent="Notes cleared.";toast("Notes cleared")});
$("themeToggle").addEventListener("click",()=>{document.body.classList.toggle("light");const light=document.body.classList.contains("light");localStorage.setItem("devkit-theme",light?"light":"dark");$("themeToggle").textContent=light?"☀":"☾";toast(light?"Light mode":"Dark mode")});
if(localStorage.getItem("devkit-theme")==="light"){document.body.classList.add("light");$("themeToggle").textContent="☀"}
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");revealObserver.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll(".section-head,.about-box").forEach(el=>{el.classList.add("reveal-on-scroll");revealObserver.observe(el)});
