const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "addyjessica6@gmail.com",
        pass: "rysymrfjsjrhkufg",
    },
});

const sendVerificationEmail = async (email, veriificationCode) => {
    const mailOptions = {
        from: "addyjessica6@gmail.com",
        to: email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking the following ${veriificationCode}`,
        html: `<p>Please verify your email by clicking <br/> <h2>${veriificationCode}</h2></p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error(err);
        else console.log('Verification email sent: ' + info.response);
    });
};

module.exports = { sendVerificationEmail };
