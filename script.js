const $=id=>document.getElementById(id);
const toast=message=>{let t=document.querySelector(".toast");if(!t){t=document.createElement("div");t.className="toast";document.body.appendChild(t)}t.textContent=message;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),1400)};
const copy=async(text,label="Copied")=>{try{await navigator.clipboard.writeText(text);toast(label)}catch(e){toast("Copy failed")}};

$("formatJson").addEventListener("click",()=>{const input=$("jsonInput").value.trim();try{$("jsonOutput").textContent=JSON.stringify(JSON.parse(input),null,2);toast("JSON formatted")}catch(e){$("jsonOutput").textContent="Invalid JSON: "+e.message;toast("Invalid JSON")}});
$("copyJson").addEventListener("click",()=>copy($("jsonOutput").textContent,"JSON copied"));

function updateColor(){const hex=$("colorInput").value,n=parseInt(hex.slice(1),16),rgb=[n>>16,(n>>8)&255,n&255];$("colorPreview").style.background=hex;$("hexValue").value=hex.toUpperCase();$("rgbValue").value="rgb("+rgb.join(", ")+")"}
$("colorInput").addEventListener("input",updateColor);updateColor();$("copyHex").addEventListener("click",()=>copy($("hexValue").value,"HEX copied"));

function convert(){const v=parseFloat($("unitInput").value);if(Number.isNaN(v)){$("unitResult").textContent="Enter a value.";return}const type=$("unitType").value,map={"px-rem":[v/16,"rem"],"rem-px":[v*16,"px"],"kb-mb":[v/1024,"MB"],"mb-gb":[v/1024,"GB"]};const[result,unit]=map[type];$("unitResult").textContent=Number(result.toFixed(4))+" "+unit}
$("unitInput").addEventListener("input",convert);$("unitType").addEventListener("change",convert);

const saved=localStorage.getItem("devkit-notes");if(saved){$("notesInput").value=saved;$("noteStatus").textContent="Saved note loaded from this browser."}
$("saveNotes").addEventListener("click",()=>{localStorage.setItem("devkit-notes",$("notesInput").value);$("noteStatus").textContent="Saved locally in this browser.";toast("Note saved")});
$("clearNotes").addEventListener("click",()=>{$("notesInput").value="";localStorage.removeItem("devkit-notes");$("noteStatus").textContent="Notes cleared.";toast("Notes cleared")});

$("encode64").addEventListener("click",()=>{try{$("base64Output").textContent=btoa(unescape(encodeURIComponent($("base64Input").value)));toast("Encoded")}catch(e){$("base64Output").textContent="Unable to encode text."}});
$("decode64").addEventListener("click",()=>{try{$("base64Output").textContent=decodeURIComponent(escape(atob($("base64Input").value.trim())));toast("Decoded")}catch(e){$("base64Output").textContent="Invalid Base64 input.";toast("Invalid Base64")}});
$("copy64").addEventListener("click",()=>copy($("base64Output").textContent,"Output copied"));

