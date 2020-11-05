// var apiUrl = 'http://' + $api.getStorage('apiUrl');
var app = {
    apipath: apiUrl + '/api/',
    // apipath:'',
};
var now = Date.now();

function fnGet(path, data, isDelete, callback) {
    // console.log(api.connectionType);
    if(api.connectionType == 'none'){
      api.toast({
          msg: '网络连接错误,请检查网络是否连接',
          duration: 2000,
          location: 'bottom'
      });
      return
    }
     app.apipath = 'http://' + $api.getStorage('apiUrl')+ '/api/';
    var headers = {};
    api.showProgress({
        title: '加载中',
        text: '',
        modal: false
    });
    if (isDelete) {
        headers["Content-Type"] = 'application/json';
    }
    headers.Authorization = $api.getStorage('loginInfo');
    // api.openWin({
    //     name: 'index',
    //     url: 'widget://index.html'
    // });
    // console.log(HandleUserRegistrationService/GetList);
    // console.log(app.apipath + path);
    // console.log(JSON.stringify(data));
    // console.log(JSON.stringify(headers));
    api.ajax({
        // url: 'http://192.168.1.105:3000/api/'+path+'?filter={"where":' + JSON.stringify(where) + ',"page":' + page + ',"limit":' + limit + '}',
        url: app.apipath + path,
        method: isDelete ? 'delete' : 'get',
        timeout: 15,
        dataType: 'json',
        headers: headers,
        traditional: true
    }, function(ret, err) {
        // console.log(JSON.stringify(err))
        if (ret) {
          // alert(app.apipath + path);
            // console.log(app.apipath + path);
            api.hideProgress();
            // api.refreshHeaderLoadDone();
            callback(ret, err);
        }
        if (err) {
            // console.log(JSON.stringify(err));
            if (err.code == 1 || err.statusCode == 503) {
                getApiPathAddress();
                app.apipath = "http:" + $api.getStorage('apiUrl') + '/api/';
                if (app.apipath == "" || app.apipath == undefined) {
                    api.toast({
                        msg: '网络请求超时',
                        duration: 2000,
                        location: 'bottom'
                    });
                    return
                }
                api.showProgress({
                    title: '加载中',
                    modal: false
                });
                console.log(app.apipath + path);
                api.ajax({
                    // url: 'http://192.168.1.105:3000/api/'+path+'?filter={"where":' + JSON.stringify(where) + ',"page":' + page + ',"limit":' + limit + '}',
                    url: app.apipath + path,
                    method: isDelete ? 'delete' : 'get',
                    timeout: 15,
                    dataType: 'json',
                    headers: headers,
                    traditional: true
                }, function(ret1, err1) {
                    if (ret1) {
                        api.hideProgress();
                        // api.refreshHeaderLoadDone();
                        callback(ret1, err1);
                    }
                    if (err1) {
                        if (err1.code == 1) {
                            api.toast({
                                msg: '网络请求超时',
                                duration: 2000,
                                location: 'bottom'
                            });

                        } else {
                            errMessage(err1);
                        }
                    }

                });

            } else {
                errMessage(err);
            }
        }
    });
};

function errMessage(err) {
    // console.log(JSON.stringify(err));
    if (err.body) {
        if (err.body.error) {
            if (err.body.error.message == '10000') {
                api.toast({
                    msg: err.body.error.details,
                    duration: 2000,
                    location: 'top'
                });
            } else {
                api.toast({
                    msg: err.body.error.message,
                    duration: 2000,
                    location: 'top'
                });
            }
            if (err.body.error.message == '当前用户没有登录到系统！') {
                // console.log(111);
                api.closeToWin({
                    name: 'login0'
                });
            }
            if (err.body.error.details == '当前用户没有登录到系统！') {
                // console.log(111);
                api.closeToWin({
                    name: 'login0'
                });
            }
        } else {
            api.toast({
                msg: err.body,
                duration: 2000,
                location: 'top'
            });
            if (err.body == '当前用户没有登录到系统！') {
                // console.log(111);
                api.closeToWin({
                    name: 'login0'
                });
            }
        }
    } else {
        api.toast({
            msg: err.msg,
            duration: 2000,
            location: 'top'
        });
        if (err.msg == '当前用户没有登录到系统！') {
            // console.log(111);
            api.closeToWin({
                name: 'login0'
            });
        }
    }
}


