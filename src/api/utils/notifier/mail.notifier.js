const nodemailer = require('nodemailer');
const logger = require('../../../config/logger');

/**
 * @class MailNotifier
 */
class MailNotifier {
  static async send(recipient, subject, htmlBody) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'molly.cruickshank31@ethereal.email',
        pass: 'zMZyUCyUrvjEbAjVMZ'
      }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Stackoverflow Clone 👻" <notify@stackoverflowclone.com>',
      to: recipient,
      subject: subject,
      html: htmlBody
    });

    logger.info(`Mail Notification sent`);

    // Preview only available when sending through an Ethereal account
    logger.info(
      `Notification Preview URL: ${nodemailer.getTestMessageUrl(info)} `
    );
  }
}
module.exports = MailNotifier;
