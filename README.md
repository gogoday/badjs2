![](assets/badjs_logo.png)



BadJS 是 web 前端脚本错误监控及跟踪解决方案。此项目为鹅厂 imweb&ivweb（qq群:179045421, 471082939） 团队的开源项目。  
   
##介绍      
1 一站式体系化解决方案：业务只需要简单的配置，引入上报文件，即可实现脚本错误上报，每日统计邮件跟踪方便。       
2 可视化查询系统，快速定位错误信息：web应用程序脚本数量庞大，开发人员在如此之多的脚本中定位某个问题变得困难。BadJS能够巧妙定位错误脚本代码，进行反馈。通过各种查询条件，快速找到详细错误日志。          
3 跨域、Script Error等棘手问题不再是难题：tryjs帮你发现一切。          
4 真实用户体验监控与分析：通过浏览器端真实用户行为与体验数据监控，为您提供JavaScript、AJAX请求错误诊断和页面加载深度分析帮助开发人员深入定位每一个问题细节。  即使没有用户投诉，依然能发现隐蔽bug，主动提升用户体验。             
5 用户行为分析：细粒度追踪真实的用户行为操作及流程，前端崩溃、加载缓慢及错误问题，可关联到后端进行深度诊断。         
6 产品质量的保障：浏览器百花齐放，用户环境复杂，巨大的差异导致开发人员难以重现用户遇到的问题。 无法像后台一样上报所有用户操作日志。通过BadJS，上报用户端脚本错误，为产品质量保驾护航。

##
* [install](#install)          
* [upgrade](#upgrade)                  
* [email](#email)                 
* [crontab](#crontab)                 


## installer

腾讯云安装： https://market.qcloud.com/products/3369          

badjs项目已经开源，如果已经有服务器也可以手动安装，可以参考如下链接进行： https://github.com/BetterJS/badjs-installer

## upgrade
```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/iv-web/track/master/upgrade/upgrade.sh?v=1)"
```

## email
首先需要有可以代理发邮件的邮件服务器，建议使用qq邮箱, 获取响应的配置信息((帮助)[http://service.mail.qq.com/cgi-bin/help?subtype=1&&no=166&&id=28])
## 配置
#### 1 进入badjs-web文件夹
`$cd /data/badjs20/badjs/badjs-web/

#### 2 修改篇日志文件 project.json
修改 enable, from, smtp, smtpUser, smtpPassword 字段为正确的值
```
    "email": {
        "enable": false,
        "homepage": "http://badjs.com/index.html",
        "from": "noreply-badjs@demo.com",
        "emailSuffix" : "@demo.com",
        "smtp": "smtp.demo.com",
        "smtpUser": "username",
        "smtpPassword": "password",
        "time": "09:00:00",
        "top": 20,
        "module": "email"
    },

```
#### 3 重启badjs-web服务
`forever start /data/badjs20/badjs/badjs-web/app.js`


## crontab
开启定时任务 统计pv 发送评分日报邮件
编辑定时任务脚本
`$crontab -e `

添加一下定时任务

```
6 0 0 * * * bash /data/badjs20/badjs/badjs-web/service/nginx_log.sh
0 3 * * * bash /data/badjs20/badjs/badjs-web/service/get_pv.sh

# create b_quality table
30 3 * * * /data/home/server/nodejs/bin/node /data/badjs20/badjs/badjs-web/service/handle-quality.js
# send mail
0 4 * * * /data/home/server/nodejs/bin/node /data/badjs20/badjs/badjs-web/service/ScoreMail.js
```

保存后生效



