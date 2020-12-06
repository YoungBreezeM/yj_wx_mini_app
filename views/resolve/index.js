// views/resolve/index.js
const {formatTime} = require('../../utils/util')
const {
  Get,
  Post
} = require('../../utils/api-request.js');
const api = require('../../config/api.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    links:{
      type:Array,
      default:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    startTime:null,
    modalName:null,
    duringTime:null,
    timeLong:null,
    user:null,
    addIntegral:0
  },
  /**
   * 组件生命周期
   * */
  lifetimes:{
    attached() {
      console.log(this.data.startTime)
      //初始用户信息
      Get(api.Url.getUserInfo)
          .then(res => {
            if (res.code === 0) {
              this.setData({
                user: res.data,
              })
            }
          })

    },
    moved: function () {console.log("小程序移除") },
    detached: function () {console.log("小程序销毁") },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      console.log("resolve show")
      if(this.data.startTime){
        let endTime = new Date();
        let duringTime = formatTime(endTime)+"~"+formatTime(this.data.startTime)
        let timeLong = Math.round((endTime-this.data.startTime)/60000);


        if(timeLong>=15&&timeLong<=30){
          this.setData({
            addIntegral:2
          })
        }else if(timeLong>30&&timeLong<=60){
          this.setData({
            addIntegral:5
          })
        }else if(timeLong>60&&timeLong<=120) {
          this.setData({
            addIntegral:10
          })
        }else if(timeLong>120&&timeLong<=240){
          this.setData({
            addIntegral:15
          })
        }else if (timeLong>240) {
          this.setData({
            addIntegral:20
          })
        }

        this.data.user.client.integral = this.data.user.client.integral+this.data.addIntegral

        Post(api.Url.addIntegral,this.data.user.client)
            .then(res=>{
              if(res.code===0){

              }
            })

        this.setData({
          modalName:"Modal",
          duringTime:duringTime,
          timeLong:timeLong
        })
        this.data.startTime = null
      }

    },
    hide: function () {
      console.log("开始计时")
      this.setData({
        startTime:new Date()
      })
    },
    resize: function () { },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏提示框
    hideModal() {
      this.setData({
        modalName: null
      })
    },

  }
})
