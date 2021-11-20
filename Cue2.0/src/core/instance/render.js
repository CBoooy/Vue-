import {createElement} from '../vdom/create-element.js'


function initRender (vm) {
  vm.$createElement = function (a, b, c, d) {
    return createElement(vm,a,b,c,d,true)
  }
    
}


function renderMixin (Cue) {
  
  //传入Cue实例，并在实例上挂载_render方法
  Cue.prototype._render = function () {
    let vm = this;
    let { render } = vm.$options;

    let vnode;

    // 生成vode会调render，这个render在vm.$options上面，这个render函数在entry-runtime-with-compiler.js文件中被生成并挂载到vm.$options上

    //这里的vm._renderProxy在instance/proxy.js中被放到vm上。proxy.js在instance/init.js中被调用
    // 这里的vm.$createElement在当前文件的initRender()中被定义,initRender在instance/init.js被调用
    vnode = render.call(vm._renderProxy, vm.$createElement);

    return vnode;
  }
}

export {
  renderMixin,
  initRender,
}
7
