if (window.location.pathname.includes("quiz.html")) {
    let questions; // Declare questions in the global scope
    let currentQuestionIndex = 0;
    let totalTime = parseInt(sessionStorage.getItem("totalTime"), 10);
    let timer;
    let score = 0;
    let selectedAnswer = null; // Track the selected answer for the current question
    let userAnswers = []; // Track user's answers for all questions

    // Fetch quiz data from JSON file
    fetch("quizData.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch quiz data");
        }
        return response.json();
    })
    .then(data => {
        console.log("Quiz data fetched successfully:", data); // Debugging
        quizData = data; // Assign fetched data to quizData
        initializeQuiz(); // Initialize the quiz after data is fetched
    })
    .catch(error => {
        console.error("Error fetching quiz data:", error); // Debugging
    });
    function initializeQuiz() {
        const selectedCategory = sessionStorage.getItem("selectedCategory");
        const selectedSubcategory = sessionStorage.getItem("selectedSubcategory");
        const questionCount = parseInt(sessionStorage.getItem("questionCount"), 10);

        console.log("Retrieved Category:", selectedCategory); // Debugging
        console.log("Retrieved Subcategory:", selectedSubcategory); // Debugging
        console.log("Retrieved Question Count:", questionCount); // Debugging

        if (!selectedCategory || !selectedSubcategory || !questionCount) {
            alert("Category, subcategory, or question count not selected. Redirecting to categories page.");
            window.location.href = "categories.html";
            return;
        }

        // Convert to lowercase to handle case sensitivity
        const categoryKey = selectedCategory.toLowerCase();
        const subcategoryKey = selectedSubcategory.toLowerCase();

        console.log("Category Key:", categoryKey); // Debugging
        console.log("Subcategory Key:", subcategoryKey); // Debugging

        // Assign questions to the global variable
        const allQuestions = quizData[categoryKey]?.[subcategoryKey];
        if (!allQuestions || allQuestions.length === 0) {
            alert("No quiz questions available for this category.");
            window.location.href = "categories.html";
            return;
        }

        // Select a random subset of questions based on the selected count
        questions = allQuestions.slice(0, questionCount);

        console.log("Questions loaded:", questions); // Debugging

        // Initialize userAnswers array with null values
        userAnswers = new Array(questions.length).fill(null);

        // Start the total quiz timer
        startTotalTimer();

        // Display the first question
        displayQuestion();

        // Enable/disable navigation buttons based on the current question index
        updateNavigationButtons();
    }

    function displayQuestion() {
        console.log("Displaying question:", currentQuestionIndex); // Debugging
        if (currentQuestionIndex >= questions.length) {
            return; // Do not submit automatically
        }
    
        const questionData = questions[currentQuestionIndex];
        const quizContainer = document.getElementById("quiz-container");
    
        // Render the question and options as radio buttons
        quizContainer.innerHTML = `
            <h2>${questionData.question}</h2>
            <div class="options">
                ${questionData.options.map((option, index) => `
                    <label>
                        <input type="radio" 
                               name="answer" 
                               value="${index}" 
                               ${userAnswers[currentQuestionIndex] === index ? 'checked' : ''}
                               onchange="selectOption(${index})">
                        ${option}
                    </label>
                `).join("")}
            </div>
        `;
    
        // Enable/disable navigation buttons based on the current question index
        updateNavigationButtons();
    }

    function startTotalTimer() {
        const timerElement = document.getElementById("time");
        timer = setInterval(() => {
            totalTime--;
            const minutes = Math.floor(totalTime / 60);
            const seconds = totalTime % 60;
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;

            if (totalTime <= 0) {
                clearInterval(timer); // Stop the timer
                endQuiz(); // Submit the quiz automatically
            }
        }, 1000);
    }

    function endQuiz() {
        // Stop the timer (if it's still running)
        clearInterval(timer);
    
        // Calculate the final score
        calculateScore();
    
        // Store the score, total questions, user answers, and questions
        sessionStorage.setItem("quizScore", score);
        sessionStorage.setItem("totalQuestions", questions.length);
        sessionStorage.setItem("userAnswers", JSON.stringify(userAnswers));
        sessionStorage.setItem("questions", JSON.stringify(questions));
    
        // Redirect to the result page
        window.location.href = "result.html";
    }

    function calculateScore() {
        score = 0; // Reset score
        questions.forEach((question, index) => {
            if (userAnswers[index] === question.correctAnswer) {
                score++; // Increment score for correct answers
            }
        });
    }
    function selectOption(selectedIndex) {
        // Save the selected answer
        userAnswers[currentQuestionIndex] = selectedIndex;
    
        // Move to the next question or show the submit button if it's the last question
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        } else {
            // On the last question, show the submit button
            updateNavigationButtons();
        }
    }
    // Function to navigate to the next question
    function nextQuestion() {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        }
    }

    // Function to navigate to the previous question
    function previousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion();
        }
    }

    // Function to submit the quiz
    function submitQuiz() {
        endQuiz(); // Submit the quiz
    }

    // Function to update the state of navigation buttons
    function updateNavigationButtons() {
        const previousButton = document.getElementById("previous-button");
        const nextButton = document.getElementById("next-button");
        const submitButton = document.getElementById("submit-button");

        // Disable "Previous" button on the first question
        previousButton.disabled = currentQuestionIndex === 0;

        // Show "Submit" button on the last question, otherwise show "Next" button
        if (currentQuestionIndex === questions.length - 1) {
            nextButton.style.display = "none";
            submitButton.style.display = "inline-block";
        } else {
            nextButton.style.display = "inline-block";
            submitButton.style.display = "none";
        }
    }
}