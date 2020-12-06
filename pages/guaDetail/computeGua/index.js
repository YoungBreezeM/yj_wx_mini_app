// pages/resove/loadgua/index.js
const api = require('../../../config/api.js');
const {
  Post,
  Get
} = require('../../../utils/api-request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice:"当前积分不够,请积攒积分前来卜卦",
    text:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    Get(api.Url.getUserInfo)
        .then(res => {
          console.log(res)
          if(res.code===0){
            return res.data.client;
          }
        })
        .then(client=>{
          console.log(client)
          Post(api.Url.prediction,{
            prediction:{
              baseGuaId:options.baseGuaId,
              categoryId:options.categoryId,
              yaoId:options.yaoId
            },
            client:client
          }).then(res=>{
            console.log(res)
            if(res.code===0){
              this.setData({
                text:res.data.predictionText
              })
            }else {
              this.setData({
                notice:"当前积分不够,请积攒积分前来卜卦"
              })
            }

          })
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
