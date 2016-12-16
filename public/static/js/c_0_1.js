/*from tccdn minify at 2014-10-31 9:37:21,file：/cn/public/js/common/c_0_1.js?v=20121115*/

/**
* @version 2011-04-01 登录模块 等公共代码
* @modify hjr(sadhu) 规避国际机票因为老脚本的存在而导致页脚图片更换两次
* @modify hjr(sadhu) fish 化
*/

//<<-----------------登录模块----------------------
(function (window) {
    /**
    *  MD5 (Message-Digest Algorithm)
    *  http://www.webtoolkit.info/
    */
    var MD5 = function (string) {
        function RotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        function AddUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                }
                else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            }
            else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        function F(x, y, z) {
            return (x & y) | ((~x) & z);
        }
        function G(x, y, z) {
            return (x & z) | (y & (~z));
        }
        function H(x, y, z) {
            return (x ^ y ^ z);
        }
        function I(x, y, z) {
            return (y ^ (x | (~z)));
        }

        function FF(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function GG(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function HH(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function II(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };
        function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };

        function WordToHex(lValue) {
            var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        };

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        };

        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

        string = Utf8Encode(string);

        x = ConvertToWordArray(string);

        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;

        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = AddUnsigned(a, AA);
            b = AddUnsigned(b, BB);
            c = AddUnsigned(c, CC);
            d = AddUnsigned(d, DD);
        }

        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

        return temp.toLowerCase();
    }

    window.MD5 = MD5;

    //<<--------AjaxObj-------------

    //导出
    var Ajax = function (param) {
        fish.lang.extend(this, param);
    };
    Ajax.prototype = {
        abort: function () {
            this.ajaxObj && this.ajaxObj.abort();
        },
        send: function () {
            this.ajaxObj = fish.ajax({
                type: "json",
                url: this.url,
                timeout: this.timeout,
                data: this.data,
                fn: this.fn,
                err: this.err,
                onTimeout: this.onTimeout
            })
        }

    }
    //----------AjaxObj----------->>


    /**
    * 格式化表单
    * @param {DOM} form 要格式化的表单元素
    */
    function serialize(form) {
        var parts = new Array();
        var field = null;
        for (var i = 0, len = form.elements.length; i < len; i++) {
            field = form.elements[i];
            if (field.name === "") {
                continue;
            }
            switch (field.type) {
                case "password": //密码密文MD5一次
                    parts.push(encodeURIComponent(field.name) + "=" +
                    encodeURIComponent(MD5(field.value)));
                    break;
                case "button":
                    break;
                case "checkbox":
                    if (!field.checked) {
                        break;
                    }
                    /* 默认格式 */
                default:
                    parts.push(encodeURIComponent(field.name) + "=" +
                    encodeURIComponent(field.value));
            }
        }
        return parts.join("&");
    }




    //<<-------------登录对象--------------
    function get(id) {
        return document.getElementById(id);
    }
    //闭包捕获
    function closer(that, fn) {
        return function () {
            fn.apply(that, arguments);
        }
    }


    function setTips(obj, text) {
        if (obj) {
            obj.style.visibility = "visible";
            obj.innerHTML = text;
        }
    }

    //<<--------行为对象-----
    function logObj(param) {
        var defaultParam = {
            url: "", //请求地址
            timeout: 8000, //超时时间 
            inFormId: "", //登录表单的id
            outFormId: "#", //退出表单的id(可选)
            nameInputId: "", //用户名input
            passWordInputId: "", //密码input
            remebInputId: "", //记住密码input
            validCodeInputId: "", //验证码
            loginBtnId: "", //登录按钮
            waitLoginId: "", //登录中的等待
            logoutBtnId: "#", //退出按钮(可选)
            waitLogoutId: "#", //退出中的等待(可选)
            tipsId: "#", //提示信息(可选)
            userNameId: "#", //用户名id(可选)
            onSuccessLogin: function () { }, //成功登录的回调(可选)
            onSuccessExit: function () { }, //成功退出的回调(可选)
            onPassFailed: function () { }, //密码失败的回调(可选)
            onNameFailed: function () { }, //用户名错的回调(可选)
            onLoginFailed: function () { }, //退出失败的回调(可选)
            onExitFailed: function () { }, //退出失败的回调(可选)
            onLogining: function () { }, //登录开始的回调(可选)
            onExiting: function () { }, //退出开始的回调(可选),
            onAbort: function () { }, //手动中断时的回调
            onTimeout: function () { } //超时回调(可选)
        }
        fish.lang.extend(defaultParam, param);
        fish.lang.extend(this, defaultParam);
        this.init();
    }

    logObj.prototype = {
        set: function (param) {
            fish.lang.extend(this, param);
        },

        init: function () {
            this.inForm = get(this.inFormId);
            this.outForm = get(this.outFormId);
            this.nameInput = get(this.nameInputId);
            this.passWordInput = get(this.passWordInputId);
            this.remebInput = get(this.remebInputId);
            this.loginBtn = get(this.loginBtnId);
            this.logoutBtn = get(this.logoutBtnId);
            this.waitLogin = get(this.waitLoginId);
            this.waitLogout = get(this.waitLogoutId);
            this.tips = get(this.tipsId);
            this.userName = get(this.userNameId);
            this.validCodeInput = get(this.validCodeInputId);


            var that = this;

            //登录
            this.inForm.onsubmit = function (event) {
                fish.preventDefault(event);
            };
            this.loginBtn.onclick = function () {
                that.login.call(that);
            };
            //退出
            if (this.outForm) {
                this.outForm.onsubmit = function (event) {
                    fish.preventDefault(event);
                };
            }
            if (this.logoutBtn) {
                this.logoutBtn.onclick = function () {
                    that.exit.call(that);
                };
            }




            this.nameInput.setAttribute("placeholderOption", "手机/邮箱");

            this.nameInput.onfocus =
			this.passWordInput.onfocus = function (event) {
			    this.value = fish.trim(this.value);
			    //if (!('placeholder' in document.createElement('input')) && this.getAttribute("placeholder")) {
			    if (this.value === this.getAttribute("placeholderOption")) {
			            this.value = "";
			        }
			        this.style.color = "#000000";
			   // }
			    this.select();
			}
            var fnName;
            this.nameInput.onblur = fnName = function () {
                //if (!('placeholder' in document.createElement('input')) && this.getAttribute("placeholderOption")) {
                    this.value = fish.trim(this.value);
                    if (this.value === "") {
                        this.style.color = "#666666";
                        this.value = this.getAttribute("placeholderOption");
                    }
                    else if (this.value === this.getAttribute("placeholderOption")) {
                        this.style.color = "#666666";
                    }
                    else {
                        this.style.color = "#000000";
                    }
                //}
            };
            fnName.apply(this.nameInput);

            this.nameInput.onkeydown =
			this.passWordInput.onkeydown =
			this.remebInput.onkeydown = function (e) {
                //preventDefault(e);
                var keycode = window.ActiveXObject ? event.keyCode : e.which;
                if (keycode == 13) {//回车
                    fish.preventDefault(e);
                    that.login();
                }
            }
            if (this.validCodeInput) {
                this.validCodeInput.onkeydown = function (e) {
                    //preventDefault(e);
                    var keycode = window.ActiveXObject ? event.keyCode : e.which;
                    if (keycode == 13) {//回车
                        fish.preventDefault(e);
                        that.login();
                    }
                }
            }

            //创建逻辑核心
            this.lCore = new LCore({
                url: this.url,
                timeout: this.timeout,
                //都和超时出错的提示一样
                onTimeout: closer(that, that.onTimeout),
                onError: closer(that, that.onFailed),
                onLoginCallBack: closer(that, that.onLoginCallBack),
                onExitCallBack: closer(that, that.onExitCallBack),
                onStartLogin: closer(that, that.onStartLogin),
                onStartExit: closer(that, that.onStartExit),
                onAbort: closer(that, that.onAbort)
            });


        },

        showLogining: function () {
            this.loginBtn.style.display = "none";
            this.waitLogin.style.display = "block";
            if (this.tips) {
                this.tips.style.visibility = "hidden";
            }

            this.nameInput.disabled =
			this.passWordInput.disabled =
			this.remebInput.disabled = "disabled";
        },
        showLoginNormal: function () {
            this.loginBtn.style.display = "inline";
            this.waitLogin.style.display = "none";

            this.nameInput.disabled =
			this.passWordInput.disabled =
			this.remebInput.disabled = null;
        },

        showExiting: function () {
            if (this.logoutBtn) {
                this.logoutBtn.style.display = "none";
            }
            if (this.waitLogout) {
                this.waitLogout.style.display = "block";
            }

        },
        showExitNormal: function () {
            if (this.logoutBtn) {
                this.logoutBtn.style.display = "inline";
            }
            if (this.waitLogout) {
                this.waitLogout.style.display = "none";
            }
        },

        logState: function () {
            return this.lCore.logState();
        },

        login: function () {
            if (fish.trim(this.nameInput.value).length === 0 || fish.trim(this.nameInput.value) == "手机/邮箱") {
                setTips(this.tips, "请输入您的用户名");
                this.onLoginFailed();
            }
            else if (fish.trim(this.passWordInput.value).length === 0) {
                setTips(this.tips, "请输入您的密码");
                this.onLoginFailed();
            } else if (this.validCodeInput && fish.trim(this.validCodeInput.value).length === 0) {
                setTips(this.tips, "请输入验证码");
                this.onLoginFailed();
            }
            else {
                //开始登陆
                this.lCore.login(this.inForm, this.timeout);
                //清空密码
                this.passWordInput.value = "";
            }
        },

        exit: function () {
            if (this.outForm) {
                this.lCore.exit(this.outForm, this.timeout);
            }
        },

        abort: function () {
            if (this.logState() === "login") {
                this.showLoginNormal();
            }
            else if (this.logState() === "exit") {
                this.showExitNormal();
            }
            if (this.tips) {
                this.tips.style.visibility = "hidden";
            }
            this.lCore.abort();
        },

        onFailed: function (data) {
            if (this.logState() === "login") {
                this.showLoginNormal();
                setTips(this.tips, "抱歉，登录失败，请重试。");
                this.onLoginFailed(data);
            }
            else if (this.logState() === "exit") {
                this.showExitNormal();
                this.onExitFailed(data);
            }
        },
        //一系列事件
        onLoginCallBack: function (data) {
            this.showLoginNormal();
            switch (data.state) {
                case 100:
                    this.onSuccessLogin(data);
                    if (this.userName) {
                        this.userName.innerHTML = data.name;
                    }
                    break;
                case 200:
                    this.onPassFailed(data);
                    this.onLoginFailed(data);
                    this.passWordInput.select();
                    setTips(this.tips, "用户名或密码错误，请重新输入。");
                    break;
                case 300:
                    this.onNameFailed(data);
                    this.onLoginFailed(data);
                    this.nameInput.select();
                    setTips(this.tips, "用户名或密码错误，请重新输入。");
                    break;
                case 400:
                    this.onLoginFailed(data);
                    this.validCodeInput.select();
                    setTips(this.tips, "验证码错误，请重新输入。");
                    break;
                default:
                    this.onFailed(data);
            }
        },
        onExitCallBack: function (data) {
            this.showExitNormal();
            //隐藏提示信息
            if (this.tips) {
                this.tips.style.visibility = "hidden";
            }
            switch (data.state) {
                case 100:
                    this.onSuccessExit(data);
                    //cookie
                    fish.cookie.set({ name: "loginRecord", days: -1 });
                    break;
                default:
                    this.onFailed(data);
            }
        },

        onStartLogin: function () {
            this.onLogining();
            this.showLogining();
        },

        onStartExit: function () {
            this.onExiting();
            this.showExiting();
        }



    }
    //--------行为对象---->>


    //<<-------逻辑对象----

    function LCore(param) {
        var defaultParam = {
            url: "",
            timeout: 8000,
            //连接超时
            onTimeout: function () { },
            //退出时的回调
            onAbort: function () { },
            //连接返回出错的回调
            onError: function () { },
            //登录信息返回后的回调
            onLoginCallBack: function () { },
            //注销信息返回后的回调
            onExitCallBack: function () { },
            //开始登录的回调
            onStartLogin: function () { },
            //开始注销的回调
            onStartExit: function () { }
        }
        fish.lang.extend(defaultParam, param);
        fish.lang.extend(this, defaultParam);
        this.init();
    }


    LCore.prototype = {
        init: function () {
            var that = this;
            this.ajaxObj = new Ajax({
                url: this.url,
                timeout: this.timeout,
                data: "",
                fn: function (data) {
                    if (that.logState() === "login") {
                        that.onLoginCallBack(data);
                    }
                    else if (that.logState() === "exit") {
                        that.onExitCallBack(data);
                    }
                },
                onTimeout: that.onTimeout,
                err: that.onError
            });
        },

        //检查当前状态
        logState: function () {
            if (this.ajaxObj.data.indexOf("action=login") >= 0) {
                return "login";
            }
            else if (this.ajaxObj.data.indexOf("action=exit") >= 0) {
                return "exit";
            }
        },

        //登录开始
        login: function (form) {
            this.onStartLogin();
            var data = serialize(form);
            this.setCookie(data);
            this.ajaxObj.data = data + "&action=login";
            this.ajaxObj.send();
            //this.logining = true;
        },


        //注销开始
        exit: function (form) {
            this.onStartExit();
            this.ajaxObj.data = serialize(form) + "&action=exit";
            this.ajaxObj.send();
        },

        abort: function () {
            this.ajaxObj.abort();
            this.onAbort();
        },

        //使用data数据中的remIt键值来作为保存天数，默认7天
        setCookie: function (data) {
            var dataArray = data.split("&"), days = 7, equalIndex, save = true;
            for (var n = dataArray.length - 1; n >= 0; n--) {
                if (dataArray[n].indexOf("remIt") >= 0 &&
					dataArray[n].indexOf("remIt") <= (equalIndex = dataArray[n].indexOf("="))) {
                    days = parseInt(dataArray[n].slice(equalIndex + 1));
                    if (isNaN(days) || days <= 0) {
                        fish.cookie.set({ name: "loginRecord", days: -1 });
                        return;
                    }
                    dataArray.splice(n, 1);
                    save = false;
                    break;
                }
            }
            if (save) {
                fish.cookie.set({ name: "loginRecord", days: -1 });
            }
            else {
                fish.cookie.set({ name: "loginRecord", value: dataArray.join("&"), days: days, domain: strHost, encode: false, path: "/" });
            }
        }



    };
    //------逻辑对象----->>

    //---------------登录对象------------>>
    window.logObj = logObj;
})(window);


