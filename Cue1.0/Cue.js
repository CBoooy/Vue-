// 数组响应式
// 1 替换数组原型中的七个方法
// let originArrayProto = Array.prototype
let cueArrayProto = Object.create(Array.prototype);
let methodsArray = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice',
];
methodsArray.forEach((method) => {
  //cueArrayProto[push], 对push方法做覆盖。
  cueArrayProto[method] = function () {
    //原始的push方法的行为：
    Array.prototype[method].apply(this, arguments);

    //通知更新,即：当使用data.counters.push后，counters的值就会变化，
    // 但，这个counters是一个数组，没有做响应式处理，

    console.log(`数组执行：${method}`);
  };
});

function defineReactive(obj, key, val) {
  //val传入一个对象，就需要递归处理
  observe(val);

  // 每执行一次defineReactive就产生这个key一一对应的Dep
  let dep = new Dep();

  Object.defineProperty(obj, key, {
    get() {
      Dep.target && dep.addDep(Dep.target);
      return val;
    },
    set(newVal) {
      if (val !== newVal) {
        observe(newVal);
        val = newVal;

        // 如果这个key发生了变化，就用dep通知所有的watcher更新
        dep.notify();
      }
    },
  });
}

//对象响应式处理
function observe(obj) {
  //判断：传入的obj，必须是个对象。
  if (typeof obj !== 'object' || obj === null) return;
 
    new Observer(obj);
  
}
 
class Cue {
  constructor(options) {
    //保存输入的参数选项到实例的$options,$data上
    this.$options = options;
    this.$data = options.data;

    //对data做响应式处理
    observe(this.$data);

    //将this.$data代理到this上，也就是：访问app.counter的时候，返回的实际是app.$data.counter的值
    proxy(this);

    // 模板编译
    new Compile('#app', this);
  }
}

function proxy(vm) {
  //接受一个vm实例，因为要将app.$data代理到app上。
  //对vm.$data的所有key做一次代理。功能就是做一个简单的请求转发。
  //将$data中的key代理到Cue的实例上。
  Object.keys(vm.$data).forEach((key) => {
    //当我访问app.counter的时候，调用getter，返回app.$data.counter
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key];
      },
      set(newV) {
        vm.$data[key] = newV;
      },
    });
  });
}

// 每一个响应式对象，就伴生一个Observer实例。
class Observer {
  // 接收一个参数，这个参数是需要被做响应式处理的对象。可以是object，array
  constructor(value) {
    this.value = value;

    // 判断value是object还是array。因为对于两者的响应式处理不一样。
    // 这里应该有一个判断的，
    /**
     * if(isArray){}
     * else(isObject){walk(obj)}
     */

    if (Array.isArray(value)) {
      this.arrayWalk(value)
    } else {
      this.objectWalk(value);
    }
    
  }

  objectWalk(obj) {
    Object.keys(obj).forEach((key) => {
      //遍历obj的keys，对每个key做响应式处理
      defineReactive(obj, key, obj[key]);
    });
  }
  arrayWalk (arr) {
    //如果是一个数组，则对这个数组做响应式

    //覆盖原型
    Object.setPrototypeOf(arr, cueArrayProto);

    // 对数组内部所有元素做响应式
 
    for (let [index, value] of arr.entries()) {
      defineReactive(arr,index,value)
    }
  }

}

//new Compile(element,vm)
class Compile {
  constructor(el, vm) {
    //el是一个选择器，vm是Cue的实例
    this.$vm = vm;
    this.$el = document.querySelector(el);

    //编译模板
    if (this.$el) {
      //如果这个元素，或者这个模板存在，就对其进行编译。
      this.compile(this.$el);
    }
  }

  compile(el) {
    //接受一个节点作为参数，并对这个节点进行递归遍历
    // 判断其类型：元素类型？文本类型？

    //我要的这个节点的所有类型的子节点。因此不能用children，而只能用childNodes
    el.childNodes.forEach((node) => {
      //遍历节点，并判断其类型
      if (this.isElement(node)) {
        // 如果是元素节点,则编译这个元素节点
        this.compileElement(node);
      } else if (this.isInterpolation(node)) {
        //如果是文本节点,且是插值表达式,则编译插值表达式
        this.compileText(node);
      }

      if (node.childNodes) {
        //如果当前这个子元素有子元素,那就要对其进行递归遍历
        this.compile(node);
      }
    });
  }

