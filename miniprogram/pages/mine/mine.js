//初始化数据库
const db = wx.cloud.database()
const app = getApp()

Page({
  data: {
    isJoin: false,
    disabled: true, // 登录btn是否可选
    name: "默认",
    avatarUrl: "",
    city: "默认",
    aboutMe: "暂无",
    curItem: 'myPicture',
    myBlock: [],
    // 正方形图片
    imgLIstWidth: app.globalData.sysWidth / 2,
  },
  onLoad: function() {
    this.autoLogin()
  },
  onShow: function() {
    this.loadPicture()
  },
  //自动登录
  autoLogin() {
    let that = this
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then((res) => {
      db.collection("users").where({
        _openid: res.result.openid
      }).get().then((res) => {
        if (res.data.length) {
          //有数据，自动登入
          wx.showLoading({
            title: '加载中，请稍后',
          })
          app.userInfo = Object.assign(app.userInfo, res.data[0]);
          console.log(app.userInfo)
          this.setData({
            avatarUrl: app.userInfo.userPhoto,
            name: app.userInfo.nickname,
            city: app.userInfo.city,
            isJoin: true
          })
          wx.hideLoading();
          wx.showToast({
            title: '加载完毕',
          })
        } else {
          this.setData({
            disabled: false
          })
        }
      })
    })
  },
  //登录btn
  bindgetuserinfo(e) {
    let userInfo = e.detail.userInfo;
    if (!this.isJoin && userInfo) {
      db.collection('users').add({
        // 写数据
        data: {
          userPhoto: userInfo.avatarUrl,
          nickname: userInfo.nickName,
          city: userInfo.city,
          country: userInfo.country,
          gender: userInfo.gender,
          language: userInfo.language,
          province: userInfo.province,
          like: 0,
          fans: 0,
          myBlock: [],
          myLike: [],
          time: new Date(),
        }
      }).then((res) => {
        db.collection('users').doc(res._id).get().then((res) => {
          app.userInfo = Object.assign(app.userInfo, res.data);
          this.setData({
            avatarUrl: app.userInfo.userPhoto,
            name: app.userInfo.nickname,
            city: app.userInfo.city,
            isJoin: true
          })
        })
      })
    } else {
      //用户按了拒绝按钮
      wx.showToast({
        title: '已取消登录',
      })
    }
  },
  //myPic & like 切换
  myItemChange(e) {
    console.log(e.currentTarget.dataset.current)
    this.setData({
      curItem: e.currentTarget.dataset.current
    })

  },
  // 更新我的图片
  loadPicture() {
    //过滤flow
    db.collection('flow').where({
      _openid:app.userInfo._openid
    }).get().then(res=>{
      this.setData({
        myBlock:res.data
      })
      console.log(res.data)
    })
  }
})