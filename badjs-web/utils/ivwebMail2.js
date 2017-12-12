
'use strict';
const nodemailer = require('nodemailer');
const Promise = require('bluebird')
const log4js = require('log4js');
const logger = log4js.getLogger();



// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com',
  port: 465,
  secure: true,
  auth: {  
    user: 'ivweb@ivweb.club',  
    pass: '' 
  }  
});

// setup e-mail data with unicode symbols
let mailOptions = {
    from: '"IVWEB" ivweb@ivweb.club', // sender address
};

let mailList = [];

module.exports = (from, to, cc, title, content, attachments) => {

  mailOptions.to = to;
  mailOptions.cc = cc;
  mailOptions.subject = title;
  mailOptions.html = content;

  if (attachments) {
      mailOptions.attachments = attachments;
  }
  
 mailOptions.to = 'x@x.com';
 mailOptions.cc = 'x@x.com';

 console.log(mailOptions);

 // 第一次进来开始倒计时，后面进来的不走这个逻辑
 if (mailList.length == 0) {
      timeoutSendMail();
 }

 // 先放到池子中，再每隔一段时间发送，避免触发频率限制，疑似垃圾邮件
 mailList.push(mailOptions);


}

function timeoutSendMail() {
    let mailTimmer = setInterval(() => {

	    console.log(`mailList.length: ${mailList.length}`)


        if (mailList.length <= 0 ) {
	    clearInterval(mailTimmer);
	}

	let mailItemOp = mailList.shift();
	sendMail(mailItemOp);

    }, 1 * 60 * 1000)
}

function sendMail(mailOptions) {

  return new Promise((resolve, reject) => {
      // send mail with defined transport object
      transporter.sendMail(mailOptions, function(error, info){
          if(error){
              console.log(error);
              reject(error)
          } else {
            resolve(info)
           logger.info('Message sent: ' + info.response);
          }
      });

  })

}