//var strHost;
//if (window.location.host.indexOf("17u.cn") != -1) {
//    strHost = ".17u.cn";
//}
//else {
//    strHost = "";
//}
var strHost;
strHost = getCookieDomain();
function getCookieDomain()
{
    if( location.hostname.match(/^(\d+\.\d+\.\d+\.\d+)|(localhost)$/))
    {
        return location.hostname;
    }
    else
    {
        return /.*(\..*\..*)$/.exec(location.hostname)[1];
    }
}

//加入到收藏夹
function addBookmark() {
    var url = parent.location.href,
        title = document.title;
    if (window.sidebar) { // Mozilla Firefox Bookmark
        window.sidebar.addPanel(title, url, "");
    } else if (document.all) { // IE Favorite
        window.external.AddFavorite(url, title);
    } else if (window.opera) { // Opera 7+
        return false;
    } else {
        alert('请按 Ctrl + D 为chrome浏览器添加书签!');
    }
}

//执行book页面头部登录初始化
function initBookLog(tcLog) {


    function get(id) {
        return document.getElementById(id);
    }

    get("account").disabled =
	get("actpwd").disabled =
	get("rem_it_1w").disabled = null;

    get("cancel_img").onclick =
	get("loginText").onclick =
	get("sign_in_cancel").onclick = function (event) {

	    fish.preventDefault(event);
	    if (get("sign_in_form_backdrop").style.display === "block") {
	        loginHide();
	        loginHide();
	        tcLog.abort();
	    }
	    else {
	        loginShow();
	    }
	};


    fish.all(document).on("click", function (event) {
        var e = event ? event : window.event;
        var tar = e.target || e.srcElement;
        var li = get("loginLi");
        while (tar !== document.body && tar !== li && tar !== null) {
            tar = tar.parentNode;
        }
        if (tar === document.body) {
            if (get("loginBar").style.display === "block") {
                tcLog.abort();
            }
            loginHide();
        }
    });


    function loginShow(callback) {
        setTimeout(function () {
            //loginShow(true);
            get("loginText").className = "set_float_on";
            get("loginTextArrow").className = "sign_in_up";
            get("sign_in_form_backdrop").style.display = "block";
            get("sign_in_form_box").style.display = "block";
            callback && callback();
        }, 100);

    }

    function loginHide(callback, once) {
        //loginShow();
        get("loginText").className = "set_float";
        get("loginTextArrow").className = "sign_in_down";
        if (!once) {
            setTimeout(function () {
                loginHide(null, true);
            }, 1);
        }
        get("sign_in_form_backdrop").style.display = "none";
        get("sign_in_form_box").style.display = "none";
        if (callback) {
            callback();
        }
    }

    window.loginHide = loginHide;
    window.loginShow = loginShow;

}


