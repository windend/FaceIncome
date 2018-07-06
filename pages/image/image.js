// pages/image/image.js
var upng = require('../../upng-js/UPNG.js')
var app = getApp()
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
var upload = function(img) {
  wx.uploadFile({
    url: 'http://up.imgapi.com/',
    filePath: img,
    name: 'file',
    formData: {
      Token: '',
      id: '',
      name: '',
      type: '',
      lastModifiedDate: '',
      size: ''

    }
  })
}
var req = function(img) {
  wx.request({
    url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=rYNWIhZt82uu4jcFaUGhLT1K&client_secret=syumQjISxYlGYdUxvzRGMPwYfBrbSuox',
    method: 'post',
    success: function(res) {
      if (res.statusCode == 200) {
        var at = res.data.access_token
      }

      wx.request({
        url: 'https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=' + at,
        header: {
          'Content-Type': 'application/json'
        },
        method: 'post',
        data: {
          'max_face_num': 10,
          'image': img,
          'image_type': 'BASE64',
          'face_field': 'age,beauty,expression,faceshape,gender,glasses,race,facetype'
        },
        success: function(res) {
          console.log(res.data)
          if (res.statusCode == 200) {
            app.globalData.result = res.data
            wx.hideLoading()
            wx.showToast({
              title: '扫描完成',
              duration: 2000,
              success: () => {
                // wx.hideToast()
                wx.navigateTo({
                  url: '../history/history',
                })
              }
            })
          }
        },
        fail: () => {
          wx.showToast({
            title: '网络出了点问题，请重新为颜充值',
            icon: 'none'
          })
        },
        complete: () => {
          wx.hideToast()
        }
      })

    },
    fail: () => {
      wx.showToast({
        title: '网络出了点问题，请重新为颜充值',
        icon: 'none'
      })
    },
    complete: () => {
      wx.hideToast()
    }
  })
}
var freq = function(img) {
  wx.request({
    url: 'https://api-cn.faceplusplus.com/facepp/v3/detect',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: {
      'image_base64': img,
      'api_key': '_Zk_DtUUSy5ZyMsqnq0Rry5psNSEqufN',
      'api_secret': 'iog01_apR846iZ41SLDgUNZI3q5EmC6c',
      'return_attributes': 'age,beauty,eyestatus,emotion,gender,skinstatus,ethnicity',
    },
    success: function(res) {
      console.log(res.data)
      app.globalData.result = res.data
      wx.hideLoading()
      wx.showToast({
        title: '扫描完成',
        duration: 2000,
        success: () => {
          // wx.hideToast()
          wx.navigateTo({
            url: '../history/history',
          })
        }
      })
    }
  })

}

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
        wx.canvasToTempFilePath({
          canvasId: 'ff',
          width: sw,
          height: sh,
          destWidth: sw,
          destHeight: sh,
          fileType: 'png',
          success: function(res) {
            // app.globalData.img = res.tempFilePath
            // console.log(res)
            wx.getImageInfo({
              src: res.tempFilePath,
              success: res => {
                console.log(res)
                the.setData({
                  w: res.width + 'px',
                  h: res.height + 'px'
                })
                ctx.drawImage(img, 0, 0, res.width, res.height)
                ctx.draw(false, () => {
                  wx.canvasGetImageData({
                    canvasId: 'ff',
                    x: 0,
                    y: 0,
                    width: res.width,
                    height: res.height,
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
                        hidden: !the.data.hidden
                      })
                      callback(data)
                    }
                  })

                })

              }
            })

          }
        })



      })

    }
  })

}
Page({
  data: {
    // path: 'https://i.loli.net/2018/06/29/5b3631d3d836e.png',
    path: '',
    disable: false,
    hidden: true,
    w: '',
    h: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hh: app.sysinfo.windowHeight
  },
  news: function() {
    wx.redirectTo({
      url: '../history/history',
    })
  },
  his: function() {
    wx.navigateTo({
      url: '../history/history',
    })
  },
  open: function() {
    let that = this
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: function(res) {
        console.log(res.tempFilePaths)
        app.globalData.img = res.tempFilePaths[0]
        var path = res.tempFilePaths
        that.setData({
          path: path[0]
        })
        base64(that, res.tempFilePaths[0], req)
        // api(path)
        wx.showLoading({
          title: '扫描中....',
          success: () => {
            that.setData({
              disable: !app.globalData.disable
            })
          }
        })
      },
    })
  },
  albumn: function() {
    let that = this
    wx.chooseImage({
      sizeType: ['compressed'],
      count: 1,
      sourceType: ['album'],
      success: function(res) {
        console.log(res.tempFilePaths)
        app.globalData.img = res.tempFilePaths[0]
        var path = res.tempFilePaths
        that.setData({
          path: path[0]
        })
        base64(that, res.tempFilePaths[0], req)

        // api(path)
        wx.showLoading({
          title: '扫描中....',
          success: () => {
            that.setData({
              disable: !app.globalData.disable
            })
          }
        })

      },
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.getStorage({
      key: 'path',
      success: function(res) {
        that.setData({
          path: res.data
        })
      },
      fail: () => {
        wx.setStorage({
          key: "path",
          data: 'https://i.loli.net/2018/06/29/5b36327a0a5ef.png',
          success: function() {
            console.log('写入value1成功')
            that.setData({
              path: wx.getStorageSync('path')
            })
          },
          fail: function() {
            console.log('写入value1发生错误')
          }
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      disable: app.globalData.disable,
      hidden: !this.data.hidden
    })
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
// if (app.globalData.userInfo) {
//   this.setData({
//     userInfo: app.globalData.userInfo,
//     hasUserInfo: true
//   })
// } else if (this.data.canIUse) {
//   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//   // 所以此处加入 callback 以防止这种情况
//   app.userInfoReadyCallback = res => {
//     this.setData({
//       userInfo: res.userInfo,
//       hasUserInfo: true
//     })
//   }
// } else {
//   // 在没有 open-type=getUserInfo 版本的兼容处理
//   wx.getUserInfo({
//     success: res => {
//       app.globalData.userInfo = res.userInfo
//       this.setData({
//         userInfo: res.userInfo,
//         hasUserInfo: true
//       })
//     }
//   })
// }