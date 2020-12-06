// views/my/index.js
const {
  Get
} = require('../../utils/api-request.js');
const api = require('../../config/api.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    user:{
      type:Object,
      default:''
    },
    messageCount:{
      type: Number,
      default: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    waterWave:api.ImageServer.waterWave
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toQuestionPage() {
      if (this.data.user) {
        wx.navigateTo({
          url: '/pages/my/question/index?clientId=' + this.data.user.client.id
        })
      }
    },
    toMessage() {
      if (this.data.user) {
        wx.navigateTo({
          url: '/pages/my/message/index?clientId=' + this.data.user.client.id
        })
      }
    }
  }
})
