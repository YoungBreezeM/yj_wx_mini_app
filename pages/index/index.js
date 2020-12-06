//index.js
//获取应用实例


const app = getApp()
const {
    Get
} = require('../../utils/api-request.js');
const api = require('../../config/api.js');

Page({
    data: {
        PageCur: null,
        active:'community',
        user:null,
        categoryList: [],
        links:[],
        routers:{},
        messageCount:null,
        navHeight: app.globalData.CustomBar,
        show: false,
        token: null
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


    },
    onShow() {
        console.log("-------------> show")
        let pageCur = wx.getStorageSync("PageCur");
        if(pageCur){
            console.log(pageCur)
            this.initData(pageCur);
        }else {
            console.log(this.data.active)
            this.initData(this.data.active);
        }

    },
    initClient(){
        //初始化客户端
        Get(api.Url.getUserInfo)
            .then(res => {
                if (res.code === 0) {
                    this.setData({
                        user: res.data
                    })
                    return res.data.client;
                }
            })
            .then(client=>{
                Get(api.Url.messageCount + client.id)
                    .then(res => {
                        console.log(res)
                        if (res.code === 0) {
                            this.setData({
                                messageCount: res.data.count
                            })
                        }
                    })
            })
    },
    initCommunity(active){
        //初始化导航分类
        console.log("=======init "+active+"======")
        Get(api.Url.communityCategory)
            .then(res => {
                console.log(res)
                if (res.code === 0) {
                    this.setData({
                        categoryList: res.data,
                        PageCur:active
                    })
                    wx.setStorageSync("PageCur",active);
                }
            })
    },
    initResolve(active){
        console.log("=======init "+active+"======")
        //获取链接
        Get(api.Url.links)
            .then(res=>{
                if(res.code===0){
                    console.log(res)
                    this.setData({
                        links:res.data,
                        PageCur:active
                    })
                    wx.setStorageSync("PageCur",active);
                }
            })
    },
    initMy(active){
        console.log("=======init "+active+"======")
        this.setData({
            PageCur:active
        })
        wx.setStorageSync("PageCur",active);
    },
    initGua(active){
        console.log("=======init "+active+"======")
        this.setData({
            PageCur:active
        })
        wx.setStorageSync("PageCur",active);
    },
    async initData(active) {

        //初始化请求密钥
        api.Config.AccessKey = wx.getStorageSync("token")

        this.initClient()


        let routers ={
            "community":this.initCommunity,
            "resolve":this.initResolve,
            "my":this.initMy,
            "gua": this.initGua
        }

        this.setData({
            routers:routers
        })

        routers[active]&&routers[active](active);

    },
    addQuestion(){
        wx.navigateTo({
            url: "/pages/question/index"
        })
    },
    NavChange(e) {
        this.setData({
            PageCur: e.currentTarget.dataset.cur
        })
        let routers = this.data.routers;
        let active = e.currentTarget.dataset.cur
        routers[active]&&routers[active](active);

    },
})
