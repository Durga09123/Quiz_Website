document.addEventListener("DOMContentLoaded", () => {
    const quizStarted = sessionStorage.getItem("quizStarted");

    if (quizStarted !== "true") {
        alert("Please select the number of questions first. Redirecting to categories page.");
        window.location.href = "categories.html";
    } else {
        const questionCount = sessionStorage.getItem("questionCount");

        if (!questionCount) {
            alert("Number of questions not selected. Redirecting to categories page.");
            window.location.href = "categories.html";
        } else {
            console.log("Number of questions selected:", questionCount);
            // Display the number of questions on the rules page
            document.getElementById("selected-question-count").textContent = questionCount;
        }
    }
});

// Function to start the quiz
function startQuiz() {
    // Redirect to the quiz page
    window.location.href = "quiz.html";
}