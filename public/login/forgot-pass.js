//Forgot password functions ------------------------------------------------
const forgotPassEmail = document.getElementById("forgot-pass-email");
const resetPasswordBtn = document.getElementById("reset-password");

resetPasswordBtn?.addEventListener("click", () => {
    if (forgotPassEmail.value.trim() == "") {
        showToast("Missing Information", "You must enter a valid email address before you can reset your password.", STATUS_COLOR.RED, true, 8);
        return;
    }

    sendPasswordResetEmail(auth, forgotPassEmail.value.trim()).then(() => {
        showToast("Email Sent", "If your account exists, you should be receiving an email to reset your password.", STATUS_COLOR.GREEN, false);
    }).catch((error) => {
        console.log(error.code + ": " + error.message);
        showToast("Error Sending Email", "There was an error sending an email to your address. Please try again.", STATUS_COLOR.RED, true, 8);
    });
});