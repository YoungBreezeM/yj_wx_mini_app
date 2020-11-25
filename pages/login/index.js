//index.js
//获取应用实例
const app = getApp()
let {
  Get,
  Post
} = require("../../utils/api-request.js");
const api = require("../../config/api.js")
Page({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2
        })
      }
    }
  },
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bgImage:api.ImageServer.bg,
    client:null,
    isStop:false
  },
  onLoad: function () {
    app.checkLogin =res=>{
      console.log(res)
      if(res.status){
        let token = wx.getStorageSync("token")
        if(token){
          wx.request({
            url: api.Url.getUserInfo,
            method:'get',
            header: {
              'Content-Type': 'application/json',
              'API-Authorization': token
            },
            success:(res)=>{
              if(res.code===0){
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }else{
                wx.clearStorageSync('token')
              }
            }
          })
        }else{
          this.setData({
            client: res
          })
        }
      }else{
        this.setData({
          isStop:true
        })
      }
    }
  },
  getUserInfo(){
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
            
              // 可以将 res 发送给后台解码出 unionId
             
              console.log(this.data.client)
              wx.setStorageSync("userInfo", res.userInfo);
             
              Post(api.Url.setUserInfo,{
                id:this.data.client.id,
                openId:this.data.client.openId,
                nickName: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl,
                phone:this.data.phone,
                integral:this.data.client.integral,
                status:this.data.client.status
              })
                .then(rs => {
                  if (rs.code === 0) {
                    console.log(rs.data.token)
                    wx.setStorageSync("token", rs.data.token)
                    wx.switchTab({
                      url: '/pages/index/index',
                    })
                  
                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回 
                   // app.checkLogin(rs.data.token)
                  }
                })
            }
          })
        }
      }
    })
  }
})
