import Cue from '../../../core/index';

import { mountComponent } from '../../../core/instance/lifecycle';

//定义公共的的$mount方法，在entry-runtime-with-compiler中被重写
// 这个原初$mount方法干了啥事儿？
Cue.prototype.$mount = function (el, hydrating) {
  //调用$mount会返回mountComponent()的执行结果
  return mountComponent(this,el,hydrating)
}
export default Cue;
