//获取应用实例
const app = getApp();

const {
    Post,
    Get,
    Put
} = require('../../utils/api-request.js');
const api = require('../../config/api.js');
Page({
    data: {
        isComment: false,
        textareaAValue: null,
        noContentImage: api.ImageServer.noContentImage,
        questionAnswers:null,
        host:api.ApiBaseUrl,
        client:{
            nickName:'',
            avatarUrl:''
        },
        questionId:null
    },
    onLoad(e) {
        console.log(e)
        if(e.questionId){
            this.setData({
                questionId:e.questionId
            })
            this.getQuestionAnswer(e.questionId)

            this.checkUser();
        }
    },
    checkUser() {
        //初始用户信息
        Get(api.Url.getUserInfo)
            .then(res => {
                if (res.code === 0) {
                    this.setData({
                        client:res.data.client
                    })
                }
            })
    },
    getQuestionAnswer(questionId){
      Get(api.Url.getQuestionAnswers+questionId)
          .then(res=>{
              console.log(res)
              if(res.code===0){
                  this.setData({
                    questionAnswers:res.data
                  })

              }
          })
    },
    addAnswerQuestion(){

        let data = {
            answer:{
                clientId:this.data.client.id,
                content:this.data.textareaAValue,
                questionsId: this.data.questionAnswers.questionClient.questions.id
            },
            questions:this.data.questionAnswers.questionClient.questions,
            client:this.data.client,

        }
        console.log(data)

        if (!this.data.client) {
            wx.showToast({
                title: '用户未登录',
                icon: 'none',
                duration: 1000,
                mask: true
            })
            return;
        }

        if (!this.data.textareaAValue) {
            wx.showToast({
                title: '发布内容不能为空',
                icon: 'none',
                duration: 1000,
                mask: true
            })
            return;
        }

        if (this.data.questionAnswers.questionClient.questions.integral<=0) {
            wx.showModal({
                title:'提示',
                content:'该问题积分已经空，是否评论',
                success:(res)=>{
                    console.log(res)
                    if(res.confirm){
                        console.log('用户点击了确定')
                        Put(api.Url.addAnswerByQuestion,data).then(res=>{
                            if(res.code===0){
                                this.setData({
                                    isComment: false
                                })
                                this.getQuestionAnswer(this.data.questionId)
                            }
                        })
                    }
                }
            })

        }else {
            //上传
            Put(api.Url.addAnswerByQuestion,data).then(res=>{
                if(res.code===0){
                    this.setData({
                        isComment: false
                    })
                    this.getQuestionAnswer(this.data.questionId)
                }
            })
        }


    },
    ViewImage(e) {
        let rs =[]
        this.data.questionAnswers.questionClient.imgList.forEach(item=>{
            rs.push(api.ApiBaseUrl+item);
        })
        console.log( e.currentTarget.dataset.url)
        wx.previewImage({
            urls: rs,
            current: e.currentTarget.dataset.url
        });
    },
    addComment() {
        this.setData({
            isComment: true
        })


    },
    pushComment() {
        this.addAnswerQuestion()
    },
    textareaAInput(e) {
        this.setData({
            textareaAValue: e.detail.value
        })
    },
    toTagPage(event) {
        wx.navigateTo({
            url: '../tag/index?id=' + event.currentTarget.dataset.id
        });
    }
});
