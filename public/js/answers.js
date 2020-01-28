$(document).ready(function () {
    // Start button to show first question
    $("#start").on("click", function (event) {
        $("#start").hide();
        $("#q1").show();
        $("#restart").show();
    });
    // A series of questions that shows based on previous button; hides on #next[i] button
    $("#next1").on("click", function (event) {
        $("#q1").hide();
        $("#q2").show();
    });
    
    // Answer Key
    var answers = {
        "answer1": "1",
        "answer2": "1",
    };

    $("#done").on("click", function (event) {
        // Results variables to be displayed in results div based on user performance
        var correctAnswers = 0;
        var missed = 0;
        var incorrectAnswers = 0;
        var score = 0;
        // Hides question10
        $("#q2").hide();
        $("#restart").hide();
        // $("#result").show();
        // Functions to increment results variables
        function markIncorrect() {
            missed++;
            incorrectAnswers++;
            console.log("Hit INCO")
        };
        function markCorrect() {
            correctAnswers++;
            // Changed score to increment by 50 to conform to 2 question demo
            score += 50;
            console.log("HITCO")
        };

        // on #done click get user input check if Answered. Check if answer is not correct. Else answer is correct.
        $questions = $(".question");
        $questions.each(function () {
            var answer = $(this).find("input:checked"),
                key = answer.attr("name"),
                val = answer.attr("id");

            if (answer.length === 0) {
                markIncorrect();
                console.log("inco");
                console.log(missed);
            } else if (answers[key] !== val) {
                markIncorrect();
                console.log("i$$$$nco");
            } else {
                markCorrect();
                console.log("CO");
            }
        });
        //    Give html elements text from variables linked to quiz performance
        cA = document.getElementById("correctAnswers");
        catxt = document.createTextNode("You got " + correctAnswers + " questions right.   ");
        cA.appendChild(catxt);
        iA = document.getElementById("incorrectAnswers");
        iatxt = document.createTextNode("You got " + incorrectAnswers + " questions wrong.");
        cA.appendChild(iatxt);
        scoreT = document.getElementById("score");
        scoretxt = document.createTextNode("Your score " + score + "%");
        scoreT.appendChild(scoretxt);
        // Shows results div
        $("#result").show();
        $("#restartEnd").show();
        
    });
});