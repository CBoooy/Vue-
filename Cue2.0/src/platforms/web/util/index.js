
function query (el) {
//   el的两种写法：
//   1 选择器：#app
//   2 DOM元素：document.querySelector('#app')
  
  //1 #app
  if (typeof el === 'sting') {
    let selectedElement = document.querySelector(el)

    // 如果没有找到这个元素
    if (!selectedElement) {
      // 则，返回一个空的div元素
      return document.createElement('div')  
    }
    
    return selectedElement
  }else {
    // 2 document.querySelector('#app')

    return el
  }
}

export {
  query,
}