//执行CN_top初始化
function initLog(tcLog) {

    //我的同程
    var ea_mytc_ul_backdrop = get("ea_mytc_ul_backdrop");
    var ea_mytc_ul = get("ea_mytc_ul");
    var myTcArrow = get("myTcArrow");
    var myTcTitle = get("myTcTitle");
    var myTc = get("myTc");

    //暂时保留避免报错
    function loginShow() {}
    function loginHide() {}

    function myTcHide(){
        ea_mytc_ul_backdrop.style.display = "none";
        ea_mytc_ul.style.display = "none";
        myTcTitle.className = "set_float";
        myTcArrow.className = "mytc_down";
    }
    function myTcShow(){
        ea_mytc_ul_backdrop.style.display = "block";
        ea_mytc_ul.style.display = "block";
        myTcTitle.className = "set_float_on";
        myTcArrow.className = "mytc_up";
    }

    function get(id) {
        return document.getElementById(id);
    }



    //绑定收藏按钮
    get("bookmark") && (get("bookmark").onclick = addBookmark);



//    //点击其他区域收起气泡
//    fish.all(document).on("click", function (event) {
//        var tar = fish.getTarget(event);
//        var li = get("loginBox");
//        while (tar !== document.body && tar !== li && tar !== null) {
//            tar = tar.parentNode;
//        }
//        if (tar === document.body) {
//            if (get("login_bar").style.display === "block") {
//                tcLog.abort();
//            }
//            loginHide();
//        }
//    });

    ea_mytc_ul_backdrop.style.width = myTc.clientWidth + "px";
    ea_mytc_ul.style.width = myTc.clientWidth - 2 + "px";

    fish.all(myTc).hover(myTcShow, myTcHide);

    //点击其他区域收起气泡
//    fish.all(document).on("click", function (event) {
//        var tar = fish.getTarget(event);
//        var li = get("myTc");
//        while (tar !== document && tar !== li && tar !== null) {
//            tar = tar.parentNode;
//        }
//        if (tar === document) {
//            ea_mytc_ul_backdrop.style.display = "none";
//            ea_mytc_ul.style.display = "none";
//            myTcTitle.className = "set_float";
//            myTcArrow.className = "mytc_down";
//        }
//    });
//
    fish.one("#myTc").effect({outerHide:false, outerFn:myTcHide});


    window.loginHide = loginHide;
    window.loginShow = loginShow;

};
//刷新页面
function reFlash() {
    try {
        if (!document.execCommand('Refresh', false, 0)) {
            window.location.reload();
        }
    }
    catch (e) {
        window.location.reload();
    }
}


