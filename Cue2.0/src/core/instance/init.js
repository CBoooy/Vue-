import { initRender } from './render';
import { initProxy } from './proxy';

// 这个initMixin的作用是：
// 1 往Cue原型上挂载_init()
function initMixin(Cue) {
  //这个_init()的作用是：
  Cue.prototype._init = function (options) {
    // vm即app
    let vm = this;
    if (options && options._isComponent) {
    } else {
      vm.$options = options;
    }

    vm._renderProxy = vm;

    initRender(vm);
    initProxy(vm);

    // 如果app上存在el属性，
    if (vm.$options.el) {
      // 调用vm.$mount()，
      // vm.$mount的作用是：
      vm.$mount(vm.$options.el);
    }
  };
}

export { initMixin };
