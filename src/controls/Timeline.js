define([
    "dojo/on",
    "./items/Item",
    "./items/Post",
    "./items/Game",
    "./items/Album",
    "./items/App",
    "./items/Profile",
    "./items/RecommendGroups",
    "./items/RecommendTopics",
    "./items/RecommendPerson",
    "qscript/lang/String",
    "qscript/lang/Class",
    "bundle!dependencies/services/blog_srv",
    "bundle!dependencies/services/masonry_ctrl"
], function(on, Item, PostItem, GameItem, AlbumItem, AppItem, Profile,
    RecommendTopics, RecommendGroups, RecommendPerson, qString, Class, blogSrv, MasonryCtrl) {
    return Class.declare({
        "-parent-": MasonryCtrl.getControlClass(),
        "-interfaces-": [],
        "-module-": "",
        "-protected-": {
            "-fields-": {
                needAvatar: true
            },
            "-methods-": {

                _initPostItem: function(item, index, notiObj) {
                    var self = this,
                        article = new PostItem({
                            notiObj: notiObj,
                            itemData: item,
                            needAvatar: this.needAvatar
                        });
                    on(article, "openBlog", function(blogId) {
                        blogSrv.getPostById(blogId).then(function(data) {
                            self.popPage = self.initPopPage(true);
                            var div = domConstruct.create("div", {
                                "class": "blogContextZone"
                            }, self.popPage.containerNode);
                            var titleNode = domConstruct.create("div", {
                                innerHTML: data.title
                            }, div);
                            var contentNode = domConstruct.create("div", {
                                innerHTML: data.html
                            }, div);
                            var a = domConstruct.create("a", {
                                "class": "btn",
                                innerHTML: "return",
                                click: function() {
                                    self.hidePopPage();
                                    self.listContent.removeChild(self.popPage.domNode);
                                }
                            }, div);
                            self.listContent.appendChild(self.popPage.domNode);
                            self.showPopPage();
                            on(self.popPage.closeNode, "click", function() {
                                self.listContent.removeChild(self.popPage.domNode);
                            });
                            on(self.popPage.overlayNode, "click", function() {
                                self.listContent.removeChild(self.popPage.domNode);
                            });
                        });
                    });
                    return article;
                },

                _initAlbumItem: function(item, index, notiObj) {
                    return new AlbumItem({
                        notiObj: notiObj,
                        itemData: item,
                        needAvatar: this.needAvatar
                    });

                },

                _initGameItem: function(item, index, notiObj) {
                    return new GameItem({
                        notiObj: notiObj,
                        itemData: item,
                        needAvatar: this.needAvatar
                    });

                },

                _initAppItem: function(item, index, notiObj) {
                    return new AppItem({
                        notiObj: notiObj,
                        itemData: item,
                        needAvatar: this.needAvatar
                    });
                },

                initPageItemDom: function(item, index, notiObj) {
                    var self = this,
                        article;
                    if (item.targetType == "Ucenter::Post") {
                        article = this._initPostItem(item, index, notiObj);
                    } else if (item.targetType == "Utilhub::WebApp") {
                        if (item.sharedWith == "app") {
                            article = this._initAppItem(item, index, notiObj);
                        } else {
                            article = this._initGameItem(item, index, notiObj)
                        }
                    } else if (item.targetType == "Ubase::Album") {
                        article = this._initAlbumItem(item, index, notiObj);
                    } else {
                        article = new Item({
                            notiObj: notiObj,
                            itemData: item,
                            needAvatar: this.needAvatar
                        });
                    }
                    on(article, "topicClick", function() {
                        self.onTopicClick({
                            id: item.targetId
                        });
                    });

                    on(article, "userClick", function(userInfo) {
                        self.onUserClick(userInfo);
                    });
                    on(article, "show", function(articleInfo) {
                        self.onShow(articleInfo);
                    });
                    on(article, "reshare", function() {
                        self.onReshare(item);
                    });
                    var actions = ["like", "unLike", "comment", "fav", "unFav", "report", "delete"];
                    actions.forEach(function(key) {
                        on(article, key, function(tweet, args) {
                            tweet._opts = {
                                action: key,
                                notAddToDom: true,
                                args: args
                            };
                            // self.onArticleAction({
                            //     action: key,
                            //     notAddToDom: true,
                            //     args: args,
                            //     tweet: tweet
                            // });
                            Tweet.memory.notify(tweet);
                        });
                    });
                    item.articleObj = article;
                    return article;
                }
            }
        },
        "-public-": {
            "-attributes-": {

            },
            "-methods-": {
                prepended: function(items) {
                    this.masonry.prepended(items);
                },

                addItem: function(item) {
                    this.placeItem(this.initItem(item).domNode);
                },

                initItemWithClass: function(obj, opts) {
                    return this.initPageItemDom(obj, 0, opts);
                },
                placeItem: function(node, position) {
                    position = position || "first";
                    domConstruct.place(node, this.paginate.pageCnt, position);
                    position === "first" ? this.prepended(node) : this.appended(node);
                }
            }
        },
        "-constructor-": {
            initialize: function(params, srcNodeRef) {
                this["super"](params, srcNodeRef);
            }
        }
    });
});
