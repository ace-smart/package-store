const nodemailer = require("nodemailer")
const account = {
  user: process.env.API_EMAIL_USER,
  pass: process.env.API_EMAIL_PASS
}

let transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {...account},
})

module.exports = {
  sendEmail: async (toEmails = new Array(), {subject, htmlBody} = {}) => {
    if (!(toEmails instanceof Array)) {
      throw new TypeError('toEmails mus be an array.')
    } else if (toEmails.length < 1) {
      throw new TypeError('toEmails must include at least 1 element')
    }

    try {
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: account.user, // sender address
        to: [...toEmails], // list of receivers
        subject: subject, // Subject line
        html: htmlBody, // html body
      })

      return info
    } catch (error) {
      throw new Error(error)
    }
  },
}
