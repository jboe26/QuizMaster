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
    // $("#next2").on("click", function (event) {
    //     $("#q2").hide();
    //     $("#q3").show();
    // });
    // $("#next3").on("click", function (event) {
    //     $("#q3").hide();
    //     $("#q4").show();
    // });
    // $("#next4").on("click", function (event) {
    //     $("#q4").hide();
    //     $("#q5").show();
    // });
    // $("#next5").on("click", function (event) {
    //     $("#q5").hide();
    //     $("#q6").show();
    // });
    // $("#next6").on("click", function (event) {
    //     $("#q6").hide();
    //     $("#q7").show();
    // });
    // $("#next7").on("click", function (event) {
    //     $("#q7").hide();
    //     $("#q8").show();
    // });
    // $("#next8").on("click", function (event) {
    //     $("#q8").hide();
    //     $("#q9").show();
    // });
    // $("#next9").on("click", function (event) {
    //     $("#q9").hide();
    //     $("#q10").show();
    // });
    // Answer Key
    var answers = {
        "answer1": "1",
        "answer2": "1",
        // "answer3": "1",
        // "answer4": "1",
        // "answer5": "1",
        // "answer6": "1",
        // "answer7": "1",
        // "answer8": "1",
        // "answer9": "1",
        // "answer10": "1"
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
        // For post route to the database for quiz and result
        // var category = document.getElementById('idQ');
        // $('.slider').change(function () {
        //     $('#slider_input').val(category);
        // });

        // var grade = document.getElementById('score');
        // $('.hidden').change(function () {
        //     $('#score_input').val(grade);
        // });

        //    Give html elements text from variables linked to quiz performance
        cA = document.getElementById("correctAnswers");
        catxt = document.createTextNode("You got " + correctAnswers + " questions right.   ");
        cA.appendChild(catxt);
        iA = document.getElementById("incorrectAnswers");
        iatxt = document.createTextNode("You got " + incorrectAnswers + " questions wrong.");
        cA.appendChild(iatxt);
        // mTotal = document.getElementById("missed");
        // mtxt = document.createTextNode("You missed " + missed + " questions.");
        // mTotal.appendChild(mtxt);
        scoreT = document.getElementById("score");
        scoretxt = document.createTextNode("Your score " + score + "%");
        scoreT.appendChild(scoretxt);
        // Shows results div
        $("#result").show();
        $("#restartEnd").show();
        
    });
});