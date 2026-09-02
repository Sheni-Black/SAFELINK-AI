const pageNav = document.querySelector(".main-nav");

const trending = document.querySelector(".trending-info-container");
const reportWebsite = document.querySelector(".report-website-info-container");
const myReports = document.querySelector(".my-reports-container");

const navItems = pageNav.children;

// Default state
navItems[0].classList.add("active");
trending.style.display = "block";


pageNav.addEventListener("click", (e) => {

    const clickedButton = e.target.closest("button");

    if (!clickedButton) return;

    // Remove active from all buttons
    [...navItems].forEach((button) => {
        button.classList.remove("active");
    });

    // Add active to clicked button
    clickedButton.classList.add("active");

    // Hide all sections
    trending.style.display = "none";
    reportWebsite.style.display = "none";
    myReports.style.display = "none";

    // Display the corresponding section
    if (clickedButton === navItems[0]) {
        trending.style.display = "block";
    }

    else if (clickedButton === navItems[1]) {
        reportWebsite.style.display = "block";
    }

    else if (clickedButton === navItems[2]) {
        myReports.style.display = "block";
    }
});