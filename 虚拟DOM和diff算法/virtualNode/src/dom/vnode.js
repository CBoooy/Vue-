export default function vnode (sel,data,children,text,elm) {
  // vnode()会返回一个对象，这个对象表示要给virtualNode
  // 这个virtualNode长这样：
  // {
  //   children: undefined,
  //   data: { },
  //   ele: undefined,
  //   key: undefined,
  //   sel: 'div',
  //   text:'我是div的内容'
  // }
  return {
    sel,
    data,
    children,
    text,
    elm,
  }
}
