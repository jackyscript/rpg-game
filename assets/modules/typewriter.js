export var typeWriterNotWriting = true;

function resetTextArea() {
    document.getElementById("gameText").innerHTML = "";
}

export function typewriter(txt) {
    var i = 0;
    var txt = txt;
    var speed = 10; /* The speed/duration of the effect in milliseconds */

    resetTextArea();

    function typewriterInternal() {
        if (i < txt.length) {
            typeWriterNotWriting = true
            var currentChar = txt.charAt(i);
            if (currentChar.includes('.') || currentChar.includes('!'))
                speed = 400;
            else
                speed = 10;
            document.getElementById("gameText").innerHTML += currentChar;
            i++;
            setTimeout(typewriterInternal, speed);
        } else {
            typeWriterNotWriting = false;
        }
    }
    typewriterInternal(txt);
}