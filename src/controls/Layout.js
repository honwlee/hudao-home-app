define([
    "dojo/on",
    "dojo/topic",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/dom-style",
    "qscript/lang/Class",
    "udesktop/comctrls/BaseUi",
    "bundle!dependencies/services/iPopPage_lib#module",
    "udesktop/comctrls/LeftNavbar",
    "bundle!dependencies/services/topNavbar_ctrl",
    "bundle!dependencies/services/reshare_ctrl",
    "dojo/text!../templates/layout.html",
    "dojo/i18n!../nls/app",
    "./All",
    "./Mention",
    // "./Show",
    "./Setting",
    "toastr/toastr",
    "qface/controls/container/BorderContainer"
], function(on, topic, domConstruct, domClass, domStyle, Class,
    BaseUi, IPopPageLib, LeftNavbar, TopNavbarCtrl, ReshareCtrl, template, nlsApp, All,
    Mention, Setting, toastr) {
    var Layout = Class.declare({
        "-parent-": BaseUi,
        "-interfaces-": [IPopPageLib],
        "-protected-": {
            "-fields-": {
                "$$contentTemplate": template,
                baseClass: "home",
                fontAwesome: FontAwesome,
                app: null,
                nls: nlsApp
            },

            "-methods-": {
                init: function() {
                    this["super"]();
                    this.popPage = this.initPopPage(true);
                    this.domNode.appendChild(this.popPage.domNode);
                    on(this.popPage, "hide", Function.hitch(this, function() {
                        this.navbar.showPrevPage();
                    }));
                    this.initNav();
                    this.bindWebSocket();
                },

                bindWebSocket: function() {
                    var self = this;
                    runtime.channel.bind("users.send_noti", function(noti) {
                        // noti {type, targetId, toUserId, userId}
                        if (noti.receiverId == runtime.currentUserId) {
                            var leftBarKey = "notifications";
                            self.navbar.updateItemNum(leftBarKey, 1, noti.senderType);
                            toastr.options.onclick = function() {
                                self.navbar.cleanItemNum(leftBarKey);
                                self.broadcast(self._topicHubName + ":selectPage", {
                                    pageName: leftBarKey,
                                    sub: {
                                        subName: noti.senderType // mention, comment, like
                                    }
                                });
                            };
                            toastr.options.preventDuplicates = true;
                            toastr.options.closeButton = true;
                            toastr.options.timeOut = 0;
                            toastr.info("", self.nls.newNotiToastr);
                        }
                    });

                    runtime.dispatcher.bind("users.send_msg", function(msg) {
                        // msg {toUserId, userId}
                        if (msg.toUserId === runtime.currentUserId) {
                            toastr.info("", self.nls.newMessToastr);
                            self.navbar.updateItemNum("messages", 1);
                        }
                    });
                },

                initNav: function() {
                    this.navPages = {
                        all: {
                            name: this.nls.all,
                            "objClass": All,
                            iconClass: this.fontAwesome.home,
                            hidden: false,
                            opts: {
                                tweetsMemory: this.memory
                            },
                            container: this.centerNode,
                            callback: "allCbk"
                        },
                        mention: {
                            name: this.nls.mention,
                            "objClass": Mention,
                            iconClass: FontAwesome.notifications,
                            hidden: false,
                            opts: {
                                tweetsMemory: this.memory
                            },
                            container: this.centerNode,
                            callback: "mentionCbk"
                        },
                        // show: {
                        //     name: "show",
                        //     "objClass": Show,
                        //     hidden: true,
                        //     container: this.centerNode,
                        //     callback: "showCbk"
                        // },
                        setting: {
                            name: this.nls.setting,
                            "objClass": Setting,
                            hasSub: true,
                            iconClass: FontAwesome.setting,
                            hidden: false,
                            opts: {
                                socialInfo: this.socialInfo
                            },
                            container: this.centerNode
                        }
                    };

                    this.navbar = TopNavbarCtrl.createInstance({
                        // this.navbar = new LeftNavbar({
                        navItemsData: this.navPages,
                        host: this
                    });
                    this.navbar.selectItemByKey("all");
                    this.mainNode.addChild(this.navbar);
                }
            }
        },

        "-public-": {
            "-attributes-": {},

            "-methods-": {
                search: function() {

                },

                selectPage: function(pageName, opts) {
                    var deferred = new Deferred(),
                        self = this;
                    this.showLoading();
                    this.navbar.selectItemByKey(pageName, opts).then(function(page) {
                        deferred.resolve(page);
                        self.hideLoading();
                    });
                    return deferred.promise;
                },

                // pgae callbacks
                allCbk: function(pages, pageName, data) {
                    var home = pages[pageName].page;
                    if (home) home.refresh();
                },

                postCbk: function(pages, pageName, data) {
                    var post = pages[pageName].page;
                    if (post) {
                        this.showPopPage();
                        on(post, "post", Function.hitch(this, function() {
                            this.hidePopPage();
                        }));
                    }
                },
                mentionCbk: function(pages, name, args) {

                },
                showCbk: function(pages, name, args) {

                }
            }
        },

        "-constructor-": {
            initialize: function(params) {
                this["super"](params);
                this.init();
            }
        }
    });
    return Layout;
});