  //判断是否是元素
  isElement(node) {
    return node.nodeType === 1;
  }
  // 判断是否是插值表达式{{xxx}}
  isInterpolation(node) {
    // 得是个文本，且，是长成这样的文本：{{}}，测试一下{{}}中的内容是否符合正则
    // reg = /\{\{(.*)\}\}/ , 做了一次分组,因为等会要拿出{{(.*)}}中间的内容
    // 通过RegExp.$1就可以取到分组的值,然后通过this[RegExp.$1],就可以拿到counter的值,然后做替换
    return node.nodeType === 3 && /\{\{(.*)\}\}/g.test(node.textContent);
  }
  compileText(node) {
    //首先,获取匹配的分组的值,{{(.*)}},这个值可以作为属性名,去访问data中的值.
    //由于已经对this.$data中的值做过代理,因此,可以通过app.counter访问到app.$data.counter
    //而通过this.$vm可以访问到app,因此,this.$vm[counter] 就等于this.$vm.$data[counter]

    //想要在数据发生变化时候离不开两个东西：node，data[counter]
    // 可以像之前那样直接设置：node.textContent = this.$vm[RegExp.$1]
    // 但这里通过this.update多加了一层封装，
    this.update(node, RegExp.$1, 'text');
  }

  compileElement(node) {
    //获取节点的属性
    let nodeAttrs = node.attributes;

    //这是个类数组对象,因此要转换成真正的数组,然后遍历其中的每个属性
    Array.from(nodeAttrs).forEach((attr) => {
      //<p v-text='aaa'></p>
      let attrName = attr.nodeName; //匹配出来的是c-xxx
      let attrValue = attr.nodeValue; //匹配出来的是aaa

      //判断这个属性是否为v-text这种指令
      if (this.isDirective(attrName)) {
        //如果是指令型属性,则,截取出c-xxx后面的xxx,然后使用不同的指令处理函数处理这个指令
        let directive = attrName.split('-')[1];
        //如果这个指令处理方法存在,则,调用,参数为:要操作的节点,指令的值
        this[directive] && this[directive](node, attrValue);
      }

      //判断是否为@click = 'clickHandle'
      if (this.isEvent(attrName)) {
        let eventName = attrName.substring(1); //从@click中截出click
        let eventFnName = attrValue;

        // 截出click后，尝试在当前node上监听click

        // node.addEventListener(eventName,eventHandler)
        // 为什么这里不能这样写？因为这里的clickHandle只是一个函数名，
        // 具体的函数，要从app.methods里面去拿到
        // 因此，还得封装一个函数出来

        this.eventHandler(node, eventName, eventFnName);
      }
    });
  }

  isDirective(node) {
    //如果这个属性名是以"c-"开头,则返回true
    return node.startsWith('c-');
  }

  isEvent(attrName) {
    return attrName.indexOf('@') === 0;
  }

  eventHandler (node, eventName, eventFnName) {
    let fn = this.$vm.$options.methods && this.$vm.$options.methods[eventFnName]

    // node.addEventListener(eventName,fn)
    // 为什么不能直接这样写？因为这个fn是一个函数引用，这个fn中可能会用到this，
    // 因此，要把this绑定到当前组件实例上去,且用bind，因为要返回一个函数，而不是直接call调用
    node.addEventListener(eventName,fn.bind(this.$vm))
  }

  text(node, dataAttr) {
    this.update(node, dataAttr, 'text');

    // 如果不用update封装一层，就要在每一个动态绑定的地方都要这样写：
    // node.textContent = this.$vm[dataAttr];
    // new Watcher(this.$vm, dataAttr, function () {
    //   node.textContent = this.$vm[dataAttr];
    //   //即：node.textContent = app[counter]
    // });

    // html()中也要这样写：
    // html(){
    //   node.innerHTML = this.$vm[dataAttr]

    //   new Watcher(this.$vm, dataAttr, function () {
    //     node.innerHTML = this.$vm[dataAttr];
    //     //即：node.innerHTML = app[counter]
    //   });
    // }
  }
  html(node, dataAttr) {
    //注意:这里写的是innerHTML,而不是textContent,
    // 因为v-html的作用就是将值当作html来解析,而不是文本来解析

    this.update(node, dataAttr, 'html');
  }

