let rollup = require('rollup')
let fs = require('fs')

let builds = require('./config.js').getAllBuilds();
// 经过getAllBuilds处理后，builds是一个数组，
// 这个数组中保存了[config1,config2,……,config]

// console.log(builds);
//
// [
//   {
//     input:
//       'C:\\Users\\ASUS\\Desktop\\Vue原理学习\\Cue2.0\\src\\platforms\\web\\entry-runtime-with-compiler.js',
//     output: {
//       file: undefined,
//       format: 'umd',
//       banner: 'no banner',
//       name: 'Cue',
//     },
//   }
// ];

// 前面做的所有事，都是为了生成上面这个配置信息构成的数组，
// 然后build(),利用rollrup根据这些具体的配置信息，打包生成不同环境下的代码。
build(builds);

//build的作用：对传进来的数组builds进行处理
function build(builds) {
  let needBuildIndex = 0; //表示已经构建的
  let total = builds.length; //

  function next() {
    buildEntry(builds[needBuildIndex]).then(() => {
      needBuildIndex++;
      if (needBuildIndex < total) {
        next();
      }
    });
  }

  next();
}

function buildEntry (config) {
  // 传入的config长这样：
  // 
  // [
  //   {
  //     input:
  //       'C:\\Users\\ASUS\\Desktop\\Vue原理学习\\Cue2.0\\src\\platforms\\web\\entry-runtime-with-compiler.js',
  //     output: {
  //       file: 'C:\\Users\\ASUS\\Desktop\\Vue原理学习\\Cue2.0\\dist\\vue.js',
  //       format: 'umd',
  //       banner: 'no banner',
  //       name: 'Cue',
  //     },
  //   },
  //   {
  //     input:
  //       'C:\\Users\\ASUS\\Desktop\\Vue原理学习\\Cue2.0\\src\\platforms\\web\\entry-runtime.js',
  //     output: {
  //       file: 'C:\\Users\\ASUS\\Desktop\\Vue原理学习\\Cue2.0\\dist\\vue.runtime.js',
  //       format: 'umd',
  //       banner: 'no banner',
  //       name: 'Cue',
  //     },
  //   },
  // ];

  let output = config.output
  let { file, banner } = output
  return rollup.rollup(config).then((bundle) => {
    return bundle.generate(output);
    // return的这个bundle.generate(output)长这样：
    //     {
    //   output: [
    //     {
    //       code: 'no banner\n' +
    //         '(function (factory) {\n' +
    //         "\ttypeof define === 'function' && define.amd ? define(factory) :\n" +
    //         '\tfactory();\n' +
    //         "}(function () { 'use strict';\n" +
    //         '\n' +
    //         '\t/*\r\n' +
    //         '\t * @Description:\r\n' +
    //         '\t */\n' +
    //         '\n' +
    //         '}));\n',
    //       dynamicImports: [],
    //       exports: [],
    //       facadeModuleId: 'C:\\Users\\ASUS\\Desktop\\Vue原理学习\\Cue2.0\\src\\platforms\\web\\entry-runtime-with-compiler.js',
    //       fileName: 'vue.js',
    //       imports: [],
    //       isDynamicEntry: false,
    //       isEntry: true,
    //       map: null,
    //       modules: [Object: null prototype],
    //       name: [Getter]
    //     }
    //   ]
    // }
    // {
    //   output: [
    //     {
    //       code: 'no banner\n' +
    //         '(function (factory) {\n' +
    //         "\ttypeof define === 'function' && define.amd ? define(factory) :\n" +
    //         '\tfactory();\n' +
    //         "}(function () { 'use strict';\n" +
    //         '\n' +
    //         "\tconsole.log('我是entry-runtime中的代码');\n" +
    //         '\n' +
    //         '}));\n',
    //       dynamicImports: [],
    //       exports: [],
    //       facadeModuleId: 'C:\\Users\\ASUS\\Desktop\\Vue原理学习\\Cue2.0\\src\\platforms\\web\\entry-runtime.js',
    //       fileName: 'vue.runtime.js',
    //       imports: [],
    //       isDynamicEntry: false,
    //       isEntry: true,
    //       map: null,
    //       modules: [Object: null prototype],
    //       name: [Getter]
    //     }
    //   ]
    // }
  }).then(({ output: [{ code }] }) => {
    //这里的参数是解构赋值的写法，获得了output和code，
     
    // 获得code，然后写入到某个文件中去
    return write(file, code);
  }).catch(err => {
    console.log('打包出错');
  })
}

function write (destination, code) {
  return new Promise((resolve, reject) => {
    // 打包的入口文件是：entry-runtime-with-compiler.js
    // 根据配置，出口文件是dest：绝对路径/dist/vue.js

    function report (destination) {
      //作用：报告打包成功，和，resolve()
      console.log(`打包成功至：${destination}`);
      resolve() 
    }

    fs.writeFile(destination, code, (err) => {
      if (err) {
         return reject(err)
      } else {
        report(destination)
      } 
    });
  })
}