function tick(){const now=new Date();$("liveTime").textContent=now.toLocaleTimeString();$("liveDate").textContent=now.toLocaleDateString(undefined,{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
tick();setInterval(tick,1000);
$("copyTimestamp").addEventListener("click",()=>copy(String(Math.floor(Date.now()/1000)),"Unix timestamp copied"));
$("copyIso").addEventListener("click",()=>copy(new Date().toISOString(),"ISO timestamp copied"));

$("countInput").addEventListener("input",()=>{const v=$("countInput").value;$("charCount").textContent=v.length;$("wordCount").textContent=v.trim()?v.trim().split(/\s+/).length:0;$("lineCount").textContent=v?v.split(/\n/).length:0});

const chars="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";function generatePassword(){const len=+$("passwordLength").value;let out="";for(let i=0;i<len;i++)out+=chars[Math.floor(Math.random()*chars.length)];$("passwordOutput").value=out}
$("passwordLength").addEventListener("input",()=>{$("lengthValue").textContent=$("passwordLength").value;generatePassword()});$("generatePassword").addEventListener("click",()=>{generatePassword();toast("Password generated")});$("copyPassword").addEventListener("click",()=>copy($("passwordOutput").value,"Password copied"));generatePassword();

$("themeToggle").addEventListener("click",()=>{document.body.classList.toggle("light");const light=document.body.classList.contains("light");localStorage.setItem("devkit-theme",light?"light":"dark");$("themeToggle").textContent=light?"☀":"☾";toast(light?"Light mode":"Dark mode")});
if(localStorage.getItem("devkit-theme")==="light"){document.body.classList.add("light");$("themeToggle").textContent="☀"}

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".section-head,.about-box").forEach(el=>{el.classList.add("reveal-on-scroll");observer.observe(el)});

const links=[["Tools","#tools"],["Resources","#resources"],["About","#about"],["Top","#top"]];const toolLinks=[...document.querySelectorAll(".card")].map(c=>[c.dataset.tool,"#"+c.dataset.tool.toLowerCase().replace(/\s+/g,"-")]);document.querySelectorAll(".card").forEach((c,i)=>c.id="tool-"+(i+1));
const palette=$("palette"),pInput=$("paletteInput"),pResults=$("paletteResults");let pItems=[],pIndex=0;
function openPalette(){palette.classList.add("open");palette.setAttribute("aria-hidden","false");pInput.value="";renderPalette("");setTimeout(()=>pInput.focus(),30)}
function closePalette(){palette.classList.remove("open");palette.setAttribute("aria-hidden","true")}
function renderPalette(q){const all=[["All tools","#tools"],["GitHub Docs","https://docs.github.com/"],...links,...[...document.querySelectorAll(".card")].map(c=>[c.dataset.tool,"#"+c.id])];const filtered=all.filter(x=>x[0].toLowerCase().includes(q.toLowerCase()));pResults.innerHTML=filtered.map((x,i)=>`<div class="palette-item${i===0?" active":""}" data-url="${x[1]}"><span>${x[0]}</span><span>↵</span></div>`).join("");pItems=[...pResults.children];pIndex=0;pItems.forEach(el=>el.onclick=()=>go(el.dataset.url))}
function go(url){closePalette();if(url.startsWith("http"))window.open(url,"_blank","noopener");else document.querySelector(url)?.scrollIntoView({behavior:"smooth"})}
$("commandBtn").addEventListener("click",openPalette);palette.addEventListener("click",e=>{if(e.target===palette)closePalette()});pInput.addEventListener("input",e=>renderPalette(e.target.value));
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openPalette()}if(e.key==="Escape")closePalette();if(palette.classList.contains("open")&&(e.key==="ArrowDown"||e.key==="ArrowUp")){e.preventDefault();pItems[pIndex]?.classList.remove("active");pIndex=(pIndex+(e.key==="ArrowDown"?1:-1)+pItems.length)%pItems.length;pItems[pIndex]?.classList.add("active")}if(palette.classList.contains("open")&&e.key==="Enter")pItems[pIndex]?.click()});

$("randomTool").addEventListener("click",()=>{const cards=[...document.querySelectorAll(".card")];cards[Math.floor(Math.random()*cards.length)].scrollIntoView({behavior:"smooth",block:"center"})});


/* Advanced local tools */
const makeUuid=()=>crypto.randomUUID?crypto.randomUUID():([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]&15>>c/4).toString(16));
function flashCard(id){const el=$(id);el?.classList.add("flash");setTimeout(()=>el?.classList.remove("flash"),520)}
function safeText(s){return s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function renderMarkdown(s){
 let x=safeText(s);
 x=x.replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>");
 x=x.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/\`(.+?)\`/g,"<code>$1</code>");
 return x.split(/\n\n+/).map(block=>/^<h[1-3]>/.test(block)?block:"<p>"+block.replace(/\n/g,"<br>")+"</p>").join("");
}
$("generateUuid").addEventListener("click",()=>{$("uuidOutput").textContent=makeUuid();toast("UUID generated");flashCard("generateUuid")});
$("copyUuid").addEventListener("click",()=>copy($("uuidOutput").textContent,"UUID copied"));
$("encodeUrl").addEventListener("click",()=>{$("urlOutput").textContent=encodeURIComponent($("urlInput").value);toast("URL encoded")});
$("decodeUrl").addEventListener("click",()=>{try{$("urlOutput").textContent=decodeURIComponent($("urlInput").value);toast("URL decoded")}catch(e){$("urlOutput").textContent="Invalid encoded URL.";toast("Invalid URL")}});
$("copyUrl").addEventListener("click",()=>copy($("urlOutput").textContent,"URL result copied"));
$("markdownInput").addEventListener("input",()=>{$("markdownOutput").innerHTML=renderMarkdown($("markdownInput").value)||"Preview appears here."});
$("decodeJwt").addEventListener("click",()=>{
 try{
  const parts=$("jwtInput").value.trim().split(".");
  if(parts.length!==3)throw new Error("A JWT has 3 parts.");
  const decodePart=p=>JSON.parse(decodeURIComponent(escape(atob(p.replace(/-/g,"+").replace(/_/g,"/")))));
  const header=decodePart(parts[0]),payload=decodePart(parts[1]);
  $("jwtOutput").textContent="HEADER\n"+JSON.stringify(header,null,2)+"\n\nPAYLOAD\n"+JSON.stringify(payload,null,2);
  toast("JWT decoded locally");
 }catch(e){$("jwtOutput").textContent="Invalid JWT: "+e.message;toast("Invalid JWT")}
});
