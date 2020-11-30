const app = getApp();
const {
    Post,
    Get
} = require('../../../utils/api-request.js');
const api = require('../../../config/api.js');

Page({
    data: {
        client: null,
        messageCount: null
    },
    onLoad: function () {

    },
    onShow() {
        this.initData();
    },
    initData() {
        //初始化用户信息
        Get(api.Url.getUserInfo, this.data.token)
            .then(res => {
                if (res.code === 0) {
                    this.setData({
                        client: res.data
                    })
                    return res.data;
                }
            })
            .then(client => {
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
    toQuestionPage() {
        if (this.data.client) {
            wx.navigateTo({
                url: '/pages/about/question/index?clientId=' + this.data.client.id
            })
        }
    },
    toMessage() {
        if (this.data.client) {
            wx.navigateTo({
                url: '/pages/message/index?clientId=' + this.data.client.id
            })
        }
    }
})
