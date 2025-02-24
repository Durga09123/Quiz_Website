document.addEventListener("DOMContentLoaded", () => {
    const closeModalButton = document.getElementById("close-modal-button");
    const modal = document.getElementById("modal");

    // Only run this code if the modal and close button exist on the page
    if (closeModalButton && modal) {
        closeModalButton.addEventListener("click", () => {
            modal.classList.remove("active");
        });
    }

    // Clear previous session data when returning to the categories page
    sessionStorage.removeItem("questionCount");
    sessionStorage.removeItem("totalTime");
    sessionStorage.removeItem("quizStarted");
});
function toggleMenu() {
    const navbarMobile = document.querySelector(".navbar-mobile");
    navbarMobile.classList.toggle("active");
}

// Function to close the mobile menu when a link is clicked
function closeMenuOnLinkClick() {
    const navbarMobile = document.querySelector(".navbar-mobile");
    const navLinks = navbarMobile.querySelectorAll("a"); // Get all links inside the mobile menu

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navbarMobile.classList.remove("active"); // Close the menu
        });
    });
}

// Call the function to set up the event listeners
closeMenuOnLinkClick();
function closeMenuWithDelay(event) {
    event.preventDefault(); // Prevent immediate navigation
    const navbarMobile = document.querySelector(".navbar-mobile");
    navbarMobile.classList.remove("active"); // Close the menu

    // Navigate to the link's target after a short delay
    setTimeout(() => {
        window.location.href = event.target.href;
    }, 300); // 300ms delay
}
// Define subcategories for each subject
const subcategories = {
    tamil: ["Grammar", "Literature", "Poetry", "Prose"],
    english: ["Grammar", "Literature", "Writing", "Vocabulary"],
    maths: ["Arithmetic", "Algebra", "Geometry", "Trigonometry", "Statistics"],
    biology: ["Botany", "Zoology", "Genetics", "Ecology"],
    chemistry: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Analytical Chemistry"],
    physics: ["Mechanics", "Electromagnetism", "Thermodynamics", "Optics"],
    computer_science: ["Python", "Java", "C++", "Operating Systems"],
    history: ["Ancient History", "Medieval History", "Modern History", "World History"],
    geography: ["Physical Geography", "Human Geography", "Environmental Geography", "Geopolitics"]

};

let quizData; // Declare quizData globally

// Show subcategories for the selected subject
function showSubcategories(subject) {
    const modal = document.getElementById("modal");
    const subcategoriesContainer = document.getElementById("subcategories-container");
    subcategoriesContainer.innerHTML = "";

    document.getElementById("modal-title").textContent = `Subcategories for ${subject}`;

    subcategories[subject].forEach(subcategory => {
        const radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.name = "subcategory";
        radioButton.value = subcategory;
        radioButton.id = subcategory;

        const label = document.createElement("label");
        label.htmlFor = subcategory;
        label.textContent = subcategory;

        subcategoriesContainer.appendChild(radioButton);
        subcategoriesContainer.appendChild(label);
        subcategoriesContainer.appendChild(document.createElement("br"));
    });

    modal.classList.add("active");

    // Enable the #next button when a subcategory is selected
    const nextButton = document.getElementById("next");
    nextButton.disabled = false;
}

// Handle click event for the #next button
function next_btn() {
    const selectedSubcategory = document.querySelector('input[name="subcategory"]:checked');
    if (selectedSubcategory) {
        const selectedCategory = document.getElementById("modal-title").textContent.replace("Subcategories for ", "");
        console.log("Selected Category:", selectedCategory); // Debugging
        console.log("Selected Subcategory:", selectedSubcategory.value); // Debugging

        // Convert to lowercase before storing in sessionStorage
        sessionStorage.setItem("selectedCategory", selectedCategory.toLowerCase());
        sessionStorage.setItem("selectedSubcategory", selectedSubcategory.value.toLowerCase());

        // Open a new modal to select the number of questions
        showQuestionCountModal();
    } else {
        alert("Please select a subcategory!");
    }
}

// Show modal to select the number of questions
function showQuestionCountModal() {
    const modal = document.getElementById("question-count-modal");
    const questionCountContainer = document.getElementById("question-count-container");
    questionCountContainer.innerHTML = "";

    document.getElementById("question-count-title").textContent = "How many questions do you want to attempt?";

    const questionCounts = [5, 10, 15, 20];
    questionCounts.forEach(count => {
        const radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.name = "question-count";
        radioButton.value = count;
        radioButton.id = `question-count-${count}`;

        const label = document.createElement("label");
        label.htmlFor = `question-count-${count}`;
        label.textContent = `${count} questions`;

        questionCountContainer.appendChild(radioButton);
        questionCountContainer.appendChild(label);
        questionCountContainer.appendChild(document.createElement("br"));
    });

    modal.classList.add("active");

    // Enable the #start-quiz button when a question count is selected
    const startQuizButton = document.getElementById("start-quiz");
    startQuizButton.disabled = false;
}

// Handle click event for the #start-quiz button
function startQuiz() {
    const selectedQuestionCount = document.querySelector('input[name="question-count"]:checked');
    if (selectedQuestionCount) {
        const questionCount = parseInt(selectedQuestionCount.value, 10);
        sessionStorage.setItem("questionCount", questionCount);

        // Set total quiz time based on the number of questions
        let totalTime;
        switch (questionCount) {
            case 5:
                totalTime = 15 * 60; // 15 minutes
                break;
            case 10:
                totalTime = 30 * 60; // 30 minutes
                break;
            case 15:
                totalTime = 45 * 60; // 45 minutes
                break;
            case 20:
                totalTime = 60 * 60; // 60 minutes
                break;
            default:
                totalTime = 0;
        }
        sessionStorage.setItem("totalTime", totalTime);

        // Set a flag to indicate that the quiz has started
        sessionStorage.setItem("quizStarted", "true");

        // Redirect to the rules page
        window.location.href = "rules.html";
    } else {
        alert("Please select the number of questions!");
    }
}