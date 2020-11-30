// components/article-list/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    client: {
      type: Object,
      default: ''
    },
    question: {
      type: Object,
      default: ""
    },
    imgList:{
      type: Array,
      default: ""
    },
    isCard:{
      type:Boolean,
      default:false
    },
    isEditor:{
      type:Boolean,
      default:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    tabSelect(e) {
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id - 1) * 60
      })
    },
    onClose() {
      this.setData({
        show: false
      });
    },
    ViewImage(e) {
      console.log(this.data.imgList)
      console.log( e.currentTarget.dataset.url)
      wx.previewImage({
        urls: this.data.imgList,
        current: e.currentTarget.dataset.url
      });
    },
    toDetails(e){
      wx.navigateTo({
        url: '/pages/details/index?questionId=' + e.currentTarget.dataset.id,
      })
      console.log(e.currentTarget.dataset.id)
    },
    toQuestionEd(e){
      let isEditor = e.currentTarget.dataset.iseditor;
      if(isEditor){
        wx.navigateTo({
          url: '/pages/questioneditor/index?questionId=' + e.currentTarget.dataset.id,
        })
      }
      console.log(e.currentTarget.dataset)
    },
    toUserInfo(e) {
      console.log(e.currentTarget.dataset.id)
      wx.navigateTo({
        url: '/pages/info/index?clientId='+e.currentTarget.dataset.id,
      })
    },
  }
});
