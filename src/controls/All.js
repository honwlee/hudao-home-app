define([
    "dojo/on",
    "dojo/mouse",
    "dojo/topic",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "qscript/lang/Array",
    "dojo/i18n!../nls/app",
    "dojo/text!../templates/all.html",
    "bundle!dependencies/services/social_srv",
    "bundle!dependencies/services/tweet_srv",
    "bundle!dependencies/services/profile_ctrl",
    "./Timeline",
    "qscript/lang/Class",
    "qface/controls/ITemplated",
    "utilhub/ItemsControl",
    "./IRecommend",
    "./ITweet",
    "./items/PostFrame"
], function(on, mouse, topic, domClass, domStyle, domConstruct, array, nlsApp, template,
    socialSrv, tweetSrv, ProfileCtrl, Timeline, Class, ITemplated, ItemsControl,
    IRecommend, ITweet, PostFrame) {
    var All = Class.declare({
        "-parent-": ItemsControl,
        "-interfaces-": [ITemplated, ITweet].concat(IRecommend.all),
        "-protected-": {
            "-fields-": {
                nls: nlsApp,
                templateString: "<div></div>",
                fontAwesome: FontAwesome,
                tweetsMemory: null,
                dataObj: null,
                "_": {
                    pageNum: 2
                },
                itemClass: "timeline-item",
                baseClass: "homePage",
                newTweetIds: null
            },
            "-methods-": {
                init: function() {
                    this.firstInited = true;
                    this.newTweetIds = [];
                    this.initMasonryList();
                    this.initPages();
                    var self = this;
                    this.initChannel();
                    on(this.domNode, "click", function(e) {
                        if (self.tweet) self.tweet.hidePostActionTool(e);
                    });
                },

                initMasonryList: function() {
                    var self = this;
                    var memory = tweetSrv.getMemory(),
                        list = this.list = new Timeline({
                            memory: memory,
                            isScrollPage: true,
                            masonryOpts: {
                                itemSelector: this.itemClass,
                                isAnimated: true,
                                columnWidth: 440
                            },
                            itemOpts: {
                                actions: ["select", "delete", "update"]
                            },
                            filterOpts: this.filterOpts,
                            loadNextFunc: Function.hitch(this, "loadNextPage")
                        });

                    self.addChild(self.list);

                    // self.addChild(postFrame);
                },

                loadNextPage: function() {
                    var deferred = new Deferred(),
                        self = this,
                        filter,
                        qOpts = this.filterOpts.queryOpts;
                    tweetSrv.initByPage(this._.pageNum, filter).then(function(items) {
                        self._.pageNum += 1;
                        deferred.resolve(items);
                    });
                    return deferred.promise;
                },

                initChannel: function() {
                    var self = this;
                    runtime.channel.bind("tweets.create", function(message) {
                        if (message.userId != runtime.currentUserId) {
                            self.newTweetIds.push(message.tweetId);
                        }
                        if (self.newTweetIds.length > 0) self.tweet.fillNewBar(self.newTweetIds);
                    });
                },

                initPages: function() {
                    // this.initTweets();
                    this.initProfile();
                    var self = this;
                    this.initUserRecommend(null, {
                        baseClass: this.itemClass,
                        topicName: "microblog:selectPage"
                    }).then(function(recommend) {
                        self.list.placeItem(recommend.domNode);
                    });
                    this.initTopicRecommend(null, {
                        topicName: "microblog:selectPage",
                        withTopicFollowbtn: true,
                        baseClass: this.itemClass,
                        itemClick: Function.hitch(this, function(item) {
                            this.broadcast("microblog:selectPage", {
                                pageName: "discover",
                                sub: {
                                    subName: "topicTweets",
                                    item: item
                                }
                            });
                        })
                    }).then(function(recommend) {
                        self.list.placeItem(recommend.domNode);
                        var postFrame = new PostFrame();
                        on(postFrame, "postWord", function(postInstance) {
                            self.list.placeItem(postInstance.domNode, "first");
                        });
                        self.list.placeItem(postFrame.domNode, "first");
                    });
                },

                initProfile: function() {
                    var self = this;
                    socialSrv.init().then(function(socialInfo) {
                        var actionItems = [{
                                name: "posts",
                                num: socialInfo.postCount
                            }, {
                                name: "followers",
                                num: socialInfo.followersCount
                            }, {
                                name: "following",
                                num: socialInfo.followsCount
                            }],
                            profile = ProfileCtrl.createInstance({
                                descData: {
                                    name: socialInfo.username,
                                    content: socialInfo.profile.summary,
                                    avatar: socialInfo.avatar,
                                    hoverAvatar: socialInfo.avatar,
                                    banner: socialInfo.profile.banner.normal
                                },
                                baseClass: self.itemClass,
                                profileDesc: {
                                    itemClass: "",
                                    actionItems: actionItems
                                }
                            });
                        actionItems.map(function(item) {
                            return item.name;
                        }).forEach(function(itemName) {
                            profile.attach("on" + itemName, function() {
                                self.broadcast("microblog:selectPage", {
                                    pageName: "profile",
                                    sub: {
                                        subName: itemName
                                    }
                                });
                            });
                        });
                        self.list.placeItem(profile.domNode);
                    });
                }
            }

        },

        "-public-": {
            "-attributes-": {
                filterOpts: {
                    "default": {
                        sortOpts: {
                            name: "createdAt"
                        },
                        queryOpts: {},
                        newPaginate: true,
                        perPage: 20
                    },
                    setter: function(opts) {
                        this._.filterOpts = opts;
                    }
                }
            },

            "-methods-": {
                layoutStart: function() {
                    // this.initTweetTopic();
                    this.list.filter({});
                    this.list.resize();
                },

                resize: function(args) {
                    this["super"](args);
                    if (this.list) this.list.resize(args);
                },

                refresh: function() {
                    if (this.firstInited && this.newTweetIds.length > 0) {
                        this.tweet.refresh(this.newTweetIds);
                        this.newTweetIds = [];
                    }
                }
            }
        },

        "-constructor-": {
            initialize: function(params) {
                this["super"](params);
                this.init();
            }
        },

        "-static-": {}
    });
    return All;
});