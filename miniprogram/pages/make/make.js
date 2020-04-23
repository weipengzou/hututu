// miniprogram/pages/make/make.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    chooseImageList: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!app.userInfo._openid) {
      wx.showToast({
        title: '请先登录后再上传',
        icon: "none",
        duration: 2000
      })
      setTimeout(function() {
        wx.switchTab({
          url: '../mine/mine',
        })
      }, 2000)
    }
    //set id
    this.setData({
      id: app.userInfo._id
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //选择相片
  chooseImage() {

    this.data.chooseImageList = []

    let that = this;
    wx.chooseImage({
      success: function(res) {
        var temFilePaths = res.tempFilePaths;
        var filterimg = that.data.chooseImageList.concat(temFilePaths)
        that.setData({
          chooseImageList: filterimg
        })
      }
    })
  },
  //上传图片
  upload() {
    console.log(this.data.chooseImageList.length)

    for (let i = 0; i < this.data.chooseImageList.length; i++) {
      //图片地址
      let filePath = this.data.chooseImageList[i];
      //获取后缀名
      let suffix = /\.[^\.]+$/.exec(filePath)[0]
      //上传云存储
      wx.cloud.uploadFile({
        cloudPath: new Date().getTime() + suffix,
        filePath: filePath
      }).then(res => {
        db.collection('flow').add({
          //block数据
          data: {
            name: app.userInfo.nickname,
            userPhoto: app.userInfo.userPhoto,
            fileId: res.fileID,
            time: new Date(),
            text: "",
            review: [],
            like: 0
          }
        })
        // console.log("上传云存储", res.fileID)
      })
    }
  }
})