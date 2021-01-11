
//const ApiBaseUrl = 'https://www.geekera.cn';//生产上
const ApiBaseUrl = 'http://10.2.44.228:8089/wx';//本地
// const ApiBaseUrl = 'https://test.geekera.cn';//测试

const Config = {
  AccessKey: null
}

//图片配置
const ImageServer = {
  bg: ApiBaseUrl +"/static/pg.png",//背景图片
  noContentImage: "https://cdn.fuzui.net/basis/nocontent.png",  //无内容
  waterWave: "https://cdn.fuzui.net/tmp/wave.gif" //水波纹
}

//数据接口
const Url = {
  login: ApiBaseUrl + '/client/login/' ,
  setUserInfo: ApiBaseUrl + '/client/login/setUserInfo',
  computeGua: ApiBaseUrl + '/gua/computed/',
  predictionCategory: ApiBaseUrl + "/prediction/category",
  prediction: ApiBaseUrl +"/prediction",
  communityCategory: ApiBaseUrl + "/communityCategory",
  getUserInfo:ApiBaseUrl + "/client/userInfo",
  question:ApiBaseUrl + "/question",
  questionListPage: ApiBaseUrl + "/question/",
  uploadImage: ApiBaseUrl + "/upload/image",
  getQuestionAnswers: ApiBaseUrl + "/question/",
  addAnswerByQuestion: ApiBaseUrl + "/answer",
  getQuestionsByClientId: ApiBaseUrl + "/client/questions/",
  addAttention: ApiBaseUrl + "/attention",
  baseGua :ApiBaseUrl + "/gua/baseGua",
  links: ApiBaseUrl+ "/links",
  wxImage: ApiBaseUrl + "/wxImages/",
  message: ApiBaseUrl + "/message/",
  messageCount: ApiBaseUrl + "/message/"+"count/",
  grade: ApiBaseUrl + "/grade/",
  getOneBaseGua: ApiBaseUrl + "/gua/baseGua/",
  getOneYao : ApiBaseUrl + "/gua/yao/",
  addIntegral: ApiBaseUrl + "/client/addIntegral/"
}

module.exports = {
  Url,
  ImageServer,
  Config,
  ApiBaseUrl
}
