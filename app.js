//app.js
let api = require("./config/api.js");
let {
  Get,
  Post,
  Upload
} = require("./utils/api-request.js");
App({
  onLaunch: function() {
    this.initData();
  },
  globalData: {
    userInfo: null,
    navHeight: null
  },
  initData(){
    wx.getSystemInfo({
      success: res => {
        this.globalData.navHeight = res.statusBarHeight + 46;
        this.globalData.StatusBar = res.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - res.statusBarHeight;
      }
    })
    //用户校验登录
    wx.login({
      success: res => {
        Get(api.Url.login + res.code)
          .then(rs => {
            if (rs.code === 0) {
              console.log("login")
              console.log(rs.data)
              //页面回调
              this.checkLogin(rs.data)
            }
          })
      }
    })
  },
  checkLogin:function(){},//校验用户登录状态
})
