// pages/license-plate/license-plate.ts
Component({
  data: {
    plateChars: ['川', '', '', '', '', '', '', ''],
    showProvinceKey: false,
    provinces: ["京", "津", "渝", "沪", "冀", "晋", "辽", "吉", "黑", "苏", "浙", "皖", "闽", "赣", "鲁", "豫", "鄂", "湘", "粤", "琼", "川", "贵", "云", "陕", "甘", "青", "蒙", "桂", "宁", "新", "藏"],
    alphaNumKeys: [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
      ["Z", "X", "C", "V", "B", "N", "M", "x"]
    ].flat(),
    showAlphaNumKey: true,
    isValid: false,
    activeIndex: 1,
    hasInfo: false,
    url: 'https://www.dreamvr.xyz/',
  },

  methods: {
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
    onShow(){
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
    },
    onCharTap(e: any) {
      const index = e.currentTarget.dataset.index;
      //console.log(index);
      this.setData({ activeIndex: index }, () => {
        console.log('activeIndex 更新后的值:', this.data.activeIndex);
      });
      if (index === 0) {
        this.setData({
          showProvinceKey: true,
          showAlphaNumKey: false
        });
      } else {
        this.setData({
          showProvinceKey: false,
          showAlphaNumKey: true
        });
      }
    },

    selectProvince(e: any) {
      const province = e.currentTarget.dataset.value;
      this.setData({
        'plateChars[0]': province,
        isValid: this.checkValidity(),
        showProvinceKey: false,
        showAlphaNumKey: true
      });
    },

    selectKey(e: any) {
      const key = e.currentTarget.dataset.value;
      const index = this.data.plateChars.findIndex(c => !c);

      if (key === 'O' || key === 'I') {
        return; // 如果是 O 或 I，直接返回，不执行后续逻辑
      }

      if (key === 'x') {
        let lastIndex = this.data.plateChars.length - 1;
        while (lastIndex >= 0 && this.data.plateChars[lastIndex] === '') {
          lastIndex--;
        }
        if (lastIndex >= 0) {
          this.setData({
            [`plateChars[${lastIndex}]`]: '',
            isValid: this.checkValidity(),
            activeIndex: lastIndex,
            showProvinceKey: lastIndex === 0,
            showAlphaNumKey: lastIndex !== 0
          });
        }
      } else if (index !== -1) {
        this.setData({
          [`plateChars[${index}]`]: key
        }, () => {
          const newIndex = this.data.plateChars.findIndex(c => !c);
          this.setData({
            isValid: this.checkValidity(),
            activeIndex: index,  // 保持当前输入框激活
            showProvinceKey: newIndex === 0,
            showAlphaNumKey: newIndex !== 0 && newIndex !== -1
          });
        });
      }
    },

    onSearch() {
      var self = this;
      if (self.data.isValid) {
        const plate = self.data.plateChars.join('');
        //wx.showToast({ title: `搜索车牌：${plate}` });
        wx.navigateTo({
          url: '/pages/main/main?carnum='+plate//页面路径
        })
      }

    },

    checkValidity() {
      const chars = this.data.plateChars;
      return chars.every((c, i) => i === 0 ? c.length > 0 : /^[A-Z0-9]$/.test(c));
    }
  }
})