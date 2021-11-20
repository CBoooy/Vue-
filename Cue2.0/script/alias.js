let path = require('path');

let resolve = function (p) {
  // 结合当前alias.js文件路径，的上一层（即根路径），然后，结合实参p路径，
  // 最后返回一个文件的绝对路径
  // 输入 resolve('src/platforms/web')
  // 返回 C:\Users\ASUS\Desktop\Cue原理学习\Cue2.0\src\platforms\web

  return path.resolve(__dirname, '../', p);
};

module.exports = {
  web: resolve('src/platforms/web'),
};

console.log(resolve('src/platforms/web'));
