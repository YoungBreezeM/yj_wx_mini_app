// pages/webview/index.js
const {
    Get
} = require('../../utils/api-request.js');

const api = require('../../config/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: null,
        startTime:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            src: options.src
        })
        Get(api.Url.getUserInfo)
            .then(res => {
                if (res.code === 0) {
                    this.setData({
                        client: res.data.client
                    })
                }
            })
        this.setData({
            startTime:new Date()
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
        let endTime = new Date();
        console.log(endTime-this.data.startTime)

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
