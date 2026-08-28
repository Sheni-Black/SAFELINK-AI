// ==========================================================
// SAFELINK AI - AUTHENTICATION JAVASCRIPT
// ==========================================================
//
// This file handles:
//
// 1. Sign up
// 2. Sign in
// 3. Forgot password
// 4. Email verification OTP
// 5. Password-reset OTP
// 6. Creating a new password
// 7. Switching between authentication containers
//
// The general validation rule is:
//
// VALID   -> green border, error message hidden
// INVALID -> red border + red error message, shown live as the
//            user types and cleared the moment the field becomes
//            valid
// EMPTY   -> neutral border, no error message (errors for empty
//            required fields only appear on submit)
//
// Buttons are disabled until the required information is valid.
// ==========================================================


// ==========================================================
// AUTHENTICATION CONTAINERS
// ==========================================================

const signupContainer = document.querySelector(".signup-container");
const signinContainer = document.querySelector(".signin-container");
const otpContainer = document.querySelector(".otp-container");
const otpSuccessful = document.querySelector(".otp-successful");
const forgotPasswordContainer = document.querySelector(".fpassword-container");
const checkEmailContainer = document.querySelector(".check-email-container");
const newPasswordContainer = document.querySelector(".npassword-container");


// Put all containers into one array.
// This makes it much easier to hide/show them.
const containers = [
    signupContainer,
    signinContainer,
    otpContainer,
    otpSuccessful,
    forgotPasswordContainer,
    checkEmailContainer,
    newPasswordContainer
];


// ==========================================================
// SHOW / HIDE AUTHENTICATION CONTAINERS
// ==========================================================

function hideAllContainers() {

    containers.forEach((container) => {

        if (container) {
            container.style.display = "none";
        }

    });
}


function showContainer(container) {

    hideAllContainers();

    if (container) {
        container.style.display = "block";
    }
}


// ==========================================================
// INITIAL PAGE
// ==========================================================

showContainer(signupContainer);


// ==========================================================
// NAVIGATION BETWEEN SIGN UP AND SIGN IN
// ==========================================================

const createText = document.querySelector(".create-text");
const loginText = document.querySelector(".login-text");


if (createText) {

    createText.addEventListener("click", () => {

        showContainer(signupContainer);

    });

}


if (loginText) {

    loginText.addEventListener("click", () => {

        showContainer(signinContainer);

    });

}


// ==========================================================
// FORM ELEMENTS
// ==========================================================

// -------------------------
// SIGN UP
// -------------------------

const signupForm = document.querySelector(".signup-form");

const fname = document.querySelector("#fname");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const cpassword = document.querySelector("#cpassword");

const fnameError = document.querySelector(".fnameEroor");
const emailError = document.querySelector(".emailError");
const passwordError = document.querySelector(".passwordError");

const terms = document.querySelector(".terms input");
const signupButton = document.querySelector(".signup-button");


// -------------------------
// SIGN IN
// -------------------------

const signinForm = document.querySelector(".signin-form");

const signinEmail = document.querySelector("#email1");
const signinPassword = document.querySelector("#password1");

const signinButton = document.querySelector(".signin-button");


// -------------------------
// FORGOT PASSWORD
// -------------------------

const forgotPasswordForm = document.querySelector(".fpassword-form");

const forgotEmail = document.querySelector("#email2");

const forgotPasswordButton = document.querySelector(".fpassword-button");


// -------------------------
// CREATE NEW PASSWORD
// -------------------------

const newPasswordForm = document.querySelector(".npassword-form");

const newPassword = document.querySelector("#password2");
const newConfirmPassword = document.querySelector("#cpassword2");

const newPasswordButton = document.querySelector(".npassword-button");


// ==========================================================
// ERROR MESSAGE HELPERS
// ==========================================================
//
// Your HTML already contains error elements for:
//
// fname
// email
// password
//
// For fields without an error element, we create one
// dynamically.


function createErrorElement(input) {

    let errorElement = input.nextElementSibling;

    // If an error element already exists, use it.
    if (
        errorElement &&
        errorElement.classList.contains("js-error")
    ) {
        return errorElement;
    }


    // Otherwise create one.
    errorElement = document.createElement("div");

    errorElement.classList.add("js-error");

    input.insertAdjacentElement(
        "afterend",
        errorElement
    );

    return errorElement;
}


