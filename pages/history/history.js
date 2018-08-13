// pages/history/history.js
import regeneratorRuntime from '../../utils/runtime.js'
var piant = require('../../utils/compress.js')
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
    if (source[i].face_probability.toFixed(2) > 0.6) {
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

var urls = async function(result, globals) {
  // let path=piant.piant(result, globals)
  // console.log(path)
  let promises = await piant.piant(result, globals)
  console.log(promises)
  Promise.all(promises).then(res => {
    console.log(res)
  })

}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    s: true,
    condition: false,
    result: '',
    path: '../../car.jpg',
    name: 'Future',
    price: '20万',
    num: '6',
    like: '70',
    ages: 1,
    sex: '女',
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
      success: function(res) {
        that.setData({
          path: res.data
        })
      },
      fail: () => {
        wx.setStorage({
          key: "path1",
          data: '../../car.jpg',
          success: function() {
            console.log('写入value1成功')
            that.setData({
              path: wx.getStorageSync('path1')
            })
          },
          fail: function() {
            console.log('写入value1发生错误')
          }
        })
      }
    })
    if (app.globalData.result && app.globalData.result.error_code === 0) {

      let result = uri()
      console.log(result)
      urls(result, app.globalData)
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
      path: '/pages/image/image'
    }
  }
})