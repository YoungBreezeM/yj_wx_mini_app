function requestError(data) {
  wx.showToast({
    title: data.msg,
    duration:1200,
    mask:true,
    image:'/static/images/prompt/fail.png'  
  });

  if (data.code === 500) {
    // let pages = getCurrentPages();
    // let current_page = pages[pages.length - 1].route
    // wx.navigateTo({
    //   url: "/pages/admin/login/index"
    // })
  }
}

function error(msg) {
  wx.showToast({
    title: msg,
    duration:1500,
    mask:true,
    image:'/static/images/prompt/fail.png'  
  });
}
function warn(msg) {
  wx.showToast({
    title: msg,
    duration:1500,
    mask:true,
    image:'/static/images/prompt/warn.png', 
  });
}
function success(msg) {
  wx.showToast({
    title: msg,
    duration:2000,
    mask:true,
    image:'/static/images/prompt/success.png' 
  });
}

const StateCode = {
  success: 0,
  error: 500,
}

module.exports = {
  requestError,
  error,
  warn,
  success,
  StateCode,
}