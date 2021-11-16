let CVue = require('./CVue')
let app = new CVue({
  data: {
    counter:0
  }
})
console.log(CVue);
setInterval(() => {
  app.$data.counter++
  console.log(app.counter);
}, 300);
