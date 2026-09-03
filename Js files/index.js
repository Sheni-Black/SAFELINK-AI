const faqQuestions = document.querySelectorAll(".faq-question");
const navDisplay = document.querySelector(".nav-bars");
const navHamburger = document.querySelector(".hamburger-nav")
const navClose = document.querySelector(".nav-close")

faqQuestions.forEach((question) =>{
    question.addEventListener("click", ()=>{
        const container = question.closest(".faq-question-container");
        const answer = container.querySelector(".faq-answer");
        const arrow = container.querySelector(".arrow");

        answer.classList.toggle("display-msg");
        if(answer.classList.contains("display-msg")){
            arrow.textContent = "keyboard_arrow_up"
        }
        else{
            arrow.textContent = "keyboard_arrow_down"
        }
    })
})

navDisplay.addEventListener("click", () =>{
    navDisplay.style.display = "none"
    navClose.style.display = "block"
    navHamburger.style.display = "block"
})

navClose.addEventListener("click", () =>{
    navDisplay.style.display = "block"
    navClose.style.display = "none"
    navHamburger.style.display = "none"
})