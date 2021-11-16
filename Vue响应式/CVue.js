/*
 * @Description:
 */

function defineReactive(obj, key, val) {
  //val传入一个对象，就需要递归处理
  observe(val);

  Object.defineProperty(obj, key, {
    get() {
      console.log('get:', val);
      return val;
    },
    set(newVal) {
      if (val !== newVal) {
        console.log('set:', newVal);

        observe(newVal);
        val = newVal;
      }
    },
  });
}

//对象响应式处理
function observe(obj) {
  //判断：传入的obj，必须是个对象。
  if (typeof obj !== 'object' || obj === null) return;

  new Observer(obj)
}

function set(obj, key, value) {
  // 用来对新增的属性做响应式处理
  //只能通过set函数来新增属性，如果直接data.newP则这个newP没有响应式功能
  defineReactive(obj, key, value);
}

class CVue {
  constructor(options) {
    //保存输入的参数选项到实例的$options,$data上
    this.$options = options 
    this.$data = options.data

    //对data做响应式处理
    observe(this.$data)

    //将this.$data代理到this上，也就是：访问app.counter的时候，返回的实际是app.$data.counter的值
    proxy(this)
  }
}

function proxy (vm) {
  //接受一个vm实例，因为要将app.$data代理到app上。
  //对vm.$data的所有key做一次代理。功能就是做一个简单的请求转发。
  //将$data中的key代理到CVue的实例上。
  Object.keys(vm.$data).forEach(key => {

    //当我访问app.counter的时候，调用getter，返回app.$data.counter
    Object.defineProperty(vm, key, {
      get () {
        return vm.$data[key]
      },
      set (newV) {
        vm.$data[key] = newV
      }
    })
  })
}

// 每一个响应式对象，就伴生一个Observer实例。
class Observer {
  // 接收一个参数，这个参数是需要被做响应式处理的对象。可以是object，array
  constructor(value) {
    this.value = value
    
    // 判断value是object还是array。因为对于两者的响应式处理不一样。
    // 这里应该有一个判断的，
    /**
     * if(isArray){}
     * else(isObject){walk(obj)}
     */
      this.walk(value)
    
  }

  walk (obj) {
    Object.keys(obj).forEach((key) => {
      //遍历obj的keys，对每个key做响应式处理
      defineReactive(obj, key, obj[key]);
    });
  }
}

module.exports = CVue
