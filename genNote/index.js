import { TinySegmenter } from "https://code4fukui.github.io/TinySegmenter/TinySegmenter.js";
const segs=TinySegmenter.segment("どうもこんにちは、ポテト君です");
var a = document.getElementById('a');
console.log(segs);
a.innerText = segs;
fetch("https://sushi.ski/api/notes/local-timeline",{method: "POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({"limit":20})}).then(response=>response.json()).then(data=>{console.log(data);}).catch(error=>{console.error("Error:",error);});
