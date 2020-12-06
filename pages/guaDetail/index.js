// pages/guaDetail/index.js
const api = require('../../config/api.js');
const {
  Post,
  Get
} = require('../../utils/api-request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseGua:null,
    yao:null,
    options:null,
    TabCur: 0,
    scrollLeft:0,
    tabList:["本卦","爻词"],
    cachePredictionCategory:null,
    predictionCategory:null,
    prediction:null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      options:options
    })

    this.initBaseGua(options.baseGuaId);
    this.getPredictionCategory()
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })

    if(e.currentTarget.dataset.id===0){
      this.initBaseGua(this.data.options.baseGuaId)
    }else {
      this.initYao(this.data.options.yaoId)
    }
  },
  initBaseGua(id){
    Post(api.Url.getOneBaseGua,{
      id:id
    }).then(res=>{
      console.log(res)
      if(res.code===0){
        this.setData({
          baseGua:res.data
        })
      }
    })
  },
  initYao(id){
    if(id){
      Post(api.Url.getOneYao,{
        id:id
      }).then(res=>{
        console.log(res)
        if(res.code===0){
          this.setData({
            yao:res.data
          })
        }
      })
    }
  },
  getPredictionCategory() {
    Get(api.Url.predictionCategory)
        .then(res => {
          console.log(res)
          if (res.code === 0) {
            let rs = [];
            res.data.forEach(item => {
              rs.push(item.categoryName)
            })
            this.setData({
              cachePredictionCategory: res.data,
              predictionCategory: rs
            })
          }
        })
  },
  PickerChangeIntegral(e) {
    this.setData({
      prediction: e.detail.value
    })
  },
  toResolve(){
    console.log(this.data.prediction)
    wx.navigateTo({
      url:"/pages/guaDetail/computeGua/index?baseGuaId="
          +this.data.baseGua.id+
          "&categoryId="
          +this.data.cachePredictionCategory[this.data.prediction].id
          +"&yaoId="
          +null
    })

  },
  hideModal() {
    this.setData({
      modalName: null
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
