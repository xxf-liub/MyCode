const app = getApp()
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [],
    load: true,
    pic:[],
    cloud:[]
  },
  onLoad() {
    var that=this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.cloud.callFunction({
      name:'Market',
      success(res) {
        
        that.setData({
          list: res.result.data[0].array,
          listCur: res.result.data[0].array[0],
          pic:res.result.data[0].pic
        })
        that.getCloud()
      },
      fail(res) {
            console.log("获取失败", res);
      }
    })
    
  },
  getCloud(){
    var that=this;
    var list=that.data.list;
    var i=0;
    var cloud=[];
    for(i=0;i<list.length;i++){
      var key=list[i].name;
      wx.cloud.callFunction({
        name:'getTabCloud',
        data:{
          key:key
        },
        success(res) {
          var obj=res.result.data;
          cloud.push(obj);
          if(cloud.length==list.length){
            that.setData({
              cloud:cloud
            })
            
          }
        },
        fail(res) {
              console.log("获取失败", res);
        }
      })
    }
    

    
  },
  onReady() {
    wx.hideLoading()
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  getMore(e){
    var k=e.currentTarget.dataset.id;
    var that = this;
    wx.navigateTo({
      url: '../result/result?key=' + k,
      success(res) {

      }
    })
  },
  enterAlt(e){
    var id= e.currentTarget.dataset.id;
    var name= e.currentTarget.dataset.postid;
    var that=this;
    var index=0;
    var list=that.data.list;
    var i=0;
    for(i=0;i<list.length;i++){
      if(list[i].name==name){
        index=i;
        break;
      }
    }
    var cloud = encodeURIComponent(JSON.stringify(that.data.cloud[index]));
    
    wx.navigateTo({
      url: '../art/art?index=' + id + '&cloud=' + cloud,
      success(res){
        
      }
    })
  }
  
})