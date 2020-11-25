// pages/resove/index.js
const app = getApp()
const {
  Post,
  Get
} = require('../../utils/api-request.js');
const api = require('../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navHeight: null,
    vid:'http://upos-sz-mirrorcos.bilivideo.com/upgcxcode/29/58/23595829/23595829-1-160.mp4?e=ig8euxZM2rNcNbUBhwdVhoMB7WdVhwdEto8g5X10ugNcXBMvNC8xNbLEkF6MuwLStj8fqJ0EkX1ftx7Sqr_aio8_&uipk=5&nbs=1&deadline=1606103972&gen=playurl&os=cosbv&oi=978800370&trid=bcc68369f81c4001a948c8e6cd988761T&platform=html5&upsig=2fc2f2d321d7cd6a2ec0eb422f63eea7&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,platform&mid=524602686&orderid=0,1&logo=80000000',
    content:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("init")
    this.setData({
      navHeight: app.globalData.navHeight
    });
    this.toResolve();
  },
  toResolve(){
     Get(api.Url.baseGua)
     .then(res => {
      if(res.code===0){
        this.setData({
          content: res.data.guaText
        })
       
      }
    })
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("read")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("show")
    this.toResolve();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("hide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("unload")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})