// function fnPost(path, data, contentType, isLogin, isPut, callback,isErr=false) {
function fnPost(path, data, contentType, isLogin, isPut, callback) {
    // var apipath = getApiPathAddress();

    // app.apipath= apipath !='' && apipath !=undefined?apipath:app.apipath;
    // console.log(JSON.stringify(app.apipath));
    var headers = {};
    if (contentType) {
        headers["Content-Type"] = contentType
    }
    if (isLogin) {
        if (!$api.getStorage('loginInfo')) {
            setTimeout(function() {
                api.closeToWin({
                    name: 'login'
                });
            }, 200);
            return;
        }
        headers.Authorization = $api.getStorage('loginInfo');
    }
    api.showProgress({
        title: '加载中',
        modal: false
    });

    api.ajax({
        url: 'http://' + $api.getStorage('apiUrl') + '/api/' + path,
        method: isPut ? 'put' : 'post',
        timeout: 60,
        dataType: 'json',
        returnAll: false,
        headers: headers,
        data: data
    }, function(ret, err) {
        // api.refreshHeaderLoadDone();
        api.hideProgress();
        if (ret) {
            api.hideProgress();
            callback(ret, err);
        }
        if (err) {
            if (err.code == 1 || err.statusCode == 503) { //超时
                getApiPathAddress();
                app.apipath = "http:" + $api.getStorage('apiUrl') + '/api/';
                if (app.apipath == "" || app.apipath == undefined) {
                    api.toast({
                        msg: '网络请求超时',
                        duration: 2000,
                        location: 'bottom'
                    });
                    return
                }
                api.showProgress({
                    title: '加载中',
                    modal: false
                });
                api.ajax({
                    url: app.apipath + path,
                    method: isPut ? 'put' : 'post',
                    timeout: 60,
                    dataType: 'json',
                    returnAll: false,
                    headers: headers,
                    data: data
                }, function(ret1, err1) {
                    if (ret1) {
                        api.hideProgress();
                        callback(ret1, err1);
                    }
                    if (err1) {
                        if (err1.code == 1) { //超时
                            api.toast({
                                msg: '网络请求超时',
                                duration: 2000,
                                location: 'bottom'
                            });
                        } else {
                            fnPostErrMessage(err1);
                        }
                    }
                });
            } else {
                fnPostErrMessage(err);
            }
        }
    });
};

function fnPostErrMessage(err) {
    if (err.statusCode == 401) {
        api.openWin({
            name: 'login_New',
            url: 'widget://html/login/login_New.html',
            slidBackEnabled: false,
            bgColor: 'widget://image/login/login_backgroud.png'
        });
    }
    if (err.body) {
        if (err.body.error) {
            if (err.body.error.message == '10000') {
                api.toast({
                    msg: err.body.error.details,
                    duration: 2000,
                    location: 'top'
                });
            } else {
                api.toast({
                    msg: err.body.error.message,
                    duration: 2000,
                    location: 'top'
                });
            }
            if (err.body.error.message == '当前用户没有登录到系统！') {
                // console.log(111);
                setTimeout(function() {
                    api.openWin({
                        name: 'login_New',
                        url: 'widget://html/login/login_New.html',
                        slidBackEnabled: false,
                        bgColor: 'widget://image/login/login_backgroud.png'
                    });
                }, 200);
            }
        } else {
            api.toast({
                msg: err.body,
                duration: 2000,
                location: 'top'
            });
        }
    } else {
        api.toast({
            msg: err.msg,
            duration: 2000,
            location: 'top'
        });
    }
}
//zxf 2020-04-11
function fnPost1(path, data, contentType, isLogin, isPut, callback) {
    var headers = {};

    if (contentType) {
        headers["Content-Type"] = contentType
    }

    if (isLogin) {
        if (!$api.getStorage('loginInfo')) {
            setTimeout(function() {
                api.closeToWin({
                    name: 'login'
                });
            }, 200);
            return;
        }
        headers.Authorization = $api.getStorage('loginInfo');
    }
    api.showProgress({
        title: '加载中',
        modal: false
    });
    api.ajax({
        url: app.apipath + path,
        method: isPut ? 'put' : 'post',
        timeout: 60,
        dataType: 'json',
        returnAll: false,
        headers: headers,
        data: data
    }, function(ret, err) {
        if (ret) {
            callback(ret, err);
        }
        if (err) {
            if (err.code == 1 || err.statusCode == 503) { //超时
                getApiPathAddress();
                app.apipath = "http:" + $api.getStorage('apiUrl') + '/api/';
                if (app.apipath == "" || app.apipath == undefined) {
                    api.toast({
                        msg: '网络请求超时',
                        duration: 2000,
                        location: 'bottom'
                    });
                    return
                }
                api.showProgress({
                    title: '加载中',
                    modal: false
                });
                api.ajax({
                    url: app.apipath + path,
                    method: isPut ? 'put' : 'post',
                    timeout: 60,
                    dataType: 'json',
                    returnAll: false,
                    headers: headers,
                    data: data
                }, function(ret1, err1) {
                    if (ret1) {
                        api.hideProgress();
                        callback(ret1, err1);
                    }
                    if (err1) {
                        if (err1.code == 1) { //超时
                            api.toast({
                                msg: '网络请求超时',
                                duration: 2000,
                                location: 'bottom'
                            });
                        } else {
                            fnPostErrMessage(err1);
                        }
                    }
                });
            } else {
                fnPostErrMessage(err);
            }
        }
    });
};

