//app.js

App({
  onLaunch: function() {
    let res = wx.getSystemInfoSync()
    console.log(res)
    this.sysinfo.fontSizeSetting = res.fontSizeSetting
    this.sysinfo.pixelRatio = res.pixelRatio
    this.sysinfo.windowWidth = res.windowWidth
    this.sysinfo.windowHeight = res.windowHeight
    this.sysinfo.platform = res.platform
    require('./sdk/sdk-v1.5.0')
    let clientID = '1aa6d809ca11ab91f61e'
    wx.BaaS.init(clientID)
    this.globalData.userInfo = wx.BaaS.storage.get('uid')
    wx.BaaS.login(false).then(res => {
      this.globalData.userInfo = res.id
      console.log(this.globalData.userInfo)
    })
    // console.log(this.globalData.userInfo)
  },
  globalData: {
    userInfo: null,
    result: null,
    img: null,
    disable: false,
    size: '',
    imgw: '',
    imgh: '',
    iscompressed: false
  },
  sysinfo: {
    windowWidth: '',
    pixelRatio: '',
    fontSizeSetting: ''
  }
})