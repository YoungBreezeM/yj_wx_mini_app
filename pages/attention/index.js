// pages/attention/index.js
const {
  Get,
  Post
} = require('../../utils/api-request.js');
const api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attentionList:null,
    attention:true,
    client:null,
    grade:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkUser();
  },
  checkUser() {

    //初始用户信息
    Get(api.Url.getUserInfo)
        .then(res => {
          if (res.code === 0) {

            this.setData({
              client: res.data.client,
              grade :res.data.grade
            })

            this.getAttentionList();
          }
        })
  },
  toUserInfo(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/info/index?clientId=' + e.currentTarget.dataset.id,
    })
  },
  getAttentionList(){
    Get(api.Url.addAttention+"/"+this.data.client.id)
        .then(res=>{
          console.log(res)
          if(res.code===0){
            this.setData({
              attentionList:res.data
            })
          }
        })
  },
  addAttention(e){
    Post(api.Url.addAttention,{
      fromId:this.data.client.id,
      toId: e.currentTarget.dataset.id
    }).then(res=>{
      if(res.code===0){
        console.log(res)
        this.setData({
          attention:!this.data.attention
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