// ==========================================================
// SET INPUT AS INVALID
// ==========================================================

function showInputError(input, message, errorElement = null) {

    // Red border
    input.style.borderColor = "red";

    // Add your existing class as well.
    input.classList.add("input-error");


    // Use supplied error element if one exists.
    // Otherwise create one.
    if (!errorElement) {

        errorElement = createErrorElement(input);

    }


    errorElement.textContent = message;

    // Make the error text red.
    errorElement.style.color = "red";

    // Make sure the error is visible.
    errorElement.style.display = "block";
}


// ==========================================================
// SET INPUT AS VALID
// ==========================================================
//
// The error message is cleared out (not just hidden) so it
// can never briefly flash stale text the next time an error
// is shown.
//

function showInputSuccess(input, errorElement = null) {

    // Green border
    input.style.borderColor = "green";

    // Remove the error class.
    input.classList.remove("input-error");


    if (!errorElement) {

        errorElement = input.nextElementSibling;

    }


    if (
        errorElement &&
        errorElement.classList.contains("js-error")
    ) {

        errorElement.textContent = "";

        errorElement.style.display = "none";

    }
}


// ==========================================================
// CLEAR INPUT STATE
// ==========================================================
//
// Used while a required field is still empty - no green,
// no red, no message yet. Errors for "this field is
// required" only show up on submit.
//

function clearInputState(input) {

    input.style.borderColor = "";

    input.classList.remove("input-error");

    const errorElement = input.nextElementSibling;

    if (
        errorElement &&
        errorElement.classList.contains("js-error")
    ) {

        errorElement.textContent = "";

        errorElement.style.display = "none";

    }
}


// ==========================================================
// LIVE FIELD VALIDATION
// ==========================================================
//
// Generic helper used by every "input" listener below.
//
// - value empty        -> neutral (clearInputState)
// - value invalid       -> red border + message, live
// - value valid          -> green border, message cleared
//
// This is what makes error text appear WHILE typing and
// disappear the instant the field satisfies validation,
// instead of only being checked on submit.
//

function validateFieldLive(input, errorElement, validatorFn, message, rawValue = null) {

    const value =
        rawValue !== null ? rawValue : input.value.trim();


    if (value === "") {

        clearInputState(input);

        return false;

    }


    if (!validatorFn(value)) {

        showInputError(input, message, errorElement);

        return false;

    }


    showInputSuccess(input, errorElement);

    return true;

}


// ==========================================================
// EMAIL VALIDATION
// ==========================================================

function isValidEmail(emailAddress) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(emailAddress);

}


// ==========================================================
// PASSWORD VALIDATION
// ==========================================================
//
// - At least 8 characters
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one number
//

function isValidPassword(passwordValue) {

    const hasMinimumLength =
        passwordValue.length >= 8;

    const hasUppercase =
        /[A-Z]/.test(passwordValue);

    const hasLowercase =
        /[a-z]/.test(passwordValue);

    const hasNumber =
        /[0-9]/.test(passwordValue);


    return (
        hasMinimumLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumber
    );

}


// ==========================================================
// SIGN UP VALIDATION (used on submit)
// ==========================================================

function validateSignupForm() {

    let isValid = true;


    // FULL NAME

    const nameValue = fname.value.trim();

    if (nameValue === "") {

        showInputError(fname, "Full name is required.", fnameError);
        isValid = false;

    } else if (nameValue.length < 5) {

        showInputError(fname, "Full name must be at least 5 characters.", fnameError);
        isValid = false;

    } else {

        showInputSuccess(fname, fnameError);

    }


    // EMAIL

    const emailValue = email.value.trim();

    if (emailValue === "") {

        showInputError(email, "Email is required.", emailError);
        isValid = false;

    } else if (!isValidEmail(emailValue)) {

        showInputError(email, "Please enter a valid email address.", emailError);
        isValid = false;

    } else {

        showInputSuccess(email, emailError);

    }


    // PASSWORD

    if (password.value === "") {

        showInputError(password, "Password is required.", passwordError);
        isValid = false;

    } else if (!isValidPassword(password.value)) {

        showInputError(
            password,
            "Password must be at least 8 characters and contain uppercase, lowercase and a number.",
            passwordError
        );
        isValid = false;

    } else {

        showInputSuccess(password, passwordError);

    }


    // CONFIRM PASSWORD

    const confirmError = createErrorElement(cpassword);

    if (cpassword.value === "") {

        showInputError(cpassword, "Please confirm your password.", confirmError);
        isValid = false;

    } else if (cpassword.value !== password.value) {

        showInputError(cpassword, "Passwords do not match.", confirmError);
        isValid = false;

    } else {

        showInputSuccess(cpassword, confirmError);

    }


    // TERMS AND CONDITIONS

    if (!terms.checked) {

        terms.classList.add("input-error");
        isValid = false;

    } else {

        terms.classList.remove("input-error");

    }


    return isValid;

}


