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
        bgImage:"",
        client: null,
        isStop: false
    },
    onLoad: function () {
        console.log("login init")
       let token = wx.getStorageSync("token")
        app.checkLogin = res => {
            console.log("校验用户状态")
            if (res.status) {
                //检查token缓存是否有效
                let token = wx.getStorageSync("token");
                if (token){
                    Get(api.Url.getUserInfo,token)
                        .then(res=>{
                            if (res.code !== 0) {
                                wx.clearStorageSync("token")
                                this.setData({
                                    client: res
                                })
                            }else {
                                console.log("token 检测成功")
                                wx.switchTab({
                                    url: '/pages/index/index',
                                })
                            }
                        })
                }else {
                    this.setData({
                        client: res
                    })
                }
            } else {
                this.setData({
                    isStop: true
                })
            }
        }
    },
    getUserInfo() {
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                          wx.setStorageSync("userInfo", res.userInfo);
                            console.log(this.data.client)
                            if(this.data.client){
                              Post(api.Url.setUserInfo, {
                                id: this.data.client.id,
                                openId: this.data.client.openId,
                                nickName: res.userInfo.nickName,
                                avatarUrl: res.userInfo.avatarUrl,
                                phone: this.data.phone,
                                integral: this.data.client.integral,
                                status: this.data.client.status
                              })
                                .then(rs => {
                                  if (rs.code === 0) {
                                    console.log(rs.data.token)
                                    wx.setStorageSync("token", rs.data.token)
                                    wx.switchTab({
                                      url: '/pages/index/index',
                                    })

                                  }
                                })
                            }else{
                              //用户校验登录
                              wx.login({
                                success: loginRes => {
                                  Get(api.Url.login + loginRes.code)
                                    .then(rs => {
                                      if (rs.code === 0) {
                                        console.log("re login ")
                                        console.log(res)
                                        this.data.client = rs.data;
                                        Post(api.Url.setUserInfo, {
                                          id: this.data.client.id,
                                          openId: this.data.client.openId,
                                          nickName: res.userInfo.nickName,
                                          avatarUrl: res.userInfo.avatarUrl,
                                          phone: this.data.phone,
                                          integral: this.data.client.integral,
                                          status: this.data.client.status
                                        })
                                          .then(rs => {
                                            if (rs.code === 0) {
                                              console.log(rs.data.token)
                                              wx.setStorageSync("token", rs.data.token)
                                              wx.switchTab({
                                                url: '/pages/index/index',
                                              })

                                            }
                                          })
                      
                                      }
                                    })
                                }
                              })
                            }
                        }
                    })
                }
            }
        })
    }
})
