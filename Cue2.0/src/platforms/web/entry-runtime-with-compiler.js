import Cue from './runtime/index.js';
import { query } from './util/index.js';

//先保存原型上的$mount方法，再重写这个方法。
let mount = Cue.prototype.$mount
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
        if (template.charAt[0] === '#') {
          // 第一，第二种写法的template值，都是string，且是#开头，则当成一个选择器
          // 则：通过一个函数idToTemplate()来处理这种情况，获取最终template的值
        }
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
export default Cue;
