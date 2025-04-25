Page({
  data: {
    longitude: 0,
    latitude: 0,
    address: '',
    markers: [],
    hasInfo: false,
    url: 'https://www.dreamvr.xyz/',
    // 新增数据字段，用于存储点击标记点的信息
    selectedMarker: null,
    distance: 0,
    color: '',
    carnum:'',
    isuplocation:'',
    uplocationtimediff:'',
    mycarnum:'',
    licensePlate1:'',
    licensePlate:'',
    mycarversion:'',
    mylatitude:'',
    mylongitude:'',
    myaddress:'',
    timeDiff:'',
    sexx:'',
    showCardFlag: true, 
    LocationIconBottom:240,
    mymarker:0,
    ismymarker:false,
  },
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
  onShow() {
    var self = this;
    self.refresh();
  },
  refresh(){
    var self = this;
    self.getLocation();
    self.getNearbyMarkers();
    self.setData({
      selectedMarker:null
    });
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
          self.setData({
            hasInfo: true,
            licensePlate1: res.data.data.carnum.slice(0, 2),
            licensePlate: res.data.data.carnum.slice(2),
            mycarversion: res.data.data.version,
            mycarnum:res.data.data.carnum,
          });
          if(res.data.data.isuplocation == '1'){
            self.setData({
              isuplocation:res.data.data.isuplocation,
              uplocationtimediff:self.getTimeDiff(res.data.data.uplocationtime),
              mylatitude:res.data.data.latitude,
              mylongitude:res.data.data.longitude,
            });
            this.getAddress(res.data.data.longitude, res.data.data.latitude);
          }else{
            self.setData({
              isuplocation:res.data.data.isuplocation,
            });
          }
        } else {
          self.setData({
            hasInfo: false
          });
        }
      }
    });
  },
  // 获取当前位置
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy:true,
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
        this.getAddress(res.longitude, res.latitude);
      },
      fail: (res) => {
        console.log('获取位置失败：' + res.errMsg);
      }
    });
  },
  // 获取地址信息
  getAddress(longitude, latitude) {
    //console.log('latitude:' + latitude);
    //console.log('longitude:' + longitude);
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        location: `${latitude},${longitude}`,
        key: 'NP2BZ-LGBL5-FILI6-IEWMI-CMBQV-2WFUD'
      },
      success: (res) => {
        //console.log(res.data.result);
        this.setData({
          address: res.data.result.address,
          myaddress: res.data.result.address,
        });
        this.getNearbyMarkers();
      },
      fail: (res) => {
        console.log('失败：' + res);
      }
    });
  },
  // 获取附近标记点（模拟）
  getNearbyMarkers() {
    //console.log(this.data.longitude + '、' + this.data.latitude);
    const markers = [];

    // 当前位置标记
    markers.push({
      id: 0, // 当前位置标记的 id 设为 0
      longitude: this.data.longitude,
      latitude: this.data.latitude,
      iconPath: '/images/data_location_marker.png', // 当前位置使用不同的图标
      width: 1,
      height: 1
    });
    // 模拟从后端获取的数据位置标记
    //const dataLocations = [];
    wx.request({
      url: this.data.url+'api/allcar', // 替换为实际的后端接口地址
      method: 'GET',
      success: (res) => {
        if (res.data && Array.isArray(res.data)) {
          // 筛选出 isuplocation 为 1 的记录
          const validMarkers = res.data.filter(item => item.isuplocation === '1');
          //console.log(validMarkers);
          validMarkers.forEach((location, index) => {
            const timeDiff = this.getTimeDiff(location.uplocationtime);
            var sex = '';
            var tcolor = '#ffffff';
            var bggcolor = '';
            if(location.reserve2 === '男'){
              sex = '♂';
            }else if(location.reserve2 === '女'){
              sex = '♀';
            }else{
              sex = '';
            }
            if(location.reserve3){
              tcolor = location.reserve3;
            }else{
              tcolor = '#ffffff';
            }
            if(this.data.mycarnum === location.carnum){
              bggcolor = '#99FFFF';
              this.data.mymarker = index + 1;
            }else{
              bggcolor = '';
            }
            // 将十六进制颜色转换为 RGBA 并设置透明度
            //const rgbaColor = this.hexToRgba(location.reserve1, 0.8); // 0.8 表示 80% 的不透明度
            markers.push({
              id: index + 1, // 数据位置标记的 id 从 1 开始
              carnum:location.carnum,
              color:location.color,
              interior:location.interior,
              carversion:location.version,
              wheels:location.hub,
              group:location.belong,
              sexx:location.reserve2,
              longitude: location.longitude,
              latitude: location.latitude,
              timeDiffa:timeDiff,
              iconPath: '/images/data_location_marker.png', // 数据位置使用另一种图标
              width: 1,
              height: 1,
              callout: {
                content: sex+' '+`${location.carnum.slice(2)}`,
                color: tcolor,
                fontSize: 12,
                bgColor: location.reserve1,
                borderColor:bggcolor,
                borderWidth: '2',
                padding: 5,
                borderRadius: 5,
                display: 'ALWAYS'
              },
            });
            this.setData({
              timeDiff,
            });
          });
          this.setData({
            markers,
            showCardFlag: true,
            LocationIconBottom:240
          });
        }
      },
      fail: (err) => {
        console.error('获取附近标记点数据失败:', err);
      }
    });
  },
  // 辅助函数：将十六进制颜色转换为 RGBA
