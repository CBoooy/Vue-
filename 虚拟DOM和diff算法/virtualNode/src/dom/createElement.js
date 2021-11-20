
// 参数vnode为需要转换成真实DOM的虚拟节点
export default function createELement (vnode) {
  let domNode = document.createElement(vnode.sel)

  // 这个vnode有两种情况：
  // 1 有子元素
  // 2 没有子元素

  // 1 没有子元素,则就是一个文本节点
  if (vnode.children === undefined) {
    domNode.innerHTML = vnode.text

  } else if (Array.isArray(vnode.children)) {
    //2 说明内部有子元素，则，需要递归创建子元素节点
    for (let child of vnode.children) {
      let childDom = createELement(child)
      domNode.appendChild(childDom)
    }
  }
  
  //补充elm属性，
  vnode.elm = domNode

  return domNode
}
