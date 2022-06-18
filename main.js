// https://musiclab.chromeexperiments.com/Shared-Piano 접속 후 F12로 개발자 도구를 열어서 아래 코드를 복붙 후 실행하세요
// https://github.com/Steve415723/auto_shared_piano

var example_1 = `E4.'D4.C4...D4...E4...E4...E4-D4...D4...D4-E4...G4...G4-
E4.'D4.C4...D4...E4...E4...E4-D4...D4...E4.'D4.C4"`

var example_2 = `[C3E3G3]"[C3E3G3]"[B2D3G3]"[C3E3G3]"
[C3E3G3]"[C3E3G3]"[B2D3G3]"[C3E3G3]"`

var bpm = 120 // bpm 설정(예: 60 -> var bpm = 60, 뒤에 적힌 숫자를 바꾸기)
var note_list = [
  example_1, example_2
]

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// 흰건반, 검은건반 버튼 가져오기
function get_white_note(octave=4,note) {
    if (get_octave_count() > 6) octave++;
    return document.querySelector("#piano > piano-keyboard")
    .shadowRoot.querySelector("#container > piano-keyboard-octave:nth-child(" + octave + ")")
    .shadowRoot.querySelector("#white-notes > piano-keyboard-note:nth-child(" + note + ")")
    .shadowRoot.querySelector("#container > button")
}

function get_black_note(octave=4,note) {
    if (get_octave_count() > 6) octave++;
    if (note <= 2) note += 1;
    else note += 2;
    return document.querySelector("#piano > piano-keyboard")
    .shadowRoot.querySelector("#container > piano-keyboard-octave:nth-child(" + octave + ")")
    .shadowRoot.querySelector("#black-notes > piano-keyboard-note:nth-child(" + note + ")")
    .shadowRoot.querySelector("#container > button")
}

function get_octave_count() {
    return Number(document.querySelector("#piano > piano-keyboard").shadowRoot.querySelector("#container").className.slice(-1))
}

// 기본 악보 처리 설정
var white_notes = ["C","D","E","F","G","A","B"]
var white_octaves = [1,2,3,4,5,6,7]
var black_notes = ["C","D","F","G","A"]
var black_octaves = [1,2,3,4,5,6,7]
var note_time = 0
var playlist = {}
var mouse_up_list = {}
var time_list = []
var multi_note = false

