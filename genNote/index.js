import { TinySegmenter } from "https://code4fukui.github.io/TinySegmenter/TinySegmenter.js";
const segs=TinySegmenter.segment("どうもこんにちは、ポテト君です");
var a = document.getElementById('a');
console.log(segs);
a.innerText = segs;