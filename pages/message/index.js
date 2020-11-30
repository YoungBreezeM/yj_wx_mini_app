// pages/info/index.js
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
    startNum:1,
    dataList:[],
    isRefreshing: false, //是否下拉刷新状态
    isFinish: false, //是否加载完全部数据
    host: api.ApiBaseUrl,
    pageSize:10
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.clientId)
    this.setData({
      clientId:options.clientId
    })

    this.checkUser();
  },
  checkUser() {
    this.loadData(true);
  },
  getMessageData(clientId, isRefresh) {
    Get(api.Url.message+ clientId)
        .then(res => {
          console.log(res)

          if (res.code === 0) {

            this.setData({
              isFinish: res.data.length < this.data.pageSize //全部加载完毕
            })

            if (isRefresh) {
              this.setData({
                dataList: res.data,
                isRefreshing: false, //关闭下拉刷新
                lock:true
              })
            } else {
              this.setData({
                dataList:this.data.dataList.concat(res.data),
                lock:true
              })

            }

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

  },
  //延迟加载
  lazyLoad(isRefresh) {
    if (this.data.lock){
      this.data.lock = false;
      setTimeout(() => {
        this.getMessageData(
            this.data.clientId,
            isRefresh
        )
      }, 500)
    }else {
      console.log("懒加载锁正被使用")
      if(!isRefresh){
        this.setData({
          pageNum: this.data.pageNum -1
        })
      }
    }

  },
  //加载数据
  loadData(isRefresh) {
    this.getMessageData(
        this.data.clientId,
        isRefresh
    )
  },
  onRefresh() {
    this.setData({
      pageNum: 1,
    })
    this.lazyLoad(true);
  },
  onLoadMore() {
    console.log(this.data.isFinish)
    console.log("加载更多..")
    this.setData({
      pageNum: this.data.pageNum + 1
    })
    this.lazyLoad(false)

  },
})
