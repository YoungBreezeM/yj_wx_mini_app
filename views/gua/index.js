// views/gua/index.js
const createGua = require('../../utils/bugua.js');
const api = require('../../config/api.js');
const {
  Post
} = require('../../utils/api-request.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    gua: ["乾", "坎", "艮", "震", "巽", "离", "坤", "兑"],
    guaGraph: [
      [1, 1, 1],
      [0, 1, 0],
      [1, 0, 0],
      [0, 0, 1],
      [1, 1, 0],
      [1, 0, 1],
      [0, 0, 0],
      [0, 1, 1]
    ],
    top:null,
    bottom:null,
    cacheGuaList: [],//本卦
    cacheGua: [],//变卦
    count:0,
    cacheGuaBottom:[],
    cacheGuaTop:[]

  },

  /**
   * 组件的方法列表
   */
  methods: {
    reSetData(){
      this.setData({
        top:null,
        bottom:null,
        cacheGuaList: [],//本卦
        cacheGua: [],//变卦
        count:0,
        cacheGuaBottom:[],
        cacheGuaTop:[]
      })
    },
    playSound(src) {
      const innerAudioContext = wx.createInnerAudioContext()
      innerAudioContext.autoplay = true
      //这两句话话一定要在一起，不然ios手机上会有时间放不出声音
      innerAudioContext.src = src
      innerAudioContext.onPlay(() => {

      });
      innerAudioContext.onError((res) => {
        console.log(res)
      })
    },
    toBuGua(){
      console.log(this.data.count)
      if(this.data.count===0){
        this.reSetData();
      }

      this.data.count++;
      this.playSound('/static/audio/coin.mp3');
      let oneGua = createGua.createdOneGua();

      this.data.cacheGuaList.unshift(oneGua.Type);
      this.data.cacheGua.unshift(oneGua.TF);

      if (this.data.cacheGuaBottom.length < 3) {
        this.data.cacheGuaBottom.unshift(oneGua.TF);
      } else {
        this.data.cacheGuaTop.unshift(oneGua.TF)
      }
      if (this.data.count > 5) {
        this.data.count = 0;
        console.log(this.data.cacheGuaTop, this.data.cacheGuaBottom);

        this.data.guaGraph.forEach((item, index) => {
          if (item.toString() === this.data.cacheGuaTop.toString()) {
            this.data.top = index;
          }

          if (item.toString() === this.data.cacheGuaBottom.toString()) {
            this.data.bottom = index;
          }

        })

        this.drawLots();

      }
    },
    //抽签
    drawLots() {

      this.setData({
        top: this.data.top,
        bottom: this.data.bottom
      });

      Post(api.Url.computeGua, {
        top: this.data.guaGraph[this.data.top],
        bottom: this.data.guaGraph[this.data.bottom],
        changeGua: this.data.cacheGuaList
      }).then(res => {
        if (res.code === 0) {
          console.log(res)
          this.setData({
            baseGua: res.data.baseGua
          })

          if (res.data.yao) {
            this.setData({
              yao: res.data.yao
            })
          }
        }
      })

      console.log(this.data.top)
      console.log(this.data.bottom)
      console.log(this.data.cacheGua);
      console.log(this.data.cacheGuaList)


    },
    toDetail(){
      console.log(this.data.yao)
      console.log(this.data.baseGua)
      if(this.data.yao){
        wx.navigateTo({
          url:'/pages/guaDetail/index?baseGuaId='+this.data.baseGua.id+"&yaoId="+this.data.yao.id
        })
      }else {
        wx.navigateTo({
          url:'/pages/guaDetail/index?baseGuaId='+this.data.baseGua.id+"&yaoId="+null
        })
      }

    }
  }
})
