if (window.location.pathname.includes("result.html")) {
    document.addEventListener("DOMContentLoaded", () => {
        const score = parseInt(sessionStorage.getItem("quizScore"));
        const totalQuestions = parseInt(sessionStorage.getItem("totalQuestions"));
        const userAnswers = JSON.parse(sessionStorage.getItem("userAnswers"));
        const questions = JSON.parse(sessionStorage.getItem("questions"));

        console.log("Score from sessionStorage:", score); // Debugging
        console.log("Total Questions from sessionStorage:", totalQuestions); // Debugging
        console.log("User Answers from sessionStorage:", userAnswers); // Debugging
        console.log("Questions from sessionStorage:", questions); // Debugging

        if (score !== null && totalQuestions !== null && userAnswers && questions) {
            const resultContainer = document.getElementById("result-container");

            // Display all questions with correct and user answers
            questions.forEach((question, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                const isUnanswered = userAnswer === null;

                // Determine the background color based on the answer
                let backgroundColor = "";
                if (isUnanswered) {
                    backgroundColor = "yellow"; // Unanswered
                } else if (isCorrect) {
                    backgroundColor = "green"; // Correct answer
                } else {
                    backgroundColor = "red"; // Wrong answer
                }

                // Create the question card
                const questionCard = document.createElement("div");
                questionCard.className = "question-card";
                questionCard.style.backgroundColor = backgroundColor;

                questionCard.innerHTML = `
                    <h3>${question.question}</h3>
                    <p><strong>Your Answer:</strong> ${isUnanswered ? "Not answered" : question.options[userAnswer]}</p>
                    <p><strong>Correct Answer:</strong> ${question.options[question.correctAnswer]}</p>
                `;

                resultContainer.appendChild(questionCard);
            });

            // Display the score
            const scoreText = document.createElement("p");
            scoreText.textContent = `Your score is ${score} out of ${totalQuestions}.`;
            resultContainer.appendChild(scoreText);

            // Calculate and display the percentage circle
            const percentage = (score / totalQuestions) * 100;
            const circleProgress = document.querySelector(".circle-progress");
            const circleText = document.querySelector(".circle-text");

            circleProgress.style.strokeDashoffset = 314 - (314 * percentage) / 100; // 314 = 2 * π * r (r = 50)
            circleText.textContent = `${Math.round(percentage)}%`;

            // Set circle color based on percentage
            if (percentage >= 80) {
                circleProgress.style.stroke = "green";
            } else if (percentage >= 50) {
                circleProgress.style.stroke = "orange";
            } else {
                circleProgress.style.stroke = "red";
            }
        } else {
            alert("No quiz results found. Redirecting to home page.");
            window.location.href = "index.html";
        }
    });
}