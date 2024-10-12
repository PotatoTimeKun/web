async function getNote(username,servername){
    var response
    var id
    try {
        response = await fetch(`https://${servername}/api/users/show`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username
            })
        })
        response = await response.json()
        id = response.id
    } catch (error) {
        console.error("Error: ",error);
        return []
    }
    try {
        response = await fetch(`https://${servername}/api/users/notes`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: id,
                withRenotes: false,
                limit: 100
            })
        })
        response = await response.json()
    } catch (error) {
        console.error("Error: ",error);
        return []
    }
    return response
}

var studiedModel
var setServer
var cooltime = 0

function reduceCooltime(){
    if(cooltime>0)cooltime-=1
}

setInterval(reduceCooltime, 1000);

async function getNoteButton(){
    if(cooltime>0){
        alert("APIのクールタイム中です")
        return
    }
    cooltime = 10
    document.getElementById("getButton").text = "生成中..."
    let username = document.getElementById("username").value
    let servername = document.getElementById("servername").value
    setServer = servername
    let notes = await getNote(username,servername)
    if(notes.length==0){
        alert("ノートを読み込めませんでした")
        return
    }
    let splited = splitNotes(notes)
    var model = {}
    for (let splitedNote of splited){
        model = study(splitedNote,model)
    }
    let note = genelateNote(model)
    postNote = note
    document.getElementById("note").innerText = note
    studiedModel = model
    document.getElementById("getButton").text = "ノートを生成"
    document.getElementById("regenButton").hidden = false
    document.getElementById("postButton").hidden = false
}

function regen(){
    let note = genelateNote(studiedModel)
    postNote = note
    document.getElementById("note").innerText = note
}

var postNote

function post(){
    var URI = "https://"+setServer+"/share?text="+encodeURIComponent(postNote)+"%0a"+encodeURIComponent("#Misskeyマルコフ連鎖ノート生成")+"&url=https://potatotimekun.github.io/web/genNote/"
    window.open(URI,"_blank")
}

function splitNotes(notes){
    const segmenterFr = new Intl.Segmenter('ja', { granularity: 'word' })
    var splited=[]
    let blankPattern = /^\s*$/
    let deletePattern = [
        /\[.*?\]\(.*?\)/,
        /https?:\/\/[\w!\?/\+\-_~=;\.,\*&@#\$%\(\)'\[\]]+/,
        /```.*?```/,
        /`.*?`/,
        /@[^\s]*/,
        /#[^\s]*/
    ]
    for (let note of notes) {
        if(note.text==null){
            continue
        }
        var wordList=[]
        var text = note.text
        for (let pattern of deletePattern){
            text = text.replace(pattern,"")
        }
        var emojiSplit = text.split(/(:[\w0-9]+?:)|\s/g)
        for (let sentence of emojiSplit){
            if(sentence==undefined)continue
            if(blankPattern.test(sentence))continue
            if(/(:[\w0-9]+?:)/.test(sentence)){
                wordList.push(sentence)
                continue
            }
            const iterator = segmenterFr.segment(sentence)[Symbol.iterator]()
            for (const s of iterator) {
                if(s.segment==undefined)continue
                wordList.push(s.segment)
            }
        }
        if(wordList.length>0)splited.push(wordList)
    }
    return splited
}

function study(words,model={}){
    if(model["startOfNote"]==undefined)model["startOfNote"] = []
    model["startOfNote"].push(words[0])
    for (let i=0;i<words.length;i++){
        if(model[words[i]]==undefined){
            model[words[i]] = []
        }
        if(i==words.length-1){
            model[words[i]].push(null)
            continue
        }
        model[words[i]].push(words[i+1])
    }
    return model
}

function genelateNote(model){
    var note = ""
    var word = model["startOfNote"][Math.floor(Math.random()*model["startOfNote"].length)]
    var count = 0
    while (word!=null) {
        note+=word
        word = model[word][Math.floor(Math.random()*model[word].length)]
        count+=1
        if(count>200){break}
    }
    return note
}