// ==========================================================
// UPDATE SIGNUP BUTTON
// ==========================================================

function updateSignupButton() {

    if (!signupButton) return;


    const nameValid = fname.value.trim().length >= 5;
    const emailValid = isValidEmail(email.value.trim());
    const passwordValid = isValidPassword(password.value);
    const confirmValid =
        cpassword.value !== "" && cpassword.value === password.value;
    const termsValid = terms.checked;


    signupButton.disabled = !(
        nameValid &&
        emailValid &&
        passwordValid &&
        confirmValid &&
        termsValid
    );

}


if (signupForm) {

    signupForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const isValid = validateSignupForm();

        if (!isValid) {

            updateSignupButton();
            return;

        }

        console.log("Sign-up form is valid.");

        const formData = {
            name: fname.value.trim(),
            email: email.value.trim(),
            password: password.value
        };

        console.log(formData);

        // For now, move to email verification.
        showContainer(otpContainer);

    });

}


// ==========================================================
// REAL-TIME SIGNUP VALIDATION
// ==========================================================
//
// Error text now shows live while the field is invalid and
// clears the moment the field becomes valid.
//

[fname, email, password, cpassword].forEach((input) => {

    if (!input) return;

    input.addEventListener("input", () => {

        if (input === fname) {

            validateFieldLive(
                fname,
                fnameError,
                (value) => value.length >= 5,
                "Full name must be at least 5 characters."
            );

        }


        if (input === email) {

            validateFieldLive(
                email,
                emailError,
                isValidEmail,
                "Please enter a valid email address."
            );

        }


        if (input === password) {

            validateFieldLive(
                password,
                passwordError,
                isValidPassword,
                "Password must be at least 8 characters and contain uppercase, lowercase and a number."
            );

            // Confirm-password depends on password, so re-check
            // it live too whenever password changes.
            if (cpassword.value !== "") {

                const confirmError = createErrorElement(cpassword);

                validateFieldLive(
                    cpassword,
                    confirmError,
                    (value) => value === password.value,
                    "Passwords do not match.",
                    cpassword.value
                );

            }

        }


        if (input === cpassword) {

            const confirmError = createErrorElement(cpassword);

            validateFieldLive(
                cpassword,
                confirmError,
                (value) => value === password.value,
                "Passwords do not match.",
                cpassword.value
            );

        }


        updateSignupButton();

    });

});


if (terms) {

    terms.addEventListener("change", () => {

        updateSignupButton();

    });

}


// Make sure the button starts disabled.
updateSignupButton();


// ==========================================================
// SIGN IN VALIDATION (used on submit)
// ==========================================================

function validateSigninForm() {

    let isValid = true;

    if (signinEmail.value.trim() === "") {

        showInputError(signinEmail, "Email is required.");
        isValid = false;

    } else if (!isValidEmail(signinEmail.value.trim())) {

        showInputError(signinEmail, "Please enter a valid email address.");
        isValid = false;

    } else {

        showInputSuccess(signinEmail);

    }


    if (signinPassword.value === "") {

        showInputError(signinPassword, "Password is required.");
        isValid = false;

    } else if (signinPassword.value.length < 8) {

        showInputError(signinPassword, "Password must be at least 8 characters.");
        isValid = false;

    } else {

        showInputSuccess(signinPassword);

    }


    return isValid;

}


// ==========================================================
// SIGN IN BUTTON STATE
// ==========================================================

