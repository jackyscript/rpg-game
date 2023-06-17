export var typeWriterNotWriting = true;

var gameTextElement = document.getElementById("gameText");

function resetTextArea() {
    gameTextElement.textContent = "";
}

export function typewriter(txt) {
    var i = 0;
    var speed = 10; /* The speed/duration of the effect in milliseconds */

    resetTextArea();

    function typewriterInternal() {

        if (i < txt.length) {
            writeText();
        } else {
            typeWriterNotWriting = false;
        }

        function writeText() {

            typeWriterNotWriting = true;
            var currentChar = txt.charAt(i);
            setupTextSpeed(currentChar);
            gameTextElement.textContent += currentChar;
            i++;
            setTimeout(typewriterInternal, speed);

        }

        function setupTextSpeed(currentChar) {

            if (currentChar.includes('.') || currentChar.includes('!'))
                speed = 400;

            else
                speed = 10;

        }

    }

    typewriterInternal(txt);

}