//index.js
//获取应用实例
const app = getApp()
const {
    Post,
    Get
} = require('../../utils/api-request.js');
const api = require('../../config/api.js');

Page({
    data: {
        active: 1,
        winHeight: wx.getSystemInfoSync().windowHeight,
        isRefreshing: false, //是否下拉刷新状态
        isFinish: false, //是否加载完全部数据
        dataList: [],
        navHeight: app.globalData.CustomBar,
        userInfo: null,
        show: false,
        categoryList: [],
        TabCur: null,
        scrollLeft: 0,
        startNum: 1,
        pageSize: 10,
        pageNum: 1,
        lock: true,
        host: api.ApiBaseUrl,
        token:null
    },
    tabSelect(e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
            pageNum: 1,
            dataList: []
        })

        this.loadData(true);

    },
    onClose() {
        this.setData({
            show: false
        });

    },
    onChange(event) {
        wx.showToast({
            title: `切换到标签 ${event.detail.name}`,
            icon: 'none',
        });
    },
    textareaAInput(e) {
        this.setData({
            textareaAValue: e.detail.value
        })
    },
    onLoad() {
      console.log(wx.getStorageSync("token"))
      api.Config.AccessKey = wx.getStorageSync("token")
        //检查用户信息
         this.checkUser();
      
    },
    onShow() {
      api.Config.AccessKey = wx.getStorageSync("token")
      //检查用户信息
      this.checkUser();
    },
    initData() {
        //获取导航分类
        Get(api.Url.communityCategory)
            .then(res => {
                console.log(res)
                if (res.code === 0) {
                    this.setData({
                        categoryList: res.data,
                        TabCur: res.data[0].id
                    })

                    this.setData({
                        pageNum: 1,
                        dataList: []
                    })
                    this.loadData(true)
                }
            })
    },
    checkUser() {
       wx.getStorage({
         key: 'token',
         success: (res)=> {
           console.log(res)
           if(!res.data){
             wx.redirectTo({
               url: '/pages/login/index',
             })
           }else{
             this.setData({
               userInfo:wx.getStorageSync("userInfo"),
               token :res.data
             })
             this.initData()
           }
         },
       })
    },
    pushInfo() {
        wx.navigateTo({
            url: '/pages/question/index',
        })
    },
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
    //延迟加载
    lazyLoad(isRefresh) {
        if (this.data.lock){
            this.data.lock = false;
            setTimeout(() => {
                this.getCategoryData(
                    this.data.TabCur,
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
            this.data.TabCur,
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
    toAttention(){
      wx.navigateTo({
        url: '/pages/attention/index',
      })
    }
})