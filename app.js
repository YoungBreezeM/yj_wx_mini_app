//app.js
let api = require("./config/api.js");
let {
  Get,
  Post
} = require("./utils/api-request.js");
App({
  onLaunch: function() {

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.getSystemInfo({
      success: res => {
        this.globalData.navHeight = res.statusBarHeight + 46;
        this.globalData.StatusBar = res.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - res.statusBarHeight;
      }
    })

    console.log("appp")
    // 登录
    wx.login({
      success: res => {
        console.log("登录")
        wx.clearStorageSync("token");
         Get(api.Url.login + res.code)
        .then(rs => {
          if (rs.code == 0) {
            console.log(rs)
            let client = rs.data;
             this.checkLogin(client)
            
          }
        })
      }
    })
   
  },
  globalData: {
    userInfo: null,
    navHeight: null
  },
  checkLogin:function(){},//校验用户登录状态
})