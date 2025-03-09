const sgMail = require('@sendgrid/mail');
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


// Current implementation use text as the email body, need to change to use template
const sendEmail = async ({ to, subject, templateId, dynamicTemplateData, attachments,text }) => {
  const msg = {
    to,
    from: 'thinminttechies@gmail.com', // Use the email address or domain you verified with SendGrid
    subject,
    text,
    //templateId: 'd-6c004f0cbb694488add70968a428b647',
    //dynamic_template_data: dynamicTemplateData,
    attachments,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

module.exports = {
  sendEmail,
};