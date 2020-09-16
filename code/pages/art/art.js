const app = getApp();
const DB = wx.cloud.database().collection("list");
var util = require('../../utils/util.js');
let index0=0;
let cloud=[];
let zan;
let col;
let lock=false;
let lockcol=false;
let show=false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cloud:[],
    index0:0,
    array:[],
    iflink:false,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    list: [{
      name: 'fade',
      color: 'red'
    },
    {
      name: 'scale-up',
      color: 'orange'
    },
    {
      name: 'scale-down',
      color: 'olive'
    },
    {
      name: 'slide-top',
      color: 'green'
    }, {
      name: 'slide-bottom',
      color: 'cyan'
    },
    {
      name: 'slide-left',
      color: 'blue'
    },
    {
      name: 'slide-right',
      color: 'purple'
    },
    {
      name: 'shake',
      color: 'mauve'
    }
    ],
  },
  entShop(){
    wx.switchTab({
      url: '../shop/shop',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    index0=options.index;
    cloud = JSON.parse(decodeURIComponent(options.cloud));
    var i = 0,j=0;
    var array=[];
    for (i = 0; i < cloud.length; i++) {
      if(i!=index0){
        array[j] = cloud[i];
        j++;
      }
        
    } 
    this.setData({
      cloud:cloud,
      index0:index0,
      array:array
    })

    show = wx.getStorageSync('share');
    if (show) {
      console.log(show.share);
    }
    else {
      wx.cloud.callFunction({
        name: 'getArray',
        success(res) {
          console.log("修改成功1", res.result.data[0]);
          show=res.result.data[0].share;
          wx.setStorageSync('share', res.result.data[0]);
          
        },
        fail(res) {
          console.log("获取失败1", res);
        }
      })

    }
    
  },
  previewImg: function (e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var index0 = this.data.index0;
    var imgArr = this.data.cloud[index0].p1; 
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  addcol(e) {
    if (app.globalData.userInfo.length == 0 || app.globalData.oppenid == '') {
      wx.showModal({
        title: '登录提醒',
        content: '在登录小程序后才能进行点赞和收藏',
        showCancel: false,
        success(res) {
          wx.switchTab({
            url: '../my/my',

          })
        },
        fail(res) {

        }
      })
    }
    else {
      if(lockcol==false){
        lockcol=true;
        var index = index0;
        var that = this;
        var wuid = that.data.cloud[index]._id;
        var id = 0;
        col = that.data.cloud[index].col;
        const db = wx.cloud.database().collection("col");
        db.where({
          wuid: wuid,
          userid: app.globalData.oppenid
        }).get({
          success(res) {
            
            if (res.data.length == 0) {
              wx.showToast({
                title: '收藏成功',
              })
              that.data.cloud[index].col = that.data.cloud[index].col + 1;
              var datacloud = that.data.cloud;
              that.setData({
                cloud: datacloud
              })
              wx.cloud.callFunction({
                name: 'addcol',
                data: {
                  wuid: wuid,
                  userid: app.globalData.oppenid,
                  time: util.formatTime(new Date()),
                },
                success(res) {
                  console.log("添加成功", res.result);
                  wx.cloud.callFunction({
                    name: 'upcol',
                    data: {
                      id: that.data.cloud[index]._id,
                      col: that.data.cloud[index].col
                    },
                    success(res) {
                      console.log("修改成功", res.result);
                      lockcol=false;
                    },
                    fail(res) {
                      console.log("修改失败", res.result);
                    }
                  })
                },
                fail(res) {
                  console.log("添加失败", res.result);
                }
              })
            }
            else {
              wx.showToast({
                title: '取消成功',
              })
              that.data.cloud[index].col = that.data.cloud[index].col - 1;
              var datacloud = that.data.cloud;
              that.setData({
                cloud: datacloud
              })
              id = res.data[0]._id;
              wx.cloud.callFunction({
                name: 'delcol',
                data: {
                  id: id
                },
                success(res) {
                  console.log("删除成功", res.result);
                  wx.cloud.callFunction({
                    name: 'upcol',
                    data: {
                      id: that.data.cloud[index]._id,
                      col: that.data.cloud[index].col,
                    },
                    success(res) {
                      console.log("修改成功", res.result);
                      lockcol = false;
                    },
                    fail(res) {
                      console.log("修改失败", res.result);
                    }
                  })
                },
                fail(res) {
                  console.log("删除失败", res.result);
                }
              })
            }
          },
          fail(res) {
            console.log("更新失败", res);
          }
        })
      }
    }
  },
  addzan(e) {
    if (app.globalData.userInfo.length == 0 || app.globalData.oppenid == '') {
      wx.showModal({
        title: '登录提醒',
        content: '在登录小程序后才能进行点赞和收藏',
        showCancel: false,
        success(res) {
          wx.switchTab({
            url: '../my/my',

          })
        },
        fail(res) {

        }
      })
    }
    else {
      var that = this;
      if(lock==false){
        lock=true;
        var index = index0;
        var that = this;
        var wuid = that.data.cloud[index0]._id;
        var id = 0;
        zan = that.data.cloud[index0].zan;
        const db = wx.cloud.database().collection("zan");
        db.where({
          wuid: wuid,
          userid: app.globalData.oppenid
        }).get({
          success(res) {
            if (res.data.length == 0) {
              wx.showToast({
                title: '点赞成功',
              })
              that.data.cloud[index0].zan = that.data.cloud[index0].zan + 1;
              var datacloud = that.data.cloud;
              that.setData({
                cloud: datacloud
              })
              wx.cloud.callFunction({
                name: 'addzan',
                data: {
                  wuid: wuid,
                  userid: app.globalData.oppenid,
                  time: util.formatTime(new Date()),
                },
                success(res) {
                  console.log("添加成功", res.result);
                  wx.cloud.callFunction({
                    name: 'upzan',
                    data: {
                      id: that.data.cloud[index]._id,
                      zan: that.data.cloud[index].zan 
                    },
                    success(res) {
                      console.log("修改成功", res.result);
                      lock = false;
                    },
                    fail(res) {
                      console.log("修改失败", res.result);
                    }
                  })
                },
                fail(res) {
                  console.log("添加失败", res.result);
                }
              })
            }
            else {
              that.data.cloud[index0].zan = that.data.cloud[index0].zan - 1;
              var datacloud = that.data.cloud;
              that.setData({
                cloud: datacloud
              })
              id = res.data[0]._id;
              wx.cloud.callFunction({
                name: 'delzan',
                data: {
                  id: id
                },
                success(res) {
                  console.log("删除成功", res.result);
                  wx.showToast({
                    title: '取消成功',
                  })
                  wx.cloud.callFunction({
                    name: 'upzan',
                    data: {
                      id: that.data.cloud[index]._id,
                      zan: that.data.cloud[index].zan 
                    },
                    success(res) {
                      console.log("修改成功", res.result);
                      lock = false;
                    },
                    fail(res) {
                      console.log("修改失败", res.result);
                    }
                  })
                },
                fail(res) {
                  console.log("删除失败", res.result);
                }
              })
            }
          },
          fail(res) {
            console.log("更新失败", res);
          }
        })
      }
    }
      var anmiaton = e.currentTarget.dataset.class;
      var that=this;
      that.setData({
        animation: anmiaton
      })
      setTimeout(function () {
        that.setData({
          animation: ''
        })
      }, 1000)

  },
  copyTBL: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
      })
  },
  enterArt: function (e) {
    var index;
    var index = e.currentTarget.dataset.id; 
    var that = this;
    var cloud = JSON.stringify(that.data.cloud); 
    var array = JSON.stringify(that.data.array); 
    var i = 0;
    for (i = 0; i < that.data.cloud.length; i++) {
      if (that.data.cloud[i] == that.data.array[index]){
        index = i; 
        break;
      }  
    }
    wx.navigateTo({
      url: '../art/art?index=' + index + '&cloud=' + encodeURIComponent(cloud),
      success(res) {
      }
    })
  },
  getAdr:function(){
    var that=this;
    if (app.globalData.userInfo.length == 0 || app.globalData.oppenid == '') {
      wx.showModal({
        title: '登录提醒',
        content: '在登录小程序后才能获取下载地址',
        showCancel: false,
        success(res) {
          wx.switchTab({
            url: '../my/my',

          })
        },
        fail(res) {

        }
      })
    }
    else {
      if(show==true){
        wx.showModal({
          title: '帮一下亲',
          content: '点击左下角分享,分享给任意用户或群聊后显示下载地址,谢谢啦',
          success(res) {
            if (res.confirm) {
            }

          },
          fail(res) {

          }
        })
      }
      else{
        let query = wx.createSelectorQuery();
    query.select('#bot').boundingClientRect();
    // 执行查询
    query.exec(ele => {
      let e = ele[0];
      wx.pageScrollTo({
        scrollTop: e.top,
      });
    })
        that.setData({
          iflink: true
        })
          
        
       
      }
      
      
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that=this;
    var title=that.data.cloud[that.data.index0].title;
    var pic = that.data.cloud[that.data.index0].p1;
    
    that.setData({
        iflink: true
      })
    
    
    return {
      title: title,
      path: "pages/home/home",
      imageUrl: pic,
      
    }
    
    
  }
  
})