
'use strict';
const path = require('path')
const nodemailer = require('nodemailer');
const Promise = require('bluebird')
const log4js = require('log4js');
const logger = log4js.getLogger();
global.pjconfig = require(path.join(__dirname, '../project.json'))

const emailConf = global.pjconfig.email;



// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: emailConf.smtp, //'qq',  
  auth: {  
    user: emailConf.ivwebMailuser,  
    pass: emailConf.ivwebMailpass
  }  
});

// setup e-mail data with unicode symbols
let mailOptions = {
    from: emailConf.from //'"IVWEB" 2580575484@qq.com', // sender address
};

let mailList = [];

module.exports = (from, to, cc, title, content, attachments) => {

    let  _mailOptions = Object.assign({}, mailOptions);

    _mailOptions.to = to;
    _mailOptions.cc = cc;
    _mailOptions.subject = title;
    _mailOptions.html = content;

    if (attachments) {
        _mailOptions.attachments = attachments;
    }


    console.log(_mailOptions);

    // 第一次进来开始倒计时，后面进来的不走这个逻辑
    if (mailList.length == 0) {
        timeoutSendMail();
    }

    //sendMail(_mailOptions);
    // 先放到池子中，再每隔一段时间发送，避免触发频率限制，疑似垃圾邮件
    mailList.push(_mailOptions);

    // console.log('mailList');
    // console.log(mailList)

}


function timeoutSendMail() {

    let mailTimmer = setInterval(() => {

        console.log(`mailList.length: ${mailList.length}`)


        if (mailList.length <= 0 ) {
            clearInterval(mailTimmer);
            return;
        }

        let mailItemOp = mailList.shift();
        sendMail(mailItemOp);

    }, 110 * 1000)
}

function sendMail(maildata) {


  console.log('send email ....')
      console.log(maildata);
  return new Promise((resolve, reject) => {
      // send mail with defined transport object
      transporter.sendMail(maildata, function(error, info){
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
