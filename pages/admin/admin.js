const DB=wx.cloud.database().collection("list");
const app = getApp();
let name="";
let about = "";
let index=0;
let address = "";
let pic=[];
let id="";
let type ="网站源码";
let mode1 = ['微擎模块', '影视源码', '小说源码', '游戏棋牌', '其他源码'];
let mode2 = ['emlog模块', 'Wordpress模块', 'Zblog模块',  '其他模块'];
var util=require('../../utils/util.js')
Page({
  data:{
    array: [],
    region: ['微擎模块', '影视源码', '小说源码','游戏棋牌','其他源码'],
    rindex:0,
  },
  addname(event){
    name=event.detail.value
  },
  addabout(event) {
    about = event.detail.value
  },
  address(event) {
    address = event.detail.value
  },
  delid(event) {
    id = event.detail.value;
  },
  upid(event) {
    id = event.detail.value;
  },
  upabout(event) {
    about = event.detail.value;
  },
  addpic() {
    var that=this;
    wx.chooseImage({
      count:4,
      sizeType:['original','compressed'],
      sourceType:['album','camera'],
      success: function(res) {
        var len=res.tempFilePaths.length;
        var ar = res.tempFilePaths; 
        var i = 0;
        index = 0;
        for (i = 0; i < len; i++) {
          that.upfile(ar[i]);
        }
        
        that.setData({
          array: ar
        })
      },
      fail(res) {
        console.log("未选择相应数量的图片", res);
      }
    })
  },
  upfile(fileurl){
    var that = this;
    wx.cloud.uploadFile({
      cloudPath: new Date().getTime()+'.png', // 上传至云端的路径
      filePath: fileurl,
      success: res => {
        // 返回文件 ID
        pic[index]=res.fileID;
        index++ ;
        
      },
      fail: console.error
    })
    
  },
 adddata(){
   var that=this;
   var i=0;
   that.setData({
     array: pic
   })
   if(name!=""&& address!=""&&that.data.array!=""){
      DB.add({
        data:{
          title:name,
          about:about,
          p1: pic,
          adr:address,
          col:0,
          zan:0,
          type: type,
          region: that.data.region[that.data.rindex],
          time: util.formatTime(new Date()),

        },
        success(res){
          console.log("添加成功",that.data.array);
        },
        fail(res) {
          console.log("添加失败", res);
        }
      })
   }
   else{
     wx.showModal({
       title: '提示',
       content: '信息不能为空',
       showCancel:false
     })
   }
 },
  getdata() {
    DB.get({
     
      success(res) {
        console.log("获取成功", res);
      },
      fail(res) {
        console.log("获取失败", res);
      }
    })
  },
  deldata() {
    DB.doc(id).remove({

      success(res) {
        console.log("删除成功", res);
      },
      fail(res) {
        console.log("删除失败", res);
      }
    })
  },
  updata() {
    DB.doc(id).update({
      data: {
        about: about
      },
      success(res) {
        console.log("更新成功", res);
      },
      fail(res) {
        console.log("更新失败", res);
      }
    })
  },
  getopenid(){
    wx.cloud.callFunction({
      name:"getopenid",
      success(res) {
        console.log("获取用户openid成功", res.result.openid);
        
      },
      fail(res) {
        console.log("获取用户openid失败", res.result.openid);
      }
    })
  },
  radiochange(e){
    var that=this;
    type = e.detail.value;
    if(type=="网站源码"){
      that.setData({
        region:mode1
      })
      
    }
    else{
      that.setData({
        region: mode2
      })
      
    }
  },
  pickerchange(e){
    var that = this;
    that.setData({
      rindex: e.detail.value
    })
    
  }
  ,
  delpic(e){
    var that=this;
    var array=that.data.array;
    var index = e.currentTarget.dataset.id;
    array.splice(index, 1);
    that.setData({
      array:array
    })
    
  }
})
