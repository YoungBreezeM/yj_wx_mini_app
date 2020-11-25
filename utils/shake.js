let shakeInfo = {
  openFlag: false,  // 是否开启摇一摇，如果是小程序全局监听摇一摇，这里默认为true
  shakeSpeed: 50,  //设置阈值,越小越灵敏
  shakeStep: 2000,  //摇一摇成功后间隔
  lastTime: 0,  //此变量用来记录上次摇动的时间
  x: 0,
  y: 0,
  z: 0,
  lastX: 0,
  lastY: 0,
  lastZ: 0, //分别记录对应 x、y、z 三轴的数值和上次的数值
};

//开启摇一摇
function openShakeEvent() {
  shakeInfo.openFlag = true;
}

//关闭摇一摇
function closeShakeEvent() {
  shakeInfo.openFlag = false;
}

//摇一摇成功
function shakeOk() {
  closeShakeEvent();
}

/**
 * 判断是否为摇一摇
 */
function shake(acceleration, successCallback) {
  if (!shakeInfo.openFlag) {
    return;
  }

  const nowTime = new Date().getTime(); //记录当前时间
  //如果这次摇的时间距离上次摇的时间有一定间隔 才执行
  if (nowTime - shakeInfo.lastTime > 100) {
    const diffTime = nowTime - shakeInfo.lastTime; //记录时间段
    shakeInfo.lastTime = nowTime; //记录本次摇动时间
    shakeInfo.x = acceleration.x; //获取 x 轴数值
    shakeInfo.y = acceleration.y; //获取 y 轴数值
    shakeInfo.z = acceleration.z; //获取 z 轴数值
    //计算摇一摇的速度
    const speed = Math.abs(shakeInfo.x + shakeInfo.y + shakeInfo.z - shakeInfo.lastX - shakeInfo.lastY - shakeInfo.lastZ) / diffTime * 10000;
    if (speed > shakeInfo.shakeSpeed) { //如果计算出来的摇一摇幅度足够大，那么认为用户摇一摇成功
      successCallback();
    }
    //赋值，为下一次计算做准备
    shakeInfo.lastX = shakeInfo.x;
    shakeInfo.lastY = shakeInfo.y;
    shakeInfo.lastZ = shakeInfo.z;
  }
}


module.exports = {
  openShakeEvent: openShakeEvent,
  closeShakeEvent: closeShakeEvent,
  shake: shake,
  shakeOk: shakeOk
}