hexToRgba(hex: string, alpha: number) {
  // 去除十六进制颜色值中的 # 符号
  hex = hex.replace('#', '');
  // 解析十六进制颜色值为 RGB 分量
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // 返回 RGBA 颜色值
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
},
  // 计算时间差值
  getTimeDiff(time) {
    if (!time) {
      return '时间信息缺失';
    }
    const now = new Date();
    // 将字符串格式的时间转换为 Date 对象
    const locationTime = new Date(time.replace(/-/g, '/'));
    const diff = now.getTime() - locationTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) {
      return `${days} 天前`;
    } else if (hours > 0) {
      return `${hours} 小时前`;
    } else if (minutes > 0) {
      return `${minutes} 分钟前`;
    } else {
      return '刚刚';
    }
  },
  addcarinfo(){
    wx.switchTab({
      url: '/pages/mine/mine',
    })
  },
  // 上传更新定位
  uploadLocation() {
    if (this.data.hasInfo) {
      // 确认提交，将数据发送到服务器
      const data = {
        wxid: wx.getStorageSync('token'),
        longitude: this.data.longitude,
        latitude: this.data.latitude
      };
      //console.log('Sending data:', data);
      wx.request({
        url: this.data.url + 'api/uptude',
        method: 'POST',
        data: data,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded' // 确保设置正确
        },
        success: (res) => {
          //console.log(res);
          if (res.data.success) {
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000
            });
            this.refresh();
          } else {
            wx.showToast({
              title: '上传失败',
              icon: 'none',
              duration: 2000
            });
          }
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '请先添加车辆！',
        showCancel: false, // 不显示取消按钮
        success(res) {
          wx.switchTab({
            url: '/pages/mine/mine',
          })
        }
      });
    }
  },
  // 删除定位
  deleteLocation() {
    if (this.data.hasInfo) {
      // 确认提交，将数据发送到服务器
      const data = {
        wxid: wx.getStorageSync('token'),
      };
      //console.log('Sending data:', data);
      wx.request({
        url: this.data.url + 'api/deltude',
        method: 'POST',
        data: data,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded' // 确保设置正确
        },
        success: (res) => {
          //console.log(res);
          if (res.data.success) {
            wx.showToast({
              title: '删除定位成功',
              icon: 'success',
              duration: 2000
            });
            this.refresh();
          } else {
            wx.showToast({
              title: '删除定位失败',
              icon: 'none',
              duration: 2000
            });
          }
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '请先添加车辆！',
        showCancel: false, // 不显示取消按钮
        success(res) {
          wx.switchTab({
            url: '/pages/mine/mine',
          })
        }
      });
    }
  },
  // 新增：点击标记点的事件处理函数
  onMarkerTap(e: any) {
    const markerId = e.markerId;
    this.setData({
      showCardFlag: true,
      LocationIconBottom:240
    });
    if(this.data.mymarker === markerId){
      this.setData({
        ismymarker : true,
      });
    }else{
      this.setData({
        ismymarker : false,
      });
    }

    if(e.markerId>0){
      const selectedMarker = this.data.markers.find(marker => marker.id === markerId);
      if (!selectedMarker) {
        console.error('未找到对应的标记点');
        return;
      }
      // 更新对应 marker 的 callout 边框颜色
    this.updateCalloutBorderColor(markerId, '#00FF00'); // 红色边框
    
      // 确保数据类型为 number
      const lat1 = Number(this.data.latitude);
      const lon1 = Number(this.data.longitude);
      const lat2 = Number(selectedMarker.latitude);
      const lon2 = Number(selectedMarker.longitude);
    
      if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
        console.error('经纬度数据无效:', lat1, lon1, lat2, lon2);
        return;
      }
    //console.log(selectedMarker.sexx);
      // 计算距离
      const distance = this.calculateDistance(lat1, lon1, lat2, lon2);
      const formattedDistance = this.formatDistance(distance);
      this.setData({
        selectedMarker,
        distance:formattedDistance,
        color:selectedMarker.color,
        carnum:selectedMarker.carnum,
        carnum1:selectedMarker.carnum.slice(0, 2),
        carnum2:selectedMarker.carnum.slice(2),
        interior:selectedMarker.interior,
        carversion:selectedMarker.carversion,
        wheels:selectedMarker.wheels,
        group:selectedMarker.group,
        sexx:selectedMarker.sexx,
        timeDiffa:selectedMarker.timeDiffa
      });
    }
  },
  formatDistance(distance: number): string {
    if (distance >= 1000) {
      return (distance / 1000).toFixed(2) + ' 千米';
    }
    return distance + ' 米';
  },
  // 更新 callout 边框颜色
  updateCalloutBorderColor(markerId, borderColor) {
    // 先将所有 marker 的边框颜色重置为默认值（这里假设默认值为空字符串）
    const defaultBorderColor = '';
    const markers = this.data.markers.map(marker => {
      return {
        ...marker,
        callout: {
          ...marker.callout,
          borderColor: defaultBorderColor
        }
      };
    });
    
    // 再给当前点击的 marker 设置新的边框颜色
    const updatedMarkers = markers.map(marker => {
      if (marker.id === markerId) {
        return {
          ...marker,
          callout: {
            ...marker.callout,
            borderColor: borderColor
          }
        };
      }
      if(marker.id === this.data.mymarker){
        return {
          ...marker,
          callout: {
            ...marker.callout,
            borderColor: '#99FFFF'
          }
        };
      }
      return marker;
    });

    // 更新 markers 数据
    this.setData({
      markers: updatedMarkers
    });
  },
