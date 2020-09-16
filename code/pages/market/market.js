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
    var flag=true;
    var data=[];
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
            var j=0,x=0;
            for(x=0;x<cloud.length;x++){
              for(j=0;j<cloud.length;j++){
                flag=true;
                var cname=cloud[j];
                var y=0;
                for(y=0;y<cname.length;y++){
                  //console.log(cname[y].title);
                  if(cname[y].title.indexOf(list[x].name)==-1){
                      flag=false;
                      break;
                  }
                }
                if(flag==true){
                  data.push(cloud[j]);
                }
              }
            }
            that.setData({
              cloud:data
            })
            console.log("cg", data);
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
    console.log(that.data.cloud[index][id]);
    wx.cloud.callFunction({
      name: 'upzan',
      data: {
        id:that.data.cloud[index][id]._id,
        zan: that.data.cloud[index][id].zan+1
      },
      success(res) {
        that.data.cloud[index][id].zan=that.data.cloud[index][id].zan+1;
        that.setData({
          cloud:that.data.cloud
        })
      },
      fail(res) {
        
      }
    })
    var cloud = encodeURIComponent(JSON.stringify(that.data.cloud[index]));
    
    wx.navigateTo({
      url: '../art/art?index=' + id + '&cloud=' + cloud,
      success(res){
        
      }
    })
  }
  
})