//-------------------登录模块-------------------->>


//<<-----------refid相关-----------------------
(function () {
    function dumpRefid(forceSEKeyWords) {
        var refId = getRefid();
        var referrer = encodeURIComponent(document.referrer);
        if (document.referrer.indexOf("http://www.hao123.com")>-1)
        {
            refId = "12034002";
        }

        var url = "RefId=" + refId, name = 'CNSEInfo', date = new Date();
        var newArr = AnalyseSearchEngine();

        //gb2312的编码必须由服务端转换  JSONP
        if (!forceSEKeyWords && newArr[1] === "gb2312") {
            var sElem = document.createElement("script");
            sElem.src = "http://www"+strHost+"/AjaxHelper/Gb2312ToUtf8.ashx?words=" + newArr[2] + "&callback=reDumpRefid";
            document.getElementsByTagName('head')[0].appendChild(sElem);
            return;
        }

        newArr[0] = encodeURIComponent(newArr[0]);
        newArr[2] = forceSEKeyWords ? forceSEKeyWords : newArr[2];


        if ((referrer.indexOf(".17u.cn") > -1) ||
            (referrer.indexOf(".17u.com") > -1) ||
            (referrer.indexOf(".ly.com") > -1) ||
            (referrer.indexOf(".LY.com") > -1) ||
            (referrer.indexOf(".tongcheng.com") > -1) ||
			(referrer.indexOf("localhost") > -1) ||
			(referrer.indexOf("192.168.") > -1) ||
			(referrer.indexOf("172.16.") > -1) ||
			referrer === "") {
            //如果是站内的跳转或者直接输入，从cookie中获取值
            newArr[0] = encodeURIComponent(fish.cookie.get("CNSEInfo", "SEFrom"));
            newArr[2] = encodeURIComponent(fish.cookie.get("CNSEInfo", "SEKeyWords"));
            referrer = encodeURIComponent(fish.cookie.get("CNSEInfo", "RefUrl"));
        }

        //过滤
        referrer = referrer == undefined ? "" : referrer;
        referrer = referrer == "undefined" ? "" : referrer;
        newArr[0] = newArr[0] == undefined ? "" : newArr[0];
        newArr[0] = newArr[0] == "undefined" ? "" : newArr[0];
        newArr[2] = newArr[2] == undefined ? "" : newArr[2];
        newArr[2] = newArr[2] == "undefined" ? "" : newArr[2];

        //保存
        var SEFrom = 'SEFrom=' + newArr[0];
        var SEKeyWords = 'SEKeyWords=' + newArr[2];
        var RefUrl = 'RefUrl=' + referrer;
        var value = url + '&' + SEFrom + '&' + SEKeyWords + '&' + RefUrl;
        var days = 0;
        //过期时间
        // date.setTime(date.getTime() + (12 * 60 * 60 * 1000));
        
        if(refId + "" === "6076168") {
            days = 1;
        }
        //iCookie.del(name);
        fish.cookie.set({name:name, value:value,  path: '/', encode: false, days: days}); //为了解决360重写会话cookie的bug
        fish.cookie.set({name:name, value:value,  path: '/', domain: strHost, encode: false, days: days });
        fish.cookie.set({name:name, value:value, days:-1, path: '/', encode: false }); //为了解决360重写会话cookie的bug
        fish.cookie.set({name:name, value:value, path: '/', domain: strHost, encode: false, days: days });

        //iCookie.del("17uCNRefId");
        fish.cookie.set({name:"17uCNRefId", value:value,  path: '/', encode: false, days: days }); //为了解决360重写会话cookie的bug
        fish.cookie.set({name:"17uCNRefId", value:value,  path: '/', domain: strHost, encode: false, days: days });
        fish.cookie.set({name:"17uCNRefId", value:value, days:-1, path: '/', encode: false }); //为了解决360重写会话cookie的bug
        fish.cookie.set({name:"17uCNRefId", value:value, path: '/', domain: strHost, encode: false, days: days });

        //iCookie.del("TicketSEInfo");
        fish.cookie.set({name:"TicketSEInfo", value:value,  path: '/', encode: false, days: days }); //为了解决360重写会话cookie的bug
        fish.cookie.set({name:"TicketSEInfo", value:value,  path: '/', domain: strHost, encode: false, days: days });
        fish.cookie.set({name:"TicketSEInfo", value:value, days:-1, path: '/', encode: false }); //为了解决360重写会话cookie的bug
        fish.cookie.set({name:"TicketSEInfo", value:value, path: '/', domain: strHost, encode: false, days: days });
       
    };


    function reDumpRefid(data) {
        if (data && data.words && data.words !== "") {
            dumpRefid(data.words);
        }
        else {
            dumpRefid("");
        }
    }

    function getRefid() {
        var url = window.location.href.toLowerCase(), refid, dStr;
        refid = fish.cookie.get("CNSEInfo", "RefId");

        var dIndex = url.indexOf("#");
        var pIndex = url.indexOf("?");

        //"#xxx" 获取xxx的内容
        if (dIndex > -1) {
            dStr = url.substring(dIndex + 1);
            var rid = findParam(dStr, "refid");
            if (rid !== "" && rid !== "undefined" && rid != undefined) {
                refid = rid;
            }
        }

        //?
        if (pIndex > -1) {
            //"?xxx#..." 获取xxx的内容
            if (dIndex > -1 && pIndex < dIndex) {
                dStr = url.substring(pIndex + 1, dIndex);
            }
            //"?xxx"
            //"#....?xxx" 获取xxx的内容
            else {
                dStr = url.substring(pIndex + 1);
            }
            var rid = findParam(dStr, "refid");
            if (rid !== "" && rid !== "undefined" && rid != undefined) {
                refid = rid;
            }
        }
        refid = refid == undefined ? "0" : refid;
        refid = refid == "undefined" ? "0" : refid;
        return refid === "" ? "0" : refid;
    }

    function getMemberId() {
        var memberId = fish.cookie.get("CNMember","MemberId");
        memberId = memberId == undefined ? "0" : memberId;
        memberId = memberId == "undefined" ? "0" : memberId;
        return memberId === "" ? "0" : memberId;
    }


    function findParam(str, key) {
        var strArr = str.split("&");
        for (var n = 0; n < strArr.length; n++) {
            if (strArr[n].substring(0, key.length + 1) == (key + '=')) {
                return strArr[n].substring(key.length + 1);
            }
        }
        return "";
    }


    function AnalyseSearchEngine() {
        var newArr = new Array('', '', '');
        if (document.referrer && document.referrer != '') {
            var refer = document.referrer;
            var seFrom, encode, seKeyWords;
            if (refer.match(new RegExp('baidu\\.'))) {
                seFrom = 'baidu';
                encode = 'gb2312';
                if (refer.match(new RegExp('(\\?|\\&)(wd|word)\\=([^\\&]+)'))) {
                    var arr = refer.match(new RegExp('(\\?|\\&)(wd|word)\\=([^\\&]+)'));
                    seKeyWords = arr[3];
                    if (refer.match(new RegExp('(\\?|\\&)(ie)\\=utf\\-8'))) {
                        encode = 'utf-8';
                    }
                }
                newArr[0] = seFrom;
                newArr[1] = encode;
                newArr[2] = seKeyWords;
                return newArr;
            }
            if (refer.match(new RegExp('google\\.'))) {
                seFrom = 'google';
                encode = 'utf-8';
                if (refer.match(new RegExp('(\\?|\\&)q\\=([^\\&]+)'))) {
                    var arr = refer.match(new RegExp('(\\?|\\&)q\\=([^\\&]+)'));
                    seKeyWords = arr[2];
                    if (refer.match(new RegExp('(\\?|\\&)(ie)\\=(gb2312)|(gb)'))) {
                        encode = 'gb2312';
                    }
                }
                newArr[0] = seFrom;
                newArr[1] = encode;
                newArr[2] = seKeyWords;
                return newArr;
            }
            if (refer.match(new RegExp('yahoo\\.'))) {
                seFrom = 'yahoo';
                encode = 'utf-8';
                if (refer.match(new RegExp('(\\?|\\&)p\\=([^\\&]+)'))) {
                    var arr = refer.match(new RegExp('(\\?|\\&)p\\=([^\\&]+)'));
                    seKeyWords = arr[2];
                    if (refer.match(new RegExp('(\\?|\\&)(ei)\\=(GBK|gbk)'))) {
                        encode = 'gbk';
                    }
                }
                newArr[0] = seFrom;
                newArr[1] = encode;
                newArr[2] = seKeyWords;
                return newArr;
            }
            if (refer.match(new RegExp('bing\\.'))) {
                seFrom = 'bing';
                encode = 'utf-8';
                if (refer.match(new RegExp('(\\?|\\&)q\\=([^\\&]+)'))) {
                    var arr = refer.match(new RegExp('(\\?|\\&)q\\=([^\\&]+)'));
                    seKeyWords = arr[2];
                }
                newArr[0] = seFrom;
                newArr[1] = encode;
                newArr[2] = seKeyWords;
                return newArr;
            }
            if (refer.match(new RegExp('soso\\.'))) {
                seFrom = 'soso';
                encode = 'gb2312';
                if (refer.match(new RegExp('(\\?|\\&)w\\=([^\\&]+)'))) {
                    var arr = refer.match(new RegExp('(\\?|\\&)w\\=([^\\&]+)'));
                    seKeyWords = arr[2];
                    if (refer.match(new RegExp('(\\?|\\&)(ie)\\=(UTF|utf)\\-8'))) {
                        encode = 'utf-8';
                    }
                }
                newArr[0] = seFrom;
                newArr[1] = encode;
                newArr[2] = seKeyWords;
                return newArr;
            }
            if (refer.match(new RegExp('sogou\\.'))) {
                seFrom = 'sogou';
                encode = 'utf-8';
                if (refer.match(new RegExp('(\\?|\\&)query\\=([^\\&]+)'))) {
                    var arr = refer.match(new RegExp('(\\?|\\&)query\\=([^\\&]+)'));
                    seKeyWords = arr[2];
                }
                newArr[0] = seFrom;
                newArr[1] = encode;
                newArr[2] = seKeyWords;
                return newArr;
            }
            if (refer.match(new RegExp('iask\\.'))) {
                seFrom = 'iask';
                encode = 'gb2312';
                if (refer.match(new RegExp('(\\?|\\&)q\\=([^\\&]+)'))) {
                    var arr = refer.match(new RegExp('(\\?|\\&)q\\=([^\\&]+)'));
                    seKeyWords = arr[2];
                }
                newArr[0] = seFrom;
                newArr[1] = encode;
                newArr[2] = seKeyWords;
                return newArr;
            }
            if (refer.match(new RegExp('youdao\\.'))) {
                seFrom = 'youdao';
                encode = 'utf-8';
                if (refer.match(new RegExp('(\\?|\\&)q\\=([^\\&]+)'))) {
                    var arr = refer.match(new RegExp('(\\?|\\&)q\\=([^\\&]+)'));
                    seKeyWords = arr[2];
                    if (refer.match(new RegExp('(\\?|\\&)(ie)\\=(gb2312)|(gb)'))) {
                        encode = 'gb2312';
                    }
                }
                newArr[0] = seFrom;
                newArr[1] = encode;
                newArr[2] = seKeyWords;
                return newArr;
            }
        }
        return newArr;
    }

    window.reDumpRefid = reDumpRefid;
    window.getRefid = getRefid;
    window.getMemberId = getMemberId;
    window.dumpRefid = dumpRefid;
})();


