/*
 * @Description:
 */

function defineReactive (obj, key, val) {
  Object.defineProperty(obj, key, {
    get () {
      console.log('get:', val);
      return val
     },
    set (newVal) {
      if (val !== newVal) {
        console.log('set:',newVal);
        val = newVal
      }
     }
  })
}

let obj = {}
defineReactive(obj, 'name', 'cboy')
obj.name
obj.name = 'cboy22'


