import h from './dom/h.js'
import patch from './dom/patch.js'

let vnode1 = h('h1', {}, '你好呀')  
let vnode2 = h('ul', {}, [
  h('li', {}, '11'),
  h('li', {}, '12'),
  h('li',{},'13')
]) 

//真实的DOM节点
let container = document.querySelector('#container') 

patch(container,vnode2)
