(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Cue = factory());
}(this, function () { 'use strict';

  function initMixin (Cue) {
    
    //这个_init()的作用是：
    Cue.prototype._init = function (options) {
      
      // vm即app
      let vm = this;
      if (options && options._isComponent) ; else {

        vm.$options = options;
      }

      // 如果app上存在el属性，
      if (vm.$options.el) {
        // 调用vm.$mount()，
        // vm.$mount的作用是：
        vm.$mount(vm.$options.el);
      }
    };
  }

  class Watcher{

    constructor(vm, expOrFn, callback, options, isRenderWatcher) {
      expOrFn();
    }
  }

  function noop (a, b, c) { }

  function lifecycleMinxin (Cue) {
    Cue.prototype._update = function (vnode,hydrating) {
      console.log('Cue.prototype._update');
      console.log('vnode',vnode);
    };
  }


  function mountComponent (vm, el, hydrating) {
    //将el挂载到vm.$el属性上
    vm.$el = el;

    //如果render函数不存在
    if (!vm.$options.render) ;

   
    //
    function updateComponent () {
      vm._update(vm._render(),hydrating);
    }

    new Watcher(vm, updateComponent, noop, {}, true);
    
    return vm
  }

  function renderMixin (Cue) {
    
    //传入Cue实例，并在实例上挂载_render方法
    Cue.prototype._render = function () {
      let vm = this;
      let {render} = vm.$options;
      
      let vnode;
      
      vnode = render.call(vm._renderProxy,vm.$createElement);

      return vnode
    };
  }

  function Cue (options) {

    //
    this._init(options);
    
  }

  initMixin(Cue);//往Cue.prototype上挂载_init()

  lifecycleMinxin(Cue);

  renderMixin(Cue);

  //定义公共的的$mount方法，在entry-runtime-with-compiler中被重写
  // 这个原初$mount方法干了啥事儿？
  Cue.prototype.$mount = function (el, hydrating) {
    //调用$mount会返回mountComponent()的执行结果
    return mountComponent(this,el,hydrating)
  };

  function query (el) {
  //   el的两种写法：
  //   1 选择器：#app
  //   2 DOM元素：document.querySelector('#app')
    
    //1 #app
    if (typeof el === 'sting') {
      let selectedElement = document.querySelector(el);

      // 如果没有找到这个元素
      if (!selectedElement) {
        // 则，返回一个空的div元素
        return document.createElement('div')  
      }
      
      return selectedElement
    }else {
      // 2 document.querySelector('#app')

      return el
    }
  }

  //先保存原型上的$mount方法，再重写这个方法。
  let mount = Cue.prototype.$mount;
  //这个$mount的作用是：获得将Cue挂载在哪个元素上的那个元素
  Cue.prototype.$mount = function (el) {
    //el存在，才走query()方法
    // 此时el中保存的是需要挂载的那个DOM元素。
    el = el && query(el);

    let options = this.$options;

    //如果options里面没有写render()函数,才考虑el，或，template，
    if (!options.render) {
      // 拿到template的值
      let template = options.template;
      // 如果template存在，就要从template的三种写法中，解析出template所代表的html字符串

      if (template) {
        // 第一种写法：写在
        // <div id='#app'>
        //   <template id='temp1'>
        //     <h2>我是模板1</h2>
        //   </template>
        // </div>
        // <script>
        //   let app = new Cue({
        //     template:'#temp1'
        //   })
        // </script>
        //
        // 第二种写法：写在
        // <script type='x-template' id='temp2'>
        //   <h3>我是模板2</h3>
        // </script>
        // <script>
        //   let app = new Cue({
        //     template:'#temp2'
        //   })
        // </script>
        if (typeof template === 'string') {
          if (template.charAt[0] === '#') ;
        } else if (template.nodeType) {
          // 第三种写法：
          // <script>
          //   let app = new Cue({
          //     template:'<h2>我是模板3</h2>
          //   })
          // </script>
          template = template.innerHTML;
        } else {
          // 最后，如果template的写法都不是前三种，则报错传入一个无效template模板，并返回实例Cue

          return this;
        }
      } else if (el) {
        //如果render()不存在，template不存在但el存在，就调用getOuterHTML()获取el对象的html字符串

        template = getOuterHTML(el);
      }
      // 上面这整个if做的事，一句话就是：获取template模板html字符串

      // 得到template的内容后，根据template字符串生成为render函数
      if (template) {
        function render() {
          return "这是render函数的返回值，"
        }

        // 然后将render函数挂载到options.render上
        options.render = render;
      }
    }

    // 返回原初mount的执行结果
    return mount.call(this, el, 'hydrating'); 
  };

  return Cue;

}));
