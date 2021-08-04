const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'demoacount1607@gmail.com',
    pass: 'bksweggmsmzseadh',
  },
});

const sendMail = (userEmail, resetPasswordToken, res) => {
  const mailOptions = {
    from: 'demoacount1607@gmail.com',
    to: userEmail,
    subject: 'Password reset link',
    html: `<h1>Password reset link</h1><p>Link will expire in 10 minutes. To reset you password <a href="http://localhost:5000/user/reset-password/${resetPasswordToken}">Click here</a></p>`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        success: false,
        error: 'Something went wrong. Please try again.',
      });
    }
    return res.json({
      success: true,
      message:
        'Password change request successful. Please check your mail and follow further steps.',
    });
  });
};

module.exports = sendMail;
