// app.ts
App<IAppOption>({
  globalData: {
    fontPath: ''
  },
  onLaunch() {
    this.overShare();
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: 'https://localhost:8080/wxlogin',
            method: 'POST',
            data: { code: res.code },
            success: (res) => {
              wx.setStorageSync('token', res.data.token);
            }
          });
        }
      }
    });
  },
  overShare:function() {
    // 监听路由切换
    wx.onAppRoute(function(res) {
      console.log('route',res)
      let pages = getCurrentPages()
      let view = pages[pages.length - 1]
      if(view) {
        wx.showShareMenu({
          withShareTicket:true,
          menus:['shareAppMessage','shareTimeline']
        })
      }
    })
  }
});