Page({
  data: {
    hasInfo: false, // 假设用户初始没有信息
    licensePlate1: '',
    licensePlate: '',
    owner: '',
    version: '',
    color: '',
    interior: '',
    wheels: '',
    group: '',
    gender:'',
    //url: "http://localhost:8080/",
    //url: 'https://www.dreamvr.xyz/',
    url: 'https://www.dreamvr.xyz/',
  },
  onLoad: function (options) {
    //console.log(options);
    var self = this;
    self.setData({
      hasInfo: true,
      licensePlate1: options.carnum.slice(0, 2),
      licensePlate: options.carnum.slice(2),
    });
    wx.request({
      url: this.data.url+'api/findmishu',
      method: 'GET',
      data: {
        carnumber: options.carnum,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded' // 确保设置正确
      },
      success: (res) => {
        //console.log(res);
        if (res.data.success) {
          self.setData({
            hasInfo: true,
            licensePlate1: res.data.data.carnum.slice(0, 2),
            licensePlate: res.data.data.carnum.slice(2),
            owner: res.data.data.name,
            version: res.data.data.version,
            color: res.data.data.color,
            interior: res.data.data.interior,
            wheels: res.data.data.hub,
            group: res.data.data.belong,
            gender:res.data.data.reserve2
          });
        } else {
          self.setData({
            hasInfo: false
          });
        }
      }
    });
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
  handleButtonClick() {
    wx.navigateBack({
      delta: 1 // 返回的页面层数，1 表示返回上一个页面
    });
  },
  handleAddVehicle() {
    // 添加车辆的逻辑
    wx.navigateTo({
      url: '/pages/edit/edit' //页面路径
   })
  },
});