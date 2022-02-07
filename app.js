let fullWords = [];
let words = [];
let results = {
    "correctIndex": [0, 0, 0, 0, 0],
    "correct": [" "],
    "contains": [],
    "incorrect": []
};

$(document).ready(function () {

    $.ajax({
        url: "https://raw.githubusercontent.com/briansayre/wordle-helper/main/words.txt",
        type: 'GET',
        success: function (res) {
            fullWords = res.split("\n");
            words = fullWords;
        }
    });

});

function findWords() {

    // get correct given
    words = fullWords;
    let inputedWord = "";
    for (let i = 0; i < 5; i++) {
        char = document.getElementById("letter-" + i).innerHTML;
        if (char.length != 1) {
            inputedWord += " ";
        } else {
            inputedWord += char;
        }
    }
    inputedWord = inputedWord.toLowerCase();

    // remove the words that dont have correct letter
    if (inputedWord.trim() != "") {
        let newWords = [];
        for (let i = 0; i < words.length; i++) {
            let good = true;
            for (let j = 0; j < 5; j++) {
                if (words[i].charAt(j) != inputedWord.charAt(j) && inputedWord.charAt(j) != " ") {
                    good = false;
                    break;
                }
            }
            if (good) newWords.push(words[i]);
        }
        words = newWords;
    }

    // remove words that contain an incorrect letter
    if (results.incorrect.length != 0) {
        console.log("here")
        newWords = [];
        for (let i = 0; i < words.length; i++) {
            let good = true;
            for (let j = 0; j < results.incorrect.length; j++) {
                if (words[i].includes(results.incorrect[j])) {
                    good = false;
                    break;
                }
            }
            if (good) newWords.push(words[i])
        }
        words = newWords;
    }

    // remove words that dont have contained letters
    if (results.contains.length != 0) {
        newWords = [];
        for (let i = 0; i < words.length; i++) {
            let good = true;
            for (let j = 0; j < results.contains.length; j++) {
                if (!words[i].includes(results.contains[j])) {
                    good = false;
                    break;
                }
            }
            if (good) {
                newWords.push(words[i]);
            }
        }
        words = newWords;
    }

    var ul = document.getElementById("possible");
    ul.innerHTML = "";
    for (let w = 0; w < words.length; w++) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(words[w]));
        ul.appendChild(li);
    }
}

function cycleCorrect(index) {
    console.log("letter-" + index)
    let element = document.getElementById("letter-" + index);
    results.correctIndex[index] = (results.correctIndex[index] + 1) % results.correct.length;
    element.innerHTML = results.correct[results.correctIndex[index]];
    if (element.innerHTML != " ") {
        element.classList.remove("letter-default");
        element.classList.add("letter-correct");
    } else {
        element.classList.add("letter-default");
        element.classList.remove("letter-correct");
    }
}

function toggleLetter(letter) {
    let element = document.getElementById(letter);
    let className = element.className;
    if (className.includes("letter-unknown")) {
        element.classList.remove("letter-unknown");
        element.classList.add("letter-incorrect");
        results.incorrect.push(letter);
    } else if (className.includes("letter-incorrect")) {
        element.classList.remove("letter-incorrect");
        element.classList.add("letter-contains");
        results.contains.push(letter);
        results.incorrect.splice(results.incorrect.indexOf(letter), 1);
    } else if (className.includes("letter-contains")) {
        element.classList.remove("letter-contains");
        element.classList.add("letter-correct");
        results.correct.push(letter);
        results.contains.splice(results.contains.indexOf(letter), 1);
    } else if (className.includes("letter-correct")) {
        element.classList.remove("letter-correct");
        element.classList.add("letter-unknown");
        results.correct.splice(results.correct.indexOf(letter), 1);
    }
    console.log(results)
}
