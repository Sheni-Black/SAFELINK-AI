const faqQuestions = document.querySelectorAll(".faq-question");

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