//----------refid相关----------------------->>

///**
//* @author sadhu
//* @version 2011-11-18 页脚图片更替
//* @modify fishinizing
//*/
////<<---------- footer img man 页脚图片更替 -----------------------
//var footImgMan = {
//    list: [
//		'酒店',
//		'机票',
//		'景点',
//		'租车',
//		'旅游度假',
//		'团购'
//	],
//    whichProject: function () {
//        var p = fish.all('#header .header_nav_on');
//        if (p[0]) {
//            var n = p[0].innerHTML;
//            var projectNames = footImgMan.list;
//            for (var i = 0, l = projectNames.length; i < l; i += 1) {
//                if (n.indexOf(projectNames[i]) > -1) {
//                    return (projectNames[i]);
//                }
//            }
//        }
//    },
//    preSort: function () {
//        var f = fish.all('#footer .footer_img .ft_set_bg');
//        if (f[0]) {
//            var footImgsWrap = f[0];
//            var footImgs = fish.all('#footer .footer_img .ft_set_bg a');
//            footImgsWrap.appendChild(footImgs[2]);
//            footImgsWrap.appendChild(footImgs[3]);
//            return fish.all('#footer .footer_img .ft_set_bg a');
//        }
//    },
//    process: function (project) {
//        if (project) {
//            if (project === '机票') {
//                var array = fish.all('#footer .footer_img .ft_set_bg a');
//                if (array[array.length - 1].className.indexOf('fsb_4') > -1) {
//                    return;
//                }