function updateSigninButton() {

    if (!signinButton) return;

    const emailValid = isValidEmail(signinEmail.value.trim());
    const passwordValid = signinPassword.value.length >= 8;

    signinButton.disabled = !(emailValid && passwordValid);

}


[signinEmail, signinPassword].forEach((input) => {

    if (!input) return;

    input.addEventListener("input", () => {

        if (input === signinEmail) {

            validateFieldLive(
                signinEmail,
                null,
                isValidEmail,
                "Please enter a valid email address."
            );

        }


        if (input === signinPassword) {

            validateFieldLive(
                signinPassword,
                null,
                (value) => value.length >= 8,
                "Password must be at least 8 characters."
            );

        }


        updateSigninButton();

    });

});


if (signinForm) {

    signinForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const isValid = validateSigninForm();

        if (!isValid) {

            updateSigninButton();
            return;

        }

        console.log("Sign-in form is valid.");

        // Later, send login information to your backend here.

    });

}


updateSigninButton();


// ==========================================================
// FORGOT PASSWORD
// ==========================================================

function updateForgotPasswordButton() {

    if (!forgotPasswordButton) return;

    forgotPasswordButton.disabled =
        !isValidEmail(forgotEmail.value.trim());

}


if (forgotEmail) {

    forgotEmail.addEventListener("input", () => {

        validateFieldLive(
            forgotEmail,
            null,
            isValidEmail,
            "Please enter a valid email address."
        );

        updateForgotPasswordButton();

    });

}


if (forgotPasswordForm) {

    forgotPasswordForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const emailValue = forgotEmail.value.trim();

        if (emailValue === "") {

            showInputError(forgotEmail, "Email is required.");
            return;

        }

        if (!isValidEmail(emailValue)) {

            showInputError(forgotEmail, "Please enter a valid email address.");
            return;

        }

        console.log("Forgot-password email is valid.");

        // Move to password-reset OTP.
        showContainer(checkEmailContainer);

    });

}


updateForgotPasswordButton();


// ==========================================================
// FORGOT PASSWORD NAVIGATION
// ==========================================================

const forgotPasswordLinks =
    document.querySelectorAll(".label-content a, .label-content1 a");


forgotPasswordLinks.forEach((link) => {

    link.addEventListener("click", (e) => {

        e.preventDefault();
        showContainer(forgotPasswordContainer);

    });

});


// ==========================================================
// CREATE NEW PASSWORD (used on submit)
// ==========================================================

function validateNewPasswordForm() {

    let isValid = true;

    if (newPassword.value === "") {

        showInputError(newPassword, "Password is required.");
        isValid = false;

    } else if (!isValidPassword(newPassword.value)) {

        showInputError(
            newPassword,
            "Password must be at least 8 characters and contain uppercase, lowercase and a number."
        );
        isValid = false;

    } else {

        showInputSuccess(newPassword);

    }


    if (newConfirmPassword.value === "") {

        showInputError(newConfirmPassword, "Please confirm your password.");
        isValid = false;

    } else if (newConfirmPassword.value !== newPassword.value) {

        showInputError(newConfirmPassword, "Passwords do not match.");
        isValid = false;

    } else {

        showInputSuccess(newConfirmPassword);

    }


    return isValid;

}


// ==========================================================
// NEW PASSWORD BUTTON
// ==========================================================

function updateNewPasswordButton() {

    if (!newPasswordButton) return;

    const passwordValid = isValidPassword(newPassword.value);
    const confirmValid =
        newConfirmPassword.value !== "" &&
        newConfirmPassword.value === newPassword.value;

    newPasswordButton.disabled = !(passwordValid && confirmValid);

}


[newPassword, newConfirmPassword].forEach((input) => {

    if (!input) return;

    input.addEventListener("input", () => {

        if (input === newPassword) {

            validateFieldLive(
                newPassword,
                null,
                isValidPassword,
                "Password must be at least 8 characters and contain uppercase, lowercase and a number."
            );

            if (newConfirmPassword.value !== "") {

                validateFieldLive(
                    newConfirmPassword,
                    null,
                    (value) => value === newPassword.value,
                    "Passwords do not match.",
                    newConfirmPassword.value
                );

            }

        }


        if (input === newConfirmPassword) {

            validateFieldLive(
                newConfirmPassword,
                null,
                (value) => value === newPassword.value,
                "Passwords do not match.",
                newConfirmPassword.value
            );

        }


        updateNewPasswordButton();

    });

});


