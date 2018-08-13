import regeneratorRuntime from 'runtime.js'
var piant = function(result, globals) {
  if (result) {
    return new Promise(function(resolve, reject) {
      let arr = []
      for (let i = 0; i < result.length; i++) {
        let promise = new Promise(function(resolve, reject) {
          let x = result[i].location
          // console.log(typeof (result[i].canvas.toString()))
          const ctx = wx.createCanvasContext(result[i].canvas)
          // result[i].canvas
          // ctx.save()
          ctx.beginPath()
          ctx.arc(10, 10, 10, Math.PI, 1.5 * Math.PI)
          ctx.arc(285, 10, 10, 1.5 * Math.PI, 2 * Math.PI)
          ctx.arc(285, 185, 10, 0, 0.5 * Math.PI)
          ctx.arc(10, 185, 10, 0.5 * Math.PI, Math.PI)
          ctx.clip()
          ctx.setShadow(0, 0, 5, '#aaaaaa')
          // console.log((x.left - sw / 4), (x.top - sh / 4), sw, sh)
          if (globals['iscompressed']) {
            compress(ctx, x, globals['size'], globals)
          } else {
            // console.log('done')
            compress(ctx, x, 1, globals)
          }
          resolve(ctx.draw())
          // (function(j) {
          //   ctx.draw(false, () => {
          //     wx.canvasToTempFilePath({
          //       canvasId: result[j].canvas,
          //       success: function(res) {
          //         console.log(res.tempFilePath)
          //         arr.push(res.tempFilePath)
          //         // resolve(res.tempFilePath)

          //       }
          //     })
          //   })
          // })(i)
          arr.push(promise)
        })
      }
      resolve(arr)
    })
    // return arr
  }
}
var compress = function(ctx, l, size, globals) {
  let sh = l.height * 4 / 3
  let sw = sh * 295 / 200
  if ((l.left - sw / 4) > globals['imgw'] / size - sw) {
    let tx = ''
    if (globals['imgw'] - sw * size > 0) {
      tx = globals['imgw'] - sw * size
    } else {
      tx = 0
    }
    ctx.drawImage(globals['img'], tx, (l.top - sh / 5) * size, sw * size, sh * size, 0, 0, 295, 200)
  } else if (l.left - sw / 4 > 0) {
    ctx.drawImage(globals['img'], (l.left - sw / 4) * size, (l.top - sh / 5) * size, sw * size, sh * size, 0, 0, 295, 200)
  } else {
    let tts = ''
    if (l.left > 0) {
      tts = l.left
    } else {
      tts = 0
    }
    ctx.drawImage(globals['img'], tts * size, (l.top - sh / 5) * size, (sw * 5 / 4 - l.left) * size, sh * size, 0, 0, 295, 200)
  }
}


module.exports = {
  piant: piant
}