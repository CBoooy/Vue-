import vnode from './vnode.js'


export default function h (selector, data, params) {
  
  // 对h()的第三个参数做判断

  // 写法一：h('div',{},'我是div的内容')
  if (typeof params === 'string') {
    let vnode1 = vnode(selector, data, undefined,params, undefined) 
    return vnode1
  } else if(Array.isArray(params)) {
    // 写法二：h('ul',{},[
    //     h('li', {}, 'li1'),
    //     h('li', {}, 'li1'),
    // ])

    // 如果是数组，就遍历数组，放到children中，
    
    let children = []

    for (let item of params) {
      children.push(item)
    } 

    return vnode(selector,data,children,undefined,undefined)
  }

}
