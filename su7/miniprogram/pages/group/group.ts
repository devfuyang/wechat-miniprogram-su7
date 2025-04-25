// pages/group/group.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text1:'欢迎加入',
    text2:'MiSU米蜀车友会',
    text3:'觉得好用的话',
    text4:'打赏点钱吧！',
    image1:'/images/qrcode1.png',
    image2:'/images/qrcode2.png',
    //url: 'http://localhost:8080/',
    url: 'https://www.dreamvr.xyz/',
    hasInfo:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // const app = getApp();
    // app.downloadAndSaveFont.then(() => {
    //   if (app.globalData.fontPath) {
    //     const fs = wx.getFileSystemManager();
    //     fs.readFile({
    //       filePath: app.globalData.fontPath,
    //       success: (res) => {
    //         wx.loadFontFace({
    //           family: 'HappyZcool-2016',
    //           source: `data:application/x-font-ttf;base64,${wx.arrayBufferToBase64(res.data)}`,
    //           success: () => {
    //             console.log('字体加载成功');
    //           },
    //           fail: (err) => {
    //             console.error('字体加载失败:', err);
    //           }
    //         });
    //       },
    //       fail: (err) => {
    //         console.error('读取字体文件失败:', err);
    //       }
    //     });
    //   }
    // }).catch((err) => {
    //   console.error('字体下载或保存失败:', err);
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var self = this;
    wx.request({
      url: this.data.url+'api/findmishubywxid',
      method: 'GET',
      data: {
        wxid: wx.getStorageSync('token'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded' // 确保设置正确
      },
      success: (res) => {
        //console.log(res);
        if (res.data.success) {
          self.setData({
            hasInfo: true,
          });
        } else {
          self.setData({
            hasInfo: false
          });
        }
      }
    });
    wx.request({
      url: this.data.url + 'api/describewx',
      success: (res) => {
        //console.log(res.data)
        this.setData({
          text1: res.data.text1,
          text2: res.data.text2,
          text3: res.data.text3,
          text4: res.data.text4,
          image1: this.data.url+'uploadFile/su7/'+res.data.image1+'?t='+Date.now(),
          image2: this.data.url+'uploadFile/su7/'+res.data.image2+'?t='+Date.now(),
        });
      },
      fail: (res) => {
        console.log(res.errMsg)
      }
    });

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})