// 新增：计算两点之间的距离（单位：米）
calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  if (typeof lat1!== 'number' || typeof lon1!== 'number' || typeof lat2!== 'number' || typeof lon2!== 'number') {
    console.error('经纬度数据无效:', lat1, lon1, lat2, lon2);
    return 0;
  }
  const R = 6371000; // 地球半径，单位：米
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.floor(distance); // 去掉小数点部分
},
viewCarOwner(){
  var self = this;
  wx.navigateTo({
    url: '/pages/main/main?carnum='+self.data.carnum//页面路径
  })
},
// 点击地图隐藏 card
hideCard() {
  const defaultBorderColor = '';
  const markers = this.data.markers.map(marker => {
    if(marker.id === this.data.mymarker){
      return {
        ...marker,
        callout: {
          ...marker.callout,
          borderColor: '#99FFFF'
        }
      };
    }else{
      return {
        ...marker,
        callout: {
          ...marker.callout,
          borderColor: defaultBorderColor
        }
      };
    }
  });
  this.setData({
    markers,
    showCardFlag: false,
    LocationIconBottom: 50
  }, () => {
    //console.log('markers 更新后:', this.data.markers);
  });
},
// 点击定位图标显示 card
showCard() {
  this.setData({
    showCardFlag: true,
    selectedMarker:null,
    LocationIconBottom:240
  });
},
// ... existing code ...

});