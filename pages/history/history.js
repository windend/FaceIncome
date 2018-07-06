// pages/history/history.js
var app = getApp()
var config = {
  'male': '男性',
  'female': '女性',
  'square': '正方形脸',
  'triangle': '三角形脸',
  'oval': '椭圆形脸',
  'heart': '心形脸',
  'round': '圆形脸',
  'yellow': '黄种人',
  'white': '白种人',
  'black': '黑种人',
  'arabs': '阿拉伯人',
}
var uri = function() {
  let source = app.globalData.result.result.face_list
  let l = source.length
  let i = 0
  while (i < l) {
    // console.log(source[i].face_probability.toFixed(2))
    if (source[i].face_probability.toFixed(2) > 0.3) {
      source[i].canvas = i + 1
      i++
    } else {
      let t = source.splice(i, 1)
      // console.log(t)
      l--
    }
  }
  console.log(source)
  if (source.length > 0) {
    return source
  }
}
var piant = function(result) {
  if (result) {

    for (let i = 0; i < result.length; i++) {
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
      if (app.globalData.iscompressed) {
        compress(ctx, x, app.globalData.size)
      } else {
        // console.log('done')
        compress(ctx, x, 1)
      }
      ctx.draw()
      // ctx.draw(false, function() {
      //   wx.canvasToTempFilePath({
      //     canvasId: i,
      //     success: function(res) {
      //       // console.log(res.tempFilePath)
      //       cal(i, res.tempFilePath)
      //     }
      //   })
      // })
    }
  }
}
var compress = function(ctx, l, size) {
  let sh = l.height * 4 / 3
  let sw = sh * 295 / 200
  if ((l.left - sw / 4) > app.globalData.imgw / size - sw) {
    let tx = ''
    if (app.globalData.imgw - sw * size > 0) {
      tx = app.globalData.imgw - sw * size
    } else {
      tx = 0
    }
    ctx.drawImage(app.globalData.img, tx, (l.top - sh / 5) * size, sw * size, sh * size, 0, 0, 295, 200)
  } else if (l.left - sw / 4 > 0) {
    ctx.drawImage(app.globalData.img, (l.left - sw / 4) * size, (l.top - sh / 5) * size, sw * size, sh * size, 0, 0, 295, 200)
  } else {
    let tts = ''
    if (l.left > 0) {
      tts = l.left
    } else {
      tts = 0
    }
    ctx.drawImage(app.globalData.img, tts * size, (l.top - sh / 5) * size, (sw * 5 / 4 - l.left) * size, sh * size, 0, 0, 295, 200)
  }
}
var urls = function(i, path) {
  app.globalData.result.result.face_list[i].uri = path
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    s: true,
    condition: false,
    result: '',
    path: '',
    name: 'Future',
    price: '20万',
    num: '6',
    like: '70',
    ages: 1,
    sex: '男',
    races: '白种人',
    beautys: 100,
    faceshape: '椭圆形',
    hh: app.sysinfo.windowHeight
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.getStorage({
      key: 'path1',
      success: function (res) {
        that.setData({
          path: res.data
        })
      },
      fail: () => {
        wx.setStorage({
          key: "path1",
          data: 'https://i.loli.net/2018/06/27/5b336da9262de.jpg',
          success: function () {
            console.log('写入value1成功')
            that.setData({
              path: wx.getStorageSync('path1')
            })
          },
          fail: function () {
            console.log('写入value1发生错误')
          }
        })
      }
    })
    if (app.globalData.result) {
      if (app.globalData.result.error_code === 0) {
        let result = uri()
        console.log(result)
        piant(result)
        if (result) {
          this.setData({
            condition: true,
            result: result
          })
        }
        // console.log(this.data.condition)
      } else {
        wx.showModal({
          title: 'Oops~~~',
          content: '颜( •̀ .̫ •́ )✧还没充值，换张照片试试',
          showCancel: false,
          confirmText: '回去充值',
          success: function(res) {
            if (res.confirm) {
              console.log('返回主页')
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      }
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // let s=wx.getStorageSync('logs')
    // console.log(s)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {


  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '测测颜值可敢~~~',
    }
  }
})