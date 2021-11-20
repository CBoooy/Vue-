import vnode from './vnode.js';
import createElement from './createElement.js';

export default function patch(oldVnode, newVnode) {
  //oldVnode有两种传值方式，
  // 1 传真实DOM
  // 2 传Vnode

  // 对于第一种：真实DOM肯定没有sel属性，
  if (oldVnode.sel === undefined) {
    // 既然是非Vnode，那就让其变成Vnode
    oldVnode = vnode(
      oldVnode.nodeName.toLowerCase(), //sel
      {}, //data
      [],
      undefined,
      oldVnode
    );
  }

  //具体的patch判断

  //判断oldVnode和newVnode是否为同一个selector，如两个都是div
  if (oldVnode.sel === newVnode.sel) {
  } else {
    // oldVnode是div，newVnode是h1，不是同一个选择器，则直接删掉div，换成h1

    // 将newVnode变为真实DOM，替换oldVnode
    // 这里使用了crateElement方法，用来创建一个真实DOM节点

    let newVnodeElm = createElement(newVnode);
    console.log(newVnodeElm);

    // 放入新节点,注意，先将新节点放在就节点之前，后才删除旧节点
    let oldVnodeElm = oldVnode.elm; //获得旧节点

    if (newVnodeElm) {
      oldVnodeElm.parentNode.insertBefore(newVnodeElm, oldVnodeElm);
    }

    //删除旧节点
    oldVnodeElm.parentNode.removeChild(oldVnodeElm);
  }
}
