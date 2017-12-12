var crypto = require('crypto');

console.log(crypto.createHash("md5").update("root@avweb").digest('hex'));