//            }
//            var imgsWillChange = footImgMan.preSort();
//            function modifyImgAndHref(projectImgName) {
//                imgsWillChange[4].style.background = 'url(http://img1.40017.cn/cn/new_ui/public/images/' + projectImgName + '5.png) no-repeat 0 0';
//                imgsWillChange[5].style.background = 'url(http://img1.40017.cn/cn/new_ui/public/images/' + projectImgName + '6.png) no-repeat 0 0';
//            }
//            switch (project) {
//                case '酒店':
//                    modifyImgAndHref('hotel');
//                    imgsWillChange[4].href = imgsWillChange[5].href = 'http://www.17u.cn/subject/sidabaozhang/';
//                    break;
//                case '机票':
//                    modifyImgAndHref('flight');
//                    imgsWillChange[4].href = 'http://www.17u.cn/flight/zt/catazizhi.aspx';
//                    imgsWillChange[5].href = 'http://www.17u.cn/flight/zt/dijiabaozhang.html';
//                    break;
//                case '景点':
//                    // to process
//                    break;
//                case '租车':
//                    // to process
//                    break;
//                case '旅游度假':
//                    // to process
//                    break;
//                case '团购':
//                    // to process
//                    break;
//                default: break;
//            }
//        }
//    }
//};
//fish.loaded(function () { footImgMan.process(footImgMan.whichProject()) });
////---------- footer img manager 页脚图片更替 ----------------------->>

