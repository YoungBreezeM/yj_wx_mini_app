// pages/views/community/index.js

const {
  Get
} = require('../../utils/api-request.js');
const api = require('../../config/api.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    navHeight:{
      type:Number,
      default:''
    },
    user:{
      type: Object,
      default: null
    },
    categoryList:{
      type:Array,
      default:null
    },
    TabCur:{
      type:Number,
      default:null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lock:true,//请求锁
    startNum: 1,
    pageSize: 10,
    pageNum: 1,
    host:api.ApiBaseUrl
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //切换tab
    tabSelect(e) {
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
        pageNum: 1,
        dataList: [],
      })
      this.loadData(true)
    },
    //延迟加载
    lazyLoad(isRefresh) {
      if (this.data.lock) {
        this.data.lock = false;
        setTimeout(() => {
          this.getCategoryData(
              this.data.TabCur,
              this.data.startNum * this.data.pageNum,
              this.data.pageSize,
              isRefresh
          )
        }, 500)
      } else {
        console.log("懒加载锁正被使用")
        if (!isRefresh) {
          this.setData({
            pageNum: this.data.pageNum - 1
          })
        }
      }

    },
    //加载数据
    loadData(isRefresh) {
      this.getCategoryData(
          this.data.TabCur,
          this.data.startNum * this.data.pageNum,
          this.data.pageSize,
          isRefresh
      )
    },
    //刷新
    onRefresh() {
      console.log(this.data.TabCur)
      this.setData({
        pageNum: 1,
      })
      this.lazyLoad(true);
    },
    //加载更多
    onLoadMore() {
      console.log(this.data.isFinish)
      console.log("加载更多..")
      this.setData({
        pageNum: this.data.pageNum + 1
      })
      this.lazyLoad(false)
    },
    //获取数据
    getCategoryData(categoryId, start, pageSize, isRefresh) {
      Get(api.Url.questionListPage + categoryId + "/" + start + "/" + pageSize)
          .then(res => {
            console.log(res)
            console.log(res.data.list.length < this.data.pageSize)
            if (res.code === 0) {

              this.setData({
                isFinish: res.data.list.length < this.data.pageSize //全部加载完毕
              })

              if (isRefresh) {
                this.setData({
                  dataList: res.data.list,
                  isRefreshing: false, //关闭下拉刷新
                  lock: true
                })
              } else {
                this.setData({
                  dataList: this.data.dataList.concat(res.data.list),
                  lock: true
                })

              }

            }
          })
    },
    toGrade(){
      wx.navigateTo({
        url:"/pages/grade/index"
      })
    },
    toAttention(){
      wx.navigateTo({
        url:"/pages/attention/index"
      })
    }

  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      console.log("community is init")
    },
    ready(){
      this.loadData(true)
    },
    moved: function () { },
    detached: function () { },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      console.log(this.data.TabCur)
      this.loadData(true)
    },
    hide: function () { console.log(this.data.TabCur) },
    resize: function () {  console.log(this.data.TabCur)},
  },

})
