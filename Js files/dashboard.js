const hamburgerMenu = document.querySelector(".hamburger-menu");
const aside = document.querySelector(".dashboard-nav");
const closeAside = document.querySelector(".close");
// const nav = document.querySelector(".nav");
// const dashboardMain = document.querySelector(".dashboard-main");

// the hmburger menu
hamburgerMenu.addEventListener("click", ()=> {
    aside.classList.add("aside-show")
})

closeAside.addEventListener("click", () =>{
    hamburgerMenu.style.display = "block"
    aside.classList.remove("aside-show")
});

const navItems = document.querySelectorAll(".dashboard-nav [data-page]");
const pages = document.querySelectorAll(
    ".scan-history-main, .saved-websites-main, .community-container, .learning-container, .profile-main, .settings-main"
);

// Hide all pages initially
pages.forEach((page) => {
    page.style.display = "none";
});

// Show scan history by default
document.querySelector(".scan-history-main").style.display = "block";

// Listen for clicks
navItems.forEach((item) => {

    item.addEventListener("click", () => {

        const pageName = item.dataset.page;

        console.log("Clicked:", pageName);

        // Hide all pages
        pages.forEach((page) => {
            page.style.display = "none";
        });

        // Show the correct page
        if (pageName === "scan-history") {
            document.querySelector(".scan-history-main").style.display = "block";
        }

        if (pageName === "saved-websites") {
            document.querySelector(".saved-websites-main").style.display = "block";
        }

        if (pageName === "community") {
            document.querySelector(".community-container").style.display = "block";
        }

        if (pageName === "learning") {
            document.querySelector(".learning-container").style.display = "block";
        }

        if (pageName === "profile") {
            document.querySelector(".profile-main").style.display = "block";
        }

        if (pageName === "settings") {
            document.querySelector(".settings-main").style.display = "block";
        }
    });
});


// Community sub-nav (Trending threats / Report a Website / My Reports)
const pageNav = document.querySelector(".main-nav");
const trending = document.querySelector(".trending-info-container");
const reportWebsite = document.querySelector(".report-website-info-container");
const myReports = document.querySelector(".my-reports-container");

const communityNavItems = pageNav.children;

// Default state
communityNavItems[0].classList.add("active");
trending.style.display = "block";

pageNav.addEventListener("click", (e) => {
    const clickedButton = e.target.closest("button");
    if (!clickedButton) return;

    // Remove active from all buttons
    [...communityNavItems].forEach((button) => {
        button.classList.remove("active");
    });

    // Add active to clicked button
    clickedButton.classList.add("active");

    // Hide all sections
    trending.style.display = "none";
    reportWebsite.style.display = "none";
    myReports.style.display = "none";

    // Display the corresponding section
    if (clickedButton === communityNavItems[0]) {
        trending.style.display = "block";
    } else if (clickedButton === communityNavItems[1]) {
        reportWebsite.style.display = "block";
    } else if (clickedButton === communityNavItems[2]) {
        myReports.style.display = "block";
    }
});



