import apiResult from './api-result';

let { Config }  = require("../config/api.js")

console.log(Config.AccessKey)

function Get(url,token=null) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'API-Authorization':token?token:Config.AccessKey
      },
      success(res) {
        if (res.data.code === apiResult.StateCode.success) {
          resolve(res.data)
        } else {
          apiResult.requestError(res.data);
        }
      },
      fail(err) {
        apiResult.error('网络连接失败');
        reject(err)
      }
    })
  });
}

function Post(url, data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'API-Authorization': Config.AccessKey
      },
      success(res) {
        if (res.data.code === apiResult.StateCode.success) {
          resolve(res.data)
        } else {
          apiResult.requestError(res.data);
        }
      },
      fail(err) {
        apiResult.error('网络连接失败');
        reject(err)
      }
    })
  });

}

function PostBody(url, data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'API-Authorization': Config.AccessKey
      },
      success(res) {
        if (res.data.code === apiResult.StateCode.success) {
          resolve(res.data)
        } else {
          apiResult.requestError(res.data);
        
        }
      },
      fail(err) {
        apiResult.error('网络连接失败');
        reject(err)
      }
    })
  });

}

function Upload(url, data = {}) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: url,
      filePath: data,
      name: 'file',
      header: {
        'API-Authorization': Config.AccessKey
      },
      formData: {
      },
      success(res) {
        if (JSON.parse(res.data).code=== apiResult.StateCode.success) {
          resolve(JSON.parse(res.data))
        } else {
          apiResult.requestError(JSON.parse(res.data));
        
        }
      },
      fail(err) {
        apiResult.error('网络连接失败');
        reject(err)
      }
    })
  });

}

function Delete(url, data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: 'DELETE',
      header: {
        'Content-Type': 'application/json',
        'API-Authorization': Config.AccessKey
      },
      success(res) {
        if (res.data.code === apiResult.StateCode.success) {
          resolve(res.data)
        } else {
          apiResult.requestError(res.data);
       
        }
      },
      fail(err) {
        apiResult.error('网络连接失败');
        reject(err)
      }
    })
  });
}

function Put(url, data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: 'PUT',
      header: {
        'Content-Type': 'application/json',
        'API-Authorization': Config.AccessKey
      },
      success(res) {
        if (res.data.code === apiResult.StateCode.success) {
          resolve(res.data)
        } else {
          apiResult.requestError(res.data);
          
        }
      },
      fail(err) {
        apiResult.error('网络连接失败');
        reject(err)
      }
    })
  });

}

module.exports = {
  Get,
  Post,
  PostBody,
  Delete,
  Put,
  Upload
}
