import { initMixin } from './init'
import { lifecycleMinxin } from './lifecycle'
import {renderMixin} from './render.js'


function Cue (options) {

  //
  this._init(options)
  
}

initMixin(Cue)//往Cue.prototype上挂载_init()

lifecycleMinxin(Cue)

renderMixin(Cue)



 export default Cue
