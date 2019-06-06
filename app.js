//app.js
App({
  onLaunch: function () {
    //更新
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      //console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          updateManager.applyUpdate()
          // if (res.confirm) {
          //   // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            
          // }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var ons = wx.getStorageSync('on') || ''
    //console.log(ons)
    if (ons == 'on') {
      wx.redirectTo({
        url: 'pages/index/index',
      })
    } else {
      wx.redirectTo({
        url: 'pages/start/start',
      })
    };
    // 登录
    wx.login({
      success: res => {
        //获取code
        //console.log(res)
        wx.setStorageSync('on', 'on');
        wx.request({
          //获取openid接口
          url: 'https://www.uear.net/ajax/getopenid.php',
          data: {
            appid: 'wx6763195d553792b1',
            secret: '0aa1993d7d2fac371a4c5d0169b06c11',
            code: res.code
          },
          method: 'GET',
          success: function (res) {
            wx.setStorageSync('openid', res.data.openid)
          },
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})