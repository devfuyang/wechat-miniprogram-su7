Page({
  data: {
    nickname: '',
    versions: [],
    selectedVersion: '',
    colors: [],
    selectedColor: '',
    interiors: [],
    selectedInterior: '',
    wheelsList: [],
    selectedWheels: '',
    groups: [],
    selectedGroup: '',
    versionidd: '',
    //url: "http://localhost:8080/",
    //url: 'https://www.dreamvr.xyz/',
    url: 'https://www.dreamvr.xyz/',
    plateChars1: ['川', ''],
    plateChars2: ['', '', '', '', '', ''],
    plateChars: '',
    showProvinceKey: false,
    showAlphaNumKey: false,
    provinces: ["京", "津", "渝", "沪", "冀", "晋", "辽", "吉", "黑", "苏", "浙", "皖", "闽", "赣", "鲁", "豫", "鄂", "湘", "粤", "琼", "川", "贵", "云", "陕", "甘", "青", "蒙", "桂", "宁", "新", "藏"],
    alphaNumKeys: [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
      ["Z", "X", "C", "V", "B", "N", "M", "x", "确认"]
    ].flat(),
    isValid: false,
    activeIndex: -1,
    selectedGender:'',
  },
  onLoad: function () {
    this.fetchVersions();    // 从云端获取版本数据
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
  onShow() {
    var self = this;
    wx.request({
      url: this.data.url + 'api/findmishubywxid',
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
          let originalArray1 = ['', ''];
          let str1 = res.data.data.carnum.slice(0, 2);
          let strArray1 = str1.split('');
          for (let i = 0; i < strArray1.length; i++) {
            originalArray1[i] = strArray1[i];
          }
          let originalArray2 = ['', '', '', '', '', ''];
          let str2 = res.data.data.carnum.slice(2);
          let strArray2 = str2.split('');
          for (let i = 0; i < strArray2.length; i++) {
            originalArray2[i] = strArray2[i];
          }
          self.setData({
            hasInfo: true,
            plateChars1:originalArray1,
            plateChars2:originalArray2,
            nickname: res.data.data.name,
            selectedVersion: res.data.data.version,
            selectedColor: res.data.data.color,
            selectedInterior: res.data.data.interior,
            selectedWheels: res.data.data.hub,
            selectedGroup: res.data.data.belong,
            selectedGender: res.data.data.reserve2,
          });
          if(res.data.data.version == 'SU7 标准'){
            this.fetchDataByVersionId('1');
          }else if(res.data.data.version == 'SU7 Pro'){
            this.fetchDataByVersionId('2');
          }else if(res.data.data.version == 'SU7 Max'){
            this.fetchDataByVersionId('3');
          }else if(res.data.data.version == 'SU7 Ultra'){
            this.fetchDataByVersionId('4');
          }  
        } else {
          self.setData({
            hasInfo: false
          });
        }
      }
    });
  },
  fetchVersions() {
    // 模拟从云端获取版本数据，实际使用时需要替换为真实的接口调用
    wx.request({
      url: this.data.url + 'api/car_version',
      success: (res) => {
        this.setData({
          versions: res.data
        });
      }
    });
  },
  fetchDataByVersionId(versionId: string) {
    // 根据版本 ID 从云端获取颜色、内饰、轮毂和归属群数据
    //console.log(`${this.data.url}api/color_config?versionId=${versionId}`);
    wx.request({
      url: `${this.data.url}api/color_config?versionId=${versionId}`,
      success: (res) => {
        this.setData({
          colors: res.data
        });
      }
    });
    wx.request({
      url: `${this.data.url}api/interior_config?versionId=${versionId}`,
      success: (res) => {
        this.setData({
          interiors: res.data
        });
      }
    });
    wx.request({
      url: `${this.data.url}api/wheel_config?versionId=${versionId}`,
      success: (res) => {
        if (this.data.selectedColor !== '璀璨洋红') {
          //console.log('不是璀璨洋红');
          this.setData({
            wheelsList: res.data.filter((wheel: string) => wheel !== '20英寸米型 璀璨洋红')
          });
        } else{
          this.setData({
            wheelsList: res.data
          });
        }
      }
    });
    wx.request({
      url: `${this.data.url}api/group_config?versionId=${versionId}`,
      success: (res) => {
        this.setData({
          groups: res.data
        });
      }
    });
  },
  handleNicknameInput(e: any) {
    this.setData({
      nickname: e.detail.value
    });
  },
  handleVersionChange(e: any) {
    const selectedVersion = this.data.versions[e.detail.value];
    var versionidd = parseInt(e.detail.value) + 1;
    this.setData({
      selectedVersion,
      versionidd: versionidd + ''
    });
    // 选择版本后，根据版本 ID 获取其他数据
    this.fetchDataByVersionId(versionidd + "");
  },
  handleColorChange(e: any) {
    const selectedColor = this.data.colors[e.detail.value];
    this.setData({
      selectedColor
    });
    if (selectedColor !== '璀璨洋红') {
      this.setData({
        wheelsList: this.data.wheelsList.filter((wheel: string) => wheel !== '20英寸米型 璀璨洋红')
      });
    } else {
      // 当颜色是璀璨洋红时，重新获取所有轮毂选项
      this.fetchDataByVersionId(this.data.versionidd);
    }
  },
  handleInteriorChange(e: any) {
    this.setData({
      selectedInterior: this.data.interiors[e.detail.value]
    });
  },
  handleWheelsChange(e: any) {
    this.setData({
      selectedWheels: this.data.wheelsList[e.detail.value]
    });
  },
  handleGroupChange(e: any) {
    this.setData({
      selectedGroup: this.data.groups[e.detail.value]
    });
  },
  handleCancel() {
    // 取消填写，返回上一页
    wx.navigateBack();
  },
  handleConfirm() {
    const { 
      plateChars1, 
      plateChars2, 
      nickname, 
      selectedVersion, 
      selectedColor, 
      selectedInterior, 
      selectedWheels, 
      selectedGroup, 
      selectedGender 
    } = this.data;

    // 检查所有必要字段是否为空
    if (
      !nickname ||
      !selectedVersion ||
      !selectedColor ||
      !selectedInterior ||
      !selectedWheels ||
      !selectedGroup ||
      !selectedGender
    ) {
      wx.showModal({
        title: '提示',
        content: '请填写完整信息！',
        showCancel: false
      });
      return;
    }

    // 判断两个数组中的值是否都不为空
    const isPlateChars1Valid = plateChars1.every(item => item !== '');
    const isPlateChars2Valid = plateChars2.every(item => item !== '');

    if (isPlateChars1Valid && isPlateChars2Valid) {
      // 合并两个数组
      const mergedArray = plateChars1.concat(plateChars2);
      // 将数组合并成一个字符串
      const resultString = mergedArray.join('');
      //console.log('合并后的字符串:', resultString);
      this.setData({
        plateChars: resultString
      });
      // 确认提交，将数据发送到服务器
      const data = {
        wxid: wx.getStorageSync('token'),
        carnum: resultString,
        name: nickname,
        version: selectedVersion,
        color: selectedColor,
        interior: selectedInterior,
        hub: selectedWheels,
        belong: selectedGroup,
        selectedGender
      };
      //console.log('Sending data:', data);
      wx.request({
        url: this.data.url + 'api/editmishu',
        method: 'POST',
        data: data,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded' // 确保设置正确
        },
        success: (res) => {
          //console.log(res);
          if (res.data.success) {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            });
            wx.navigateBack({
              delta: 1 // 返回的页面层数，1 表示返回上一个页面
            });
          } else {
            wx.showToast({
              title: '提交失败',
              icon: 'none',
              duration: 2000
            });
          }
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '请完整输入车牌！',
        showCancel: false // 不显示取消按钮
      });
    }
  },
  onCharTap(e: any) {
    const index = e.currentTarget.dataset.index;
    //console.log(index);
    this.setData({ activeIndex: index });
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
      'plateChars1[0]': province,
      isValid: this.checkValidity1(),
      showProvinceKey: false,
      showAlphaNumKey: true
    });
  },

  selectKey(e: any) {
    const key = e.currentTarget.dataset.value;
    if (key === '确认') {
      this.setData({
        showAlphaNumKey: false
      });
      return;
    }
    // 第一阶段：处理省份后的第一个字符
    if (!this.data.plateChars1[1]) {
      if (['O', 'I'].includes(key)) return;

      if (key === 'x') {
        // 清除省份字符
        this.setData({
          'plateChars1[0]': '',
          isValid: this.checkValidity1(),
          activeIndex: -1,
          showProvinceKey: true,
          showAlphaNumKey: false
        });
        return;
      }

      // 输入第一个字母/数字
      this.setData({
        'plateChars1[1]': key,
        isValid: this.checkValidity1(),
        activeIndex: 1,
        showProvinceKey: false,
        showAlphaNumKey: true
      });
      return;
    }

    // 第二阶段：处理后续字符
    if (['O', 'I'].includes(key)) return;

    if (key === 'x') {
      // 处理退格逻辑
      if (this.data.activeIndex === 0) {
        // 清除第一个字母/数字
        this.setData({
          'plateChars1[1]': '',
          isValid: this.checkValidity1(),
          activeIndex: 1,
          showProvinceKey: false,
          showAlphaNumKey: true
        });
      } else {
        // 清除后续字符
        let lastIndex = this.data.plateChars2.length - 1;
        //console.log(lastIndex);
        while (lastIndex >= 0 && this.data.plateChars2[lastIndex] === '') {
          lastIndex--;
        }
        //console.log(lastIndex);
        if (lastIndex >= 0) {
          this.setData({
            [`plateChars2[${lastIndex}]`]: '',
            isValid: this.checkValidity2(),
            activeIndex: lastIndex,
            showProvinceKey: false,
            showAlphaNumKey: true
          });
        }
      }
    } else {
      // 输入新字符
      const index = this.data.plateChars2.findIndex(c => !c);
      if (index !== -1) {
        this.setData({
          [`plateChars2[${index}]`]: key
        }, () => {
          this.setData({
            isValid: this.checkValidity2(),
            activeIndex: index,
            showProvinceKey: false,
            showAlphaNumKey: index !== 5
          });
        });
      }
    }
  },
  checkValidity1() {
    const chars = this.data.plateChars1;
    return chars[0] && chars[1] && /^[A-Z0-9]$/.test(chars[1]);
  },

  checkValidity2() {
    const chars = this.data.plateChars2;
    return chars.every(c => c && /^[A-Z0-9]$/.test(c));
  },
  selectGender: function(e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({
      selectedGender: gender
    });
  },
});