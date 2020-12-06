// pages/info/index.js
const {
  Post,
  Get
} = require('../../../utils/api-request.js');
const api = require('../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryList:["问题列表"],
    clientId:null,
    TabCur:0,
    startNum:1,
    pageSize:10,
    pageNum:1,
    dataList:[],
    isRefreshing: false, //是否下拉刷新状态
    isFinish: false, //是否加载完全部数据
    host: api.ApiBaseUrl,
    fromId:null,
    attention:null,

  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
    })
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
  addAttention(){
    Post(api.Url.addAttention,{
      fromId:this.data.fromId,
      toId: this.data.client.id
    }).then(res=>{
      if(res.code===0){
        console.log(res)
        this.setData({
          attention:!this.data.attention
        })
      }
    })
  },
  checkUser() {

    if (!wx.getStorageSync("userInfo")) {
      wx.redirectTo({
        url: '/pages/login/index',
      })
    } else {
      this.setData({
        userInfo: wx.getStorageSync("userInfo")
      })
    }

    //初始用户信息
    Get(api.Url.getUserInfo)
        .then(res => {
          if (res.code === 0) {

            this.setData({
              fromId: res.data.client.id,
            })
            this.loadData(true)
          }
        })
  },
  getCategoryData(fromId,clientId, start, pageSize, isRefresh) {
    Get(api.Url.getQuestionsByClientId+fromId+"/"+ clientId + "/" + start + "/" + pageSize)
        .then(res => {
          console.log(res)
          console.log(res.data.list.length < this.data.pageSize)
          this.setData({
            client:res.data.client,
            attention: res.data.attention
          })

          if (res.code === 0) {

            this.setData({
              isFinish: res.data.list.length < this.data.pageSize //全部加载完毕
            })

            if (isRefresh) {
              this.setData({
                dataList: res.data.list,
                isRefreshing: false, //关闭下拉刷新
                lock:true
              })
            } else {
              this.setData({
                dataList:this.data.dataList.concat(res.data.list),
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
    this.checkUser();
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
        this.getCategoryData(
            this.data.fromId,
            this.data.clientId,
            this.data.startNum * this.data.pageNum,
            this.data.pageSize,
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
    this.getCategoryData(
        this.data.fromId,
        this.data.clientId,
        this.data.startNum * this.data.pageNum,
        this.data.pageSize,
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
