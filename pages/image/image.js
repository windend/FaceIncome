// pages/image/image.js
import regeneratorRuntime from '../../utils/runtime.js'
var upng = require('../../upng-js/UPNG.js')
var handle = require('../../utils/handle.js')
var data = require('../../utils/struct.js')
var app = getApp()
var req = function(url) {
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
          'image': url,
          'image_type': 'URL',
          'face_field': 'age,beauty,expression,faceshape,gender,glasses,race,facetype'
        },
        success: function(res) {
          console.log(res.data)
          if (res.statusCode == 200 && res.data.error_code === 0) {
            let datas = []
            for (let i of res.data.result.face_list) {
              datas.push(data.data(i, url))
            }
            handle.create(['todocard', datas[0]]).then(res => {
              console.log(res)
              wx.showToast({
                title: '扫描完成',
                duration: 1500,
                success: () => {
                  // wx.hideToast()
                  wx.navigateTo({
                    url: '../historys/historys',
                  })
                }
              })
            })
            // wx.hideLoading()

          } else {
            wx.navigateTo({
              url: '../history/history',
            })
          }
        },
        fail: () => {
          wx.showToast({
            title: '网络出了点问题，请重新为颜充值',
            icon: 'none',
            duration: 2000,
          })
          wx.hideToast()
        },
      })

    },
    fail: () => {
      wx.showToast({
        title: '网络出了点问题，请重新为颜充值',
        icon: 'none'
      })
    },
    complete: () => {
      // wx.hideToast()
    }
  })
}
var freq = function(img) {
  wx.request({
    url: 'https://api-cn.faceplusplus.com/facepp/v3/detect?api_key=_Zk_DtUUSy5ZyMsqnq0Rry5psNSEqufN&api_secret=iog01_apR846iZ41SLDgUNZI3q5EmC6c&return_attributes=age%2Cbeauty%2Ceyestatus%2Cemotion%2Cgender%2Cskinstatus%2Cethnicity',
    method: 'post',
    data: {
      // 'api_key': '_Zk_DtUUSy5ZyMsqnq0Rry5psNSEqufN',
      // 'api_secret': 'iog01_apR846iZ41SLDgUNZI3q5EmC6c',
      // 'return_attributes': 'age,beauty,eyestatus,emotion,gender,skinstatus,ethnicity',
      'image_url': img,
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

Page({
  data: {
    path: '../../camera1.png',
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
  list: function() {
    wx.navigateTo({
      url: '../person/person',
    })
  },
  his: function() {
    wx.navigateTo({
      url: '../historys/historys',
    })
  },
  open: function() {
    let that = this
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['camera', 'album'],
      count: 1,
      success: function(res) {
        console.log(res.tempFilePaths)
        app.globalData.img = res.tempFilePaths[0]
        var path = res.tempFilePaths
        that.setData({
          path: path[0]
        })
        handle.uploadimage(res.tempFilePaths[0]).then(res => {
          console.log(res)
          req(res)
        })
        // base64(that, res.tempFilePaths[0], req)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
      title: '颜值展厅了解下~~~',
      path:'pages/person/person'
    }
  }
})
