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
    ".scan-history-main, .saved-websites-main, .community-container, .learning-container, .profile-main, .settings-main, .notification-settings-main, .delete-account-main, .ai-assistant-main"
);
const title = document.querySelector(".title-change")

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
            title.textContent = "Saved Websites"
        }

        if (pageName === "community") {
            document.querySelector(".community-container").style.display = "block";
            title.textContent = "Community"
        }

        if (pageName === "ai-assistant") {
            document.querySelector(".ai-assistant-main").style.display = "flex";
            title.textContent = "AI Assistance"
        }

        if (pageName === "learning") {
            document.querySelector(".learning-container").style.display = "block";
            title.textContent = "Learning Center"
        }

        if (pageName === "profile") {
            document.querySelector(".profile-main").style.display = "block";
            title.textContent = "Profile"
        }

        if (pageName === "settings") {
            document.querySelector(".settings-main").style.display = "block";
            title.textContent = "Settings"
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


// Settings sub-pages: Notifications & Delete Account
const settingsMain = document.querySelector(".settings-main");
const notificationSettingsPage = document.querySelector(".notification-settings-main");
const deleteAccountPage = document.querySelector(".delete-account-main");

// Open Notification Settings when the "Notifications" card (inside Settings) is clicked
const notificationsCard = settingsMain.querySelector(".notifications-card");
notificationsCard.addEventListener("click", () => {
    pages.forEach((page) => (page.style.display = "none"));
    notificationSettingsPage.style.display = "block";
});

// Open Delete Account page when "Delete My Account" (inside Settings) is clicked
// Scoped to .delete-card so it doesn't clash with the confirm button on the delete page itself
const deleteAccountTrigger = settingsMain.querySelector(".delete-card .delete-account-btn");
deleteAccountTrigger.addEventListener("click", () => {
    pages.forEach((page) => (page.style.display = "none"));
    deleteAccountPage.style.display = "block";
});

// "Back" links on both sub-pages return to Settings
document
    .querySelectorAll(".notification-settings-main .back-link, .delete-account-main .back-link")
    .forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            pages.forEach((page) => (page.style.display = "none"));
            settingsMain.style.display = "block";
        });
    });

    
    //For the Ai assistance page
// This calls YOUR backend (server.js), never the AI API directly.
// Change this if your backend runs somewhere other than localhost:3001.
const CHAT_API_URL = 'http://localhost:3001/api/chat';

async function fetchAIResponse(text) {
  const response = await fetch(CHAT_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text }),
  });

  if (!response.ok) {
    throw new Error('Request failed');
  }

  const data = await response.json();
  return data.reply;
}

document.addEventListener('DOMContentLoaded', () => {
  const aiAssistantMain = document.querySelector('.ai-assistant-main');
  const chatMsg = document.querySelector('.chat-msg');
  const textInput = document.querySelector('.text-input');
  const sendBtn = document.querySelector('.send-btn');

  if (!aiAssistantMain || !chatMsg || !textInput || !sendBtn) return;

  function appendMessage(text, sender = 'user') {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.textContent = text;
    chatMsg.appendChild(bubble);
    chatMsg.scrollTop = chatMsg.scrollHeight;
    return bubble; // returned so we can update it later (loading -> reply)
  }

  function setSending(isSending) {
    sendBtn.disabled = isSending;
    textInput.disabled = isSending;
  }

  async function sendMessage() {
    const text = textInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    textInput.value = '';
    aiAssistantMain.classList.add('has-messages');
    setSending(true);

    const loadingBubble = appendMessage('Thinking…', 'ai');

    try {
      const reply = await fetchAIResponse(text);
      loadingBubble.textContent = reply;
    } catch (err) {
      console.error('Chat request failed:', err);
      loadingBubble.textContent =
        "Sorry, I couldn't reach the AI just now. Please try again.";
    } finally {
      setSending(false);
      chatMsg.scrollTop = chatMsg.scrollHeight;
      textInput.focus();
    }
  }

  sendBtn.addEventListener('click', sendMessage);

  textInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

  const attachBtn = document.querySelector('.attach-btn');
  const chatLabel = document.querySelector('.chat-label');
  if (attachBtn && chatLabel) {
    attachBtn.addEventListener('click', () => {
      chatLabel.classList.toggle('is-open');
    });
  }
});