if (newPasswordForm) {

    newPasswordForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const isValid = validateNewPasswordForm();

        if (!isValid) {

            updateNewPasswordButton();
            return;

        }

        console.log("New password is valid.");

        // Later, send the new password to your backend.

        // Return to login after successful reset.
        showContainer(signinContainer);

    });

}


updateNewPasswordButton();


// ==========================================================
// OTP ELEMENTS
// ==========================================================

const otpInputs = document.querySelectorAll(".otp-input");
const otpInputs1 = document.querySelectorAll(".otp-input1");

const verifyButton = document.querySelector(".verify-button");
const checkEmailButton = document.querySelector(".check-email-button");


// ==========================================================
// GENERIC OTP VALIDATION
// ==========================================================

function getOtp(inputs) {

    return [...inputs]
        .map((input) => input.value.trim())
        .join("");

}


function isValidOtp(inputs) {

    const otp = getOtp(inputs);

    return otp.length === 6 && /^\d{6}$/.test(otp);

}


// ==========================================================
// UPDATE OTP BUTTON
// ==========================================================

function updateOtpButton(inputs, button) {

    if (!button) return;

    button.disabled = !isValidOtp(inputs);

}


updateOtpButton(otpInputs, verifyButton);
updateOtpButton(otpInputs1, checkEmailButton);


// ==========================================================
// OTP INPUT BEHAVIOR
// ==========================================================
//
// Digits auto-advance to the next box; Backspace on an empty
// box moves back. The red error state clears live as soon as
// the user starts correcting the code, same as every other
// field.
//

function setupOtpInputs(inputs, button) {

    inputs.forEach((input, index) => {

        input.addEventListener("input", () => {

            // Only allow numbers.
            input.value = input.value.replace(/\D/g, "");

            // Clear error styling live as the user corrects it.
            input.style.borderColor = "";
            input.classList.remove("input-error");

            // Move to the next box.
            if (input.value && index < inputs.length - 1) {

                inputs[index + 1].focus();

            }

            updateOtpButton(inputs, button);

        });


        input.addEventListener("keydown", (e) => {

            if (
                e.key === "Backspace" &&
                input.value === "" &&
                index > 0
            ) {

                inputs[index - 1].focus();

            }

        });

    });

}


setupOtpInputs(otpInputs, verifyButton);
setupOtpInputs(otpInputs1, checkEmailButton);


// ==========================================================
// ACCOUNT CREATION OTP
// ==========================================================

if (verifyButton) {

    verifyButton.addEventListener("click", (e) => {

        e.preventDefault();

        if (!isValidOtp(otpInputs)) {

            otpInputs.forEach((input) => {

                input.style.borderColor = "red";
                input.classList.add("input-error");

            });

            return;

        }

        const otp = getOtp(otpInputs);

        console.log("Account verification OTP:", otp);

        showContainer(otpSuccessful);

        setTimeout(() => {

            // Replace this later with your actual homepage URL.
            // window.location.href = "../index.html";

        }, 2000);

    });

}


// ==========================================================
// PASSWORD RESET OTP
// ==========================================================

if (checkEmailButton) {

    checkEmailButton.addEventListener("click", (e) => {

        e.preventDefault();

        if (!isValidOtp(otpInputs1)) {

            otpInputs1.forEach((input) => {

                input.style.borderColor = "red";
                input.classList.add("input-error");

            });

            return;

        }

        const otp = getOtp(otpInputs1);

        console.log("Password-reset OTP:", otp);

        showContainer(newPasswordContainer);

    });

}


// ==========================================================
// RESEND CODE
// ==========================================================

const resendText = document.querySelector(".resend-text");
const resendText1 = document.querySelector(".resend-text1");


if (resendText) {

    resendText.addEventListener("click", () => {

        console.log("Request to resend account verification code.");

    });

}


if (resendText1) {

    resendText1.addEventListener("click", () => {

        console.log("Request to resend password-reset code.");

    });

}