try {
    var headerTop = document.getElementById("header");
    if (navigator.userAgent.indexOf("MSIE 6.0") == -1 && headerTop) {
        var headerTop_li = headerTop.getElementsByTagName("li");

        for (var a = 0; a < headerTop_li.length; a++) {
            if (headerTop_li[a].className == "") {
                headerTop_li[a].onclick = function () {
                    for (var b = 0; b < headerTop_li.length; b++) {
                        if (headerTop_li[b].className == "header_nav_on") {
                            headerTop_li[b].className = "";
                        }
                    }
                    this.className = "header_nav_on";
                }
            }
        }
    }
}
catch (e) {

}

//-----登录/400/公告，模块状态更新----
function getLoginInfoCallback(data) {
    function get(id) {
        return document.getElementById(id);
    }
    //设置400电话
    function setTelephone(num){
        var proj = window._tcProject,
            proj400,
            subData,
            enable = true,
            type = "big",
            refid = getRefid();
        //默认使用其他项目的设置
        if(!proj){
            proj = "other";
        }
        //默认大电话，全部显示
        if(window._tc400data && window._tc400data[proj]){
            proj400 = window._tc400data[proj];
        }
        else if(window._tc400data && !window._tc400data[proj] && window._tc400data.other){
            proj400 = window._tc400data.other;
        }
        else{
            proj400 = { except: "big"};
        }

        //refid判断
        if(proj400.include){
            var catchit = false;
            for(var n=0; n<proj400.include.length; n++){
                subData = proj400.include[n];
                if(subData && subData.channel){
                    for(var i=0; i<subData.channel.length; i++){
                        if(subData.channel[i] == refid){
                            type = subData.type;
                            catchit = true;
                        }
                    }
                }

            }
            if(!catchit){
                type = proj400.except;
            }
        }else{
            type = proj400.except;
        }



        if(enable){
            switch(type){
                case "none":
                    break;
                case "little":
                    get("littletelephone_outer") && (get("littletelephone_outer").style.display = "inline");
                    get("littletelephone") && (get("littletelephone").innerHTML = num);
                    break;
                default:
                    get("headtelephone") && (get("headtelephone").innerHTML = num);
                    get("hotline_holder") && (get("hotline_holder").style.display = "block");
                    break;
            }

        }
        get("foottelephone") && (get("foottelephone").innerHTML = num);
    }
    if (data) {
        switch (data.state) {
            case 100:
                //更换头部登录状态
                loginState = data;
                get("user_name") && (get("user_name").innerHTML = data.username);
                get("login_bar") && (get("login_bar").style.display = "none");
                get("logged_bar") && (get("logged_bar").style.display = "block");
                get("loginBar") && (get("loginBar").style.display = "none");
                get("logoutBar") && (get("logoutBar").style.display = "block");
                window.onTcLoginSuccess && window.onTcLoginSuccess(data);
                //头部会员等级初始化
                fish.one("#memberLevelInfo").memberLevel();
                break;
            default:
                loginState = data;
                window.onTcLoginError && window.onTcLoginError(data);
                break;
        }
        get("bulletin") && (get("bulletin").innerHTML = data.bulletin);
        //400不同状态
        if(data.telephone){
            setTelephone(data.telephone)
        }
    }
    window.loginStateReady && window.loginStateReady();
}
//-----登录/400/公告，模块状态更新----