for (let note_text of note_list) { // 화음 기능 제작으로 인해서 해당 코드가 많이 꼬였습니다. 미래의 제가 해결해주겠죠?
    note_text = note_text.replaceAll('\n','').replaceAll('/',' ').replaceAll(';',' '.repeat(4)).replaceAll(':',' '.repeat(15)).replaceAll('_',' '.repeat(7))
    .replaceAll("'",'.'.repeat(4)).replaceAll('"','.'.repeat(15)).replaceAll('-','.'.repeat(7)).replaceAll('~',' '.repeat(16)).replaceAll("b","♭").toUpperCase()
    .replaceAll("D♭","C#").replaceAll("E♭","D#").replaceAll("G♭","F#").replaceAll("A♭","G#").replaceAll("B♭","A#").replaceAll("F♭","E")
    for (var i of [1,2,3,4,5,6]) note_text = note_text.replaceAll(`B#${i}`,`C${i + 1}`)
    for (var i of [2,3,4,5,6,7]) note_text = note_text.replaceAll(`C♭${i}`,`B${i - 1}`)
    note = []
    for (let index = 0; index < note_text.split('').length; index++) {
        i = note_text.split('')[index]
        if (black_notes.includes(i) && note_text.split('')[index + 1] == '#' && black_octaves.includes(Number(note_text.split('')[index + 2]))) {
            if (note.length > 0 && !multi_note) {
                if (Object.keys(mouse_up_list).includes(note_time.toString())) for (var j of note) mouse_up_list[note_time].push(j)
                else mouse_up_list[note_time] = note
                note = []
            }
            if (Object.keys(playlist).includes(note_time.toString())) playlist[note_time].push(['b',Number(note_text.split('')[index + 2]),black_notes.indexOf(i) + 1])
            else playlist[note_time] = [['b',Number(note_text.split('')[index + 2]),black_notes.indexOf(i) + 1]]
            if (!multi_note) note_time++;
            note.push(['b',Number(note_text.split('')[index + 2]),black_notes.indexOf(i) + 1])
        }
        else if (white_notes.includes(i) && white_octaves.includes(Number(note_text.split('')[index + 1]))) {
            if (note.length > 0 && !multi_note) {
                if (Object.keys(mouse_up_list).includes(note_time.toString())) for (var j of note) mouse_up_list[note_time].push(j)
                else mouse_up_list[note_time] = note
                note = []
            }
            if (Object.keys(playlist).includes(note_time.toString())) playlist[note_time].push(['w',Number(note_text.split('')[index + 1]),white_notes.indexOf(i) + 1])
            else playlist[note_time] = [['w',Number(note_text.split('')[index + 1]),white_notes.indexOf(i) + 1]]
            if (!multi_note) note_time++;
            note.push(['w',Number(note_text.split('')[index + 1]),white_notes.indexOf(i) + 1])
        }
        else if (i == '.' && !multi_note) note_time++;
        else if (i == ' ' && !multi_note) {
            if (note.length > 0) {
                if (Object.keys(mouse_up_list).includes(note_time.toString())) for (var j of note) mouse_up_list[note_time].push(j)
                else mouse_up_list[note_time] = note
                note = []
            }
            note_time++;
        }

        if (i == '[') {
            multi_note = true;
            //if (note_time > 0) note_time++;
            if (note.length > 0) {
                if (Object.keys(mouse_up_list).includes(note_time.toString())) for (var j of note) mouse_up_list[note_time].push(j)
                else mouse_up_list[note_time] = note
                note = []
            }
        }
        if (i == ']') {
            multi_note = false;
            note_time++;
        }
    }
    if (note.length > 0) {
        if (Object.keys(mouse_up_list).includes(note_time.toString())) for (var j of note) mouse_up_list[note_time].push(j)
        else mouse_up_list[note_time] = note
        note = []
    }
    time_list.push(note_time)
    note_time = 0
}

console.log(time_list)
time_list.sort()
if (get_octave_count() < 5) throw new Error('5옥타브 이상으로 설정해야 연주할 수 있습니다.')

var time = 0
bpm = bpm + bpm * 0.05 // bpm 수치 5% 보정(원곡보다 살짝 느린 현상이 발생)
time2 = Date.now()
speed_text = ``
speed_time = Date.now()

while (time <= time_list.slice(-1)[0] + 1) { // 악보 연주
    if (time >= 16 && time % 16 == 0) {
        speed_text = `, ${(16 / ((Date.now() - speed_time) / 1000)).toFixed(2)}`
        speed_time = Date.now()
    }
    document.querySelector("#wrapper > header > piano-logo").shadowRoot.querySelector("#header-logo > h1 > a").innerHTML = `SHARED PIANO(${time}/${time_list.slice(-1)[0] + 1}${speed_text})`;
    document.querySelector("#wrapper > header").style = `background: linear-gradient(90deg, #32ce38 ${(time / (time_list.slice(-1)[0] + 1)) * 100}%, #FFFFFF 0%);`
    if (Object.keys(playlist).includes(time.toString())) {
        play(playlist[time],'mousedown')
    }
    time++;
    await wait((30 / bpm / 4 * 1000) * 2 - 1);
    if (Object.keys(mouse_up_list).includes((time).toString())) {
        play(mouse_up_list[time],'mouseup')
    }
    await wait(0);
}

function play(play_data,eventtype) { // 건반 누르기, 떼기
    if (play_data.length == 1) {
        play_data = play_data[0]
        if (play_data[0] == 'w') get_white_note(play_data[1],play_data[2]).dispatchEvent(new Event(eventtype))
        else get_black_note(play_data[1],play_data[2]).dispatchEvent(new Event(eventtype))
    }
    else {
        for (var data of play_data) {
            if (data[0] == 'w') get_white_note(data[1],data[2]).dispatchEvent(new Event(eventtype))
            else get_black_note(data[1],data[2]).dispatchEvent(new Event(eventtype))
        }
    }
}

time = 0 // 시간 초기화
console.log(Date.now() - time2) // 총 걸린 시간 표시(ms)
