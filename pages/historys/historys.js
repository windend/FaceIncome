// pages/person/person.js
import regeneratorRuntime from '../../utils/runtime.js'
var handle = require('../../utils/handle.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cards: 'card',
    fflip: 'image front',
    bflip: 'image back',
    f: true,
    result: '',
    hh: app.sysinfo.windowHeight,
    z: ''
  },
  flip: function(e) {
    console.log(e)
    if (e.currentTarget.dataset.id === e.currentTarget.id) {
      if (this.data.f) {
        this.setData({
          id: e.currentTarget.id,
          f: false,
          cardss: 'card-flipped',
          z: 'z-index:1',
        })
      } else {
        this.setData({
          id: '',
          f: true,
          z: 'z-index:1',
        })
      }

    }



  },
  change: function(e) {
    this.setData({
      f: true
    })
  },
  del: function(e) {
    handle.del(['todocard', e.currentTarget.dataset.id]).then(res => {
      console.log('删除成功:' + res)
      handle.query(['todocard']).then(res => {
        res.sort((a, b) => {
          return b.created_at - a.created_at
        })
        for (let i of res) {
          i.tip = true
          if (i.comment) {
            if (i.comment.length > 0) {
              i.tip = false
            }
          }
        }
        this.setData({
          result: res
        })
      })
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
    wx.showLoading({
      title: '玩命铺货中',
      mask: true,
      success: (res) => {
        handle.query(['todocard', 'created_by', Number(app.globalData.userInfo)]).then(res => {
          console.log(res)
          wx.hideLoading()
          if (res.length > 0) {
            for (let i of res) {

              i.tip = true
              if (i.comment) {
                if (i.comment.length > 0) {
                  i.tip = false
                }
              }
            }
            res.sort((a, b) => {
              return b.created_at - a.created_at
            })
            this.setData({
              result: res
            })
          } else {
            wx.showModal({
              title: '还未上架，请稍等',
              content: '',
              showCancel: false,
              success: res => {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../image/image',
                  })
                }
              }
            })
          }
        }), err => {
          wx.showModal({
            title: '还未上架，请稍等',
            content: '',
            success: res => {
              if (res.confirm) {
                wx.redirectTo({
                  url: '../image/image',
                })
              }
            }
          })
        }
      }
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
      title: '颜值展会了解下~~~',
      path: 'pages/person/person'
    }
  }
})