const hamburgerMenu = document.querySelector(".hamburger-menu");
const aside = document.querySelector(".dashboard-nav");
const closeAside = document.querySelector(".close");

hamburgerMenu.addEventListener("click", ()=> {
    aside.classList.add("aside-show")
})

closeAside.addEventListener("click", () =>{
    hamburgerMenu.style.display = "block"
    aside.classList.remove("aside-show")
});