import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h,
} from 'snabbdom';

const patch = init([
  // Init patch function with chosen modules
  classModule, // makes it easy to toggle classes
  propsModule, // for setting properties on DOM elements
  styleModule, // handles styling on elements with support for animations
  eventListenersModule, // attaches event listeners
]);

const container = document.getElementById('container');

let vnode = h('h1', {}, '你好aaaa')


console.log(vnode);  
// Second `patch` invocation
patch(container,vnode); // Snabbdom efficiently updates the old view to the new state
let vnode2 = h('ul', {}, [
  h('li', {}, 'li111'),
  h('li',{},'li2222')
])
console.log(vnode2);
patch(vnode,vnode2)
