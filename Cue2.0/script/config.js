let path = require('path');
let aliases = require('./alias');

//这个resolve的作用是生成一个全路径
let resolve = function (p) {
  // 传入的参数p长这样：web/entry-runtime-with-compiler.js

  // base === web/entry-runtime-with-compiler.js里的web
  let base = p.split('/')[0];

  // 判断aliases[web]是否存在
  if (aliases[base]) {
    //alias[web]:resolve('src/platforms/web')
    //即：C:\Users\ASUS\Desktop\Cue原理学习\Cue2.0\src\platforms\web

    // p.slice(base.length+1)
    //即：'web/entry-runtime-with-compiler.js'.slice('web'.length+1)
    //最后得到 ：entry-runtime-with-compiler.js

    // 结合aliases[base]，得到一个新路径：
    // C:\Users\ASUS\Desktop\Cue原理学习\Cue2.0\src\platforms\web\entry-runtime-with-compiler.js

    // 这个新路径就是'web-full-dev'的入口
    return path.resolve(aliases[base], p.slice(base.length + 1));
  } else {
    // 如果没有别名，
    //__dirname 即 C:\Users\ASUS\Desktop\Cue原理学习\Cue2.0\script
    // p 即 web/entry-runtime-with-compiler.js

    // path.resolve(__dirname, '../', p) 即 C:\Users\ASUS\Desktop\Cue原理学习\Cue2.0\web\entry-runtime-with-compiler.js
    return path.resolve(__dirname, '../', p);
  }
};

let builds = {
  //web端完整开发版
  'web-full-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/Cue.js'),
    format: 'umd',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner: 'no banner',
    name:'Cue'
  },
  // web端运行时开发版
  'web-runtime-dev': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/Cue.runtime.js'),
    format: 'umd',
    env: 'development',
    banner: 'no banner',
    name:'Cue' 
  },
};

function genConfig(name) {
  // 参数长这样：name === 'web-full-dev'
  // 输出的是web-full-dev的具体的rollup配置

  // genConfig()的作用是：根据name，拿到值builds['web-full-dev']的具体配置
  // 传键进来拿到值，也就是这个键的配置选项。根据配置选项构建一个具体的配置信息
  let opts = builds[name];
  let config = {
    input: opts.entry,
    output: {
      file: opts.dest,
      format: opts.format,
      name: opts.moduleName || 'Cue',
    },
  };

  return config;
}

function getAllBuilds() {
  // 遍历builds中所有的key，并用genConfig()处理,
  // genConfig()处理后返回的是一个数组，
  // 这个数组中保存了[config1,config2,……,config]

  return Object.keys(builds).map(genConfig);
}

module.exports = {
  getAllBuilds,
};
