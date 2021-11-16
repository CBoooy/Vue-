/*
 * @Description:
 */

function defineReactive (obj, key, val) {
  //val传入一个对象，就需要递归处理
  observe(val)

  Object.defineProperty(obj, key, {
    get () {
      console.log('get:', val);
      return val
     },
    set (newVal) {
      if (val !== newVal) {
        console.log('set:', newVal);

        observe(newVal)
        val = newVal
      }
     }
  })
}

//对象响应式处理
function observe (obj) {
  //判断：传入的obj，必须是个对象。
  if (typeof obj !== 'object' || obj === null) return
  Object.keys(obj).forEach((key) => {
    //遍历obj的keys，对每个key做响应式处理
    defineReactive(obj,key,obj[key])
  })
}

function set (obj, key, value) {
  // 用来对新增的属性做响应式处理
  //只能通过set函数来新增属性，如果直接data.newP则这个newP没有响应式功能  
  defineReactive(obj,key,value)
}

//需要监控的对象，将其中的属性变成响应式
let data = { name: 'cboy', age: 22 , obj:{a:1} }
observe(data)

// data.newP = 'newPPP'
set(data, 'newP', 'newPPPPP333')
data.newP = 'newP4444'