  model (node, dataAttr) {
    // model要做两件事：完成value赋值 和 事件监听

    // 完成value赋值
    this.update(node, dataAttr, 'model')
    
    // 事件监听
    node.addEventListener('input', e => {
      //如果当前文本输入框发生input输入事件，则将输入的值，赋值给data中的数据即可
      this.$vm[dataAttr] = e.target.value
    })

  }

  modelUpdater (node, value) {
    // 给大多数表单元素赋值，就是给value赋值
    node.value = value
  }
  

  htmlUpdater(node, value) {
    node.innerHTML = value;
  }
  textUpdater(node, value) {
    // textUpdater(node, this.$vm[dataAttr]);
    // value = this.$vm[dataAttr]
    // 即：node.textContent = value = this.$vm[dataAttr] = app[counter]
    node.textContent = value;
  }

  update(node, dataAttr, dir) {
    // 第一件事：生成v-text的处理函数fn 即 this[dir + 'Updater'] 即 textUpdater
    let fn = this[dir + 'Updater'];
    // 然后，生成后立马调用，就完成了第一次编译模板时的初始化操作。
    fn && fn(node, this.$vm[dataAttr]);

    // 第二件事：用fn/textUpdater来生成watcher实例
    new Watcher(this.$vm, dataAttr, function (val) {
      fn && fn(node, val);
    });
  }
}
/**
 * 当执行流进入new Watcher,
 * 就会执行到Dep.target ; this.vm[this.key] ; 就会访问app[counter],就会执行counter的getter
 * 在counter的getter中会执行：Dep.target && dep.addDep(Dep.target)，
 * 将这个watcher纳入counter对应的Dep中去管理
 *
 * 因此，就完成了从模板编译-->创建watcher-->创建watcher的过程中就将watch收集
 *
 */

//Watcher类:界面中的一个依赖,对应一个watcher,用这个watcher来管理这个依赖
class Watcher {
  // this.vm保存的是实例对象app
  // this.key保存的是counter
  // this.updateFn保存的是当counter改变的时候调用的处理函数。如：textUpdater，htmlUpdater
  constructor(vm, key, updateFn) {
    this.vm = vm;
    this.key = key;
    this.updateFn = updateFn;

    // 每一次生成一个Watcher实例，就将这个实例放到Dep.target上。
    Dep.target = this;
    // 访问一次app[counter]，就会调用一次counter的getter，
    // getter中就会执行：Dep.target && dep.addDep(Dep.target);
    // 将当前的这个Dep.target（也就是当前的Watcher实例）存入counter对应的Dep中管理
    this.vm[this.key];
    // 执行流回来后，清空Dep.target静态属性
    Dep.target = null;
  }

  //这个更新函数最后由Dep调用
  update() {
    /**
     * updateFn中保存的是：
     * updateFn = function (val) {
          textUpdater && textUpdater(node, val);
        }

       textUpdater (node, value) {
          node.textContent = value;
        } 

     */

    //即：updateFn(data[conter])
    //即：textUpdater(node,data[counter])
    this.updateFn.call(this.vm, this.vm[this.key]);
  }
}

class Dep {
  constructor() {
    this.deps = [];
  }

  addDep(watcher) {
    // 每生成一个counter属性的的watcher实例，就会访问一次counter的getter，
    // 就会在getter中执行：Dep.target && dep.addDep(Dep.target)，将这个watcher放入counter的dep中。
    this.deps.push(watcher);
  }

  notify() {
    // 提供一个通知方法。当data中的counter被修改了，就会触发counter的setter，
    // 就会执行setter中的：dep.notify()
    // dep.notify()就会执行counter对应的dep中的所有watcher的update()
    // watcher的upadate()就会执行textUpdater，更新DOM

    this.deps.forEach((watcher) => {
      watcher.update();
    });
  }
}