// ajax同步访问
var asynAjax = {
    get: function(path, where, page, limit, fn) {
        var obj = new XMLHttpRequest();
        var url = app.apipath + path + '?filter={"where":' + JSON.stringify(where) + ',"page":' + page + ',"limit":' + limit + '}';
        obj.open('GET', url, false);
        obj.onreadystatechange = function() {
            var ret, err;
            if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) {
                ret = obj.responseText;
            } else {
                err = obj.responseText;
            }
            fn.call(ret, ret);
        };
        obj.send();

    },
    post: function(path, data, fn) {
        var obj = new XMLHttpRequest();
        obj.open("POST", url, false);
        obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        obj.onreadystatechange = function() {
            var ret, err;
            if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) {
                ret = obj.responseText;
            } else {
                err = obj.responseText;
            }
            fn.call(ret, ret);
        };
        obj.send(data);
    }
}
function CQfnGet(path, data, isDelete, callback) {
    if(api.connectionType == 'none'){
      api.toast({
          msg: '网络连接错误,请检查网络是否连接',
          duration: 2000,
          location: 'bottom'
      });
      return false;
    }
    app.apipath = 'http://' + $api.getStorage('apiUrl');
    var headers = {};
    api.showProgress({
        title: '加载中',
        text: '',
        modal: false
    });
    if (isDelete) {
        headers["Content-Type"] = 'application/json';
    }
    // headers.Authorization = $api.getStorage('loginInfo');
    api.ajax({
        url: app.apipath + path,
        method: 'get',
        timeout: 15,
        dataType: 'json',
        headers: headers,
        data:{
          body:data
        }
    }, function(ret, err) {
        api.hideProgress()
        callback(ret,err)
    })
};
function CQfnPost(path, data, isDelete, callback) {
    if(api.connectionType == 'none'){
      api.toast({
          msg: '网络连接错误,请检查网络是否连接',
          duration: 2000,
          location: 'bottom'
      });
      return false;
    }
    app.apipath = 'http://' + $api.getStorage('apiUrl');
    var headers = {};
    api.showProgress({
        title: '加载中',
        text: '',
        modal: false
    });
    if (isDelete) {
        headers["Content-Type"] = 'application/json';
    }
    api.ajax({
        url: app.apipath + path,
        method: 'post',
        timeout: 15,
        dataType: 'json',
        headers: headers,
        data:{
          body:data
        }
    }, function(ret, err) {
      api.hideProgress();
      if(ret){
        callback(ret, err);
      }else if(err){
        api.toast({
            msg:err.body.error.message,
            duration: 2000,
            location: 'top'
        });
      }else {
        api.toast({
            msg:'网络超时，请重试',
            duration: 2000,
            location: 'top'
        });
      }
    })
};
