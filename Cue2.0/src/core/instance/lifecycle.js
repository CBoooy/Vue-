import Watcher from '../observer/watcher.js'
import {noop} from '../util/index.js'

function lifecycleMinxin (Cue) {
  Cue.prototype._update = function (vnode,hydrating) {
    console.log('Cue.prototype._update');
    console.log('vnode',vnode);
  }
}

// mountComponent()的作用是
function mountComponent (vm, el, hydrating) {
  //将el挂载到vm.$el属性上
  vm.$el = el

  //如果render函数不存在
  if (!vm.$options.render) { }

  // 声明一个updateComponent()方法，传入Watcher，Watcher变化时，会调用这个函数
 
  //调用updateComponent会执行vm._update()方法。
  // vm._render()返回一个vnode
  function updateComponent () {
    vm._update(vm._render(),hydrating)
  }

  new Watcher(vm, updateComponent, noop, {}, true)
  
  return vm
}

export {
  mountComponent,
  lifecycleMinxin,
}