//--------热力图统计-------------


(function (doc, win) {
    var docm = doc.documentElement;

    function g_attr() {
        this.pid = 0; // PageId
        this.sp = 0; // SamplePercent 采用百分比 0~100
        this.pw = 0; // PageWidth页面有效点击宽度 (0页面全部有效)
        this.flag = true; // Flag点击时间间隔标志
        this.timer = null; // Timer定时器
        this.s_url = 'http://tctrack.17usoft.com/heatmap/ClickStream.ashx'; // 
        //this.s_url = 'http://172.16.18.135:2345/ClickStream.ashx'; // service url
    }

    g_attr.prototype = {
        // Submit
        smt: function (src) {
            var h = doc.getElementsByTagName("head")[0],
            s = doc.createElement("script");
            s.type = "text/JavaScript";
            s.src = src;
            h.appendChild(s)
        },
        // Validate
        vd: function (e) {
            if (this.flag == false || parseInt(Math.random() * 100) > this.sp) {
                return false;
            }
            //this.flag = false;
            // 获取点击位置
            var pos = this.mp(e);
            var c_x = pos.x; //e.pageX;
            var c_y = pos.y; //e.pageY;

            // 获取窗体文本区大小
            var psize = this.ps();
            var d_width = psize.PageW;
            var d_height = psize.PageH;


            // 如果不在有效区内
            if (this.pw > 0) {
                if (c_x < (d_width - this.pw) / 2 ||
                    c_x > (d_width - this.pw) / 2 + this.pw) {
                    return false;
                }
            }
            var that = this;
            this.flag = false;
            if (this.timer != null) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(function () {
                that.flag = true;
            }, 500);

            // 返回接口url
            return this.s_url +
                '?rx=' + (c_x - parseInt(d_width / 2, 10)) + // RelativeX
                '&ry=' + c_y + // RelativeY
                '&pid=' + this.pid + // PageId
                '&dt=' + new Date().getTime();
            ;
        },
        // MousePosition
        mp: function (e) {
            var posx = 0, posy = 0, e = e || win.event;
            if (e.pageX || e.pageY) {
                posx = e.pageX;
                posy = e.pageY;
            } else if (e.clientX || e.clientY) {
                posx = e.clientX + docm.scrollLeft + doc.body.scrollLeft;
                posy = e.clientY + docm.scrollTop + doc.body.scrollTop;
            };
            return { x: posx, y: posy };
        },
        // PageSize
        ps: function () {
            var scrW, scrH;
            if (win.innerHeight && win.scrollMaxY) {    // Mozilla
                scrW = win.innerWidth + win.scrollMaxX;
                scrH = win.innerHeight + win.scrollMaxY;
            }
            else if (doc.body.scrollHeight > doc.body.offsetHeight) {    // all but IE Mac
                scrW = doc.body.scrollWidth;
                scrH = doc.body.scrollHeight;
            } else if (doc.body) { // IE Mac
                scrW = doc.body.offsetWidth;
                scrH = doc.body.offsetHeight;
            }
            var winW, winH;
            if (win.innerHeight) { // all except IE
                winW = win.innerWidth;
                winH = win.innerHeight;
            } else if (docm && docm.clientHeight) {    // IE 6 Strict Mode
                winW = docm.clientWidth;
                winH = docm.clientHeight;
            } else if (doc.body) { // other
                winW = doc.body.clientWidth;
                winH = doc.body.clientHeight;
            } // for small pages with total size less then the viewport 
            var pageW = (scrW < winW) ? winW : scrW;
            var pageH = (scrH < winH) ? winH : scrH;
            //return {PageW:pageW, PageH:pageH, WinW:winW, WinH:winH};
            return { PageW: pageW, PageH: pageH };

        },
        // ClickEvent
        ce: function (e) {
            var src = this.vd(e);
            if (src != false) {
                this.smt(src);
            }
        }
    };

    win._tcHotmap = new g_attr();
})(document, window);


//头部导航气泡动画

(function(){
    function anim(elem, attr){
        var __txtElem = fish.all(".pop_txt", elem);
        __txtElem.html(fish.all(elem).attr(attr));
        if(fish.browser("ms", 6) || fish.browser("ms", 7) || fish.browser("ms", 8) || fish.browser("ms", 9)){
            fish.all(".popman", elem).anim("width:" + ( __txtElem.width() - 12 ) + "px");
        }
        else{
            fish.all(".popman", elem).css("width:" + ( __txtElem.width() - 12 ) + "px");
        }
    }
    fish.all("#navigator .hasPopman").hover(function(){
        anim(this, "overtext");
    }, function(){
        anim(this, "outtext");
    });
})()



