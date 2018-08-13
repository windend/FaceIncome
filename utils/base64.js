var reversedata = function(res) {
  var w = res.width;
  var h = res.height;
  let con = 0;
  for (var i = 0; i < h / 2; i++) {
    for (var j = 0; j < w * 4; j++) {
      con = res.data[(i * w * 4 + j) + ""];
      res.data[(i * w * 4 + j) + ""] = res.data[((h - i - 1) * w * 4 + j) + ""];
      res.data[((h - i - 1) * w * 4 + j) + ""] = con;
    }
  }
  return res;
};
var base64 = function(the, img, callback) {
  const ctx = wx.createCanvasContext('ff')
  wx.getImageInfo({
    src: img,
    success: function(res) {
      console.log(res)
      app.globalData.imgw = res.width
      app.globalData.imgh = res.height
      let sw = ''
      let sh = ''
      if (res.width * res.height <= 1000000) {
        // app.globalData.iscompressed = 0
        sw = res.width
        sh = res.height
      } else if (res.width * res.height <= 2000000) {
        app.globalData.iscompressed = true
        app.globalData.size = 2
        sw = res.width / app.globalData.size
        sh = res.height / app.globalData.size
      } else {
        app.globalData.size = 3.5
        sw = res.width / app.globalData.size
        sh = res.height / app.globalData.size
        app.globalData.iscompressed = true
      }

      the.setData({
        w: sw + 'px',
        h: sh + 'px'
      })
      ctx.drawImage(img, 0, 0, sw, sh)
      ctx.draw(false, () => {
        wx.canvasGetImageData({
          canvasId: 'ff',
          x: 0,
          y: 0,
          width: sw,
          height: sh,
          success: function(res) {
            // console.log(res)
            let result = res.data
            // let platform = wx.getSystemInfoSync().platform
            if (app.sysinfo.platform == 'ios') {
              // 兼容处理：ios获取的图片上下颠倒
              result = reversedata(res).data
            };

            let sdata = upng.encode([result.buffer], res.width, res.height)
            let data = wx.arrayBufferToBase64(sdata)
            console.log(data.length)
            ctx.clearRect(0, 0, res.width, res.height)
            the.setData({
              w: 0 + 'px',
              h: 0 + 'px',
              // hidden: !the.data.hidden
            })
            callback(img, data)
          }
        })

        // })

        // }
        // })

        // }
      })
      // })

    }
  })

}

var api = function(path) {
  wx.uploadFile({
    url: 'https://sm.ms/api/upload',
    filePath: path[0],
    name: 'smfile',
    success: function(res) {
      // console.log(res.data)
      var img = JSON.parse(res.data).data
      console.log(img)
      wx.request({
        url: img.url,
        responseType: 'arrayBuffer',
        success: function(res) {
          // console.log(res.data)
          let base64s = wx.arrayBufferToBase64(res.data)
          // let img64 = 'data:image/png;base64,' + base64s
          // console.log(base64s.length)
          wx.request({
            url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=rYNWIhZt82uu4jcFaUGhLT1K&client_secret=syumQjISxYlGYdUxvzRGMPwYfBrbSuox',
            method: 'post',
            success: function(res) {
              var at = res.data.access_token
              wx.request({
                url: 'https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=' + at,
                header: {
                  'Content-Type': 'application/json'
                },
                method: 'post',
                data: {
                  'max_face_num': 10,
                  'image': img.url,
                  'image_type': 'URL',
                  'face_field': 'age,beauty,expression,faceshape,gender,glasses,race,facetype'
                },
                success: function(res) {
                  app.globalData.result = res.data
                  let tmp = res.data
                  console.log(tmp.result.face_list)
                  wx.hideLoading()
                  wx.showToast({
                    title: '扫描完成',
                    duration: 2000,
                    success: () => {

                      // wx.request({
                      //   url: img.delete,
                      //   success: function(res) {

                      wx.hideToast()
                      wx.navigateTo({
                        url: '../history/history',
                      })
                    }
                  })
                  //   }
                  // })
                }

              })

            }
          })
        }
      })

    },
    fail: function() {
      console.log('fail')
    },
    complete: function() {
      console.log('finished')
    }

  })

}
module.exports = {
  encode: base64,
  upapi: api
}