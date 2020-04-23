const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    blockList: []
  },
  onLoad: function(options) {
    let a = this.loadImg();
    setTimeout(() => {
      console.log(a)
    }, 1000)
  },
  onShow: function() {},
  onPullDownRefresh: function() {
    this.upData()
  },
  //加载首页图片
  loadImg(callback) {
    var that = this
    var tempArr = null
    db.collection('flow').field({
      _openid: true,
      userPhoto: true,
      name: true,
      fileId: true,
      like: true,
      review: true,
      text: true,
      time: true
    }).get().then(res => {
      this.setData({
        // blocklist 存下所有block
        blockList: res.data
      })
      tempArr = res.data
      callback(tempArr)
    })
  },
  // 刷新图
  upData() {
    let that = this
    var p1 = new Promise((resolve, reject) => {
      this.loadImg(resolve)
    })
    p1.then(res => {
      let temparr = res.sort(() => {
        return (0.5 - Math.random())
      })
      that.setData({
        blockList: temparr
      })
    })
  }
})