The error message "Invalid login: 534-5.7.9 Application-specific password required" indicates that you need to use an application-specific password for your Gmail account. This is a security measure by Google to allow third-party applications to access your Gmail account.

Here are the steps to generate an application-specific password for your Gmail account:

1) Enable 2-Step Verification:
    Go to your Google Account.
    Select "Security" from the left navigation panel.
    Under "Signing in to Google," select "2-Step Verification" and follow the on-screen instructions to enable it.
2) Generate an App Password:
    After enabling 2-Step Verification, go back to the "Security" section.
    Under "Signing in to Google," select "App passwords."
    You might need to sign in again.
    At the bottom, choose "Select app" and choose the app you’re using (e.g., "Mail").
    Choose "Select device" and choose the device you’re using (e.g., "Windows Computer").
    Select "Generate."
    You’ll see a 16-character code. This is your app password.
3) Use the App Password in Your Code:
    Replace your current Gmail password with the generated app password in your emailAuth object.