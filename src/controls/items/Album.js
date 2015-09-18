define([
    "dojo/on",
    "dojo/topic",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "./Item",
    "dojo/text!../../templates/items/album.html",
    "qscript/lang/Class",
    "bundle!dependencies/services/album_srv"
], function(on, topic, domClass, domStyle, domConstruct, Item, template, Class, albumSrv) {
    var AlbumArticle = Class.declare({
        "-parent-": Item,
        "-protected-": {
            "-fields-": {
                templateString: template,
                userId: null,
                targetId: null,
                comments: null
            },

            "-methods-": {
                init: function() {
                    var self = this;
                    this.notiObj = null;
                    domClass.add(this.domNode, "album-article");
                    this.initComments();
                    // topic.publish("desktop/parseTimeAgo", this.domNode);
                    topic.publish("emojify/run", this.contentTextNode);
                    if (this.itemData.liked) domClass.add(this.likeLinkNode, "liked");
                    if (this.itemData.favourited) domClass.add(this.favouriteLinkNode, "liked");
                    this.eventsBind();
                    // this.initLikedList();
                    if (!this.needAvatar) {
                        domStyle.set(this.avatarNode, "display", "none");
                        domClass.add(this.itemDetailsNode, "no-avatar");
                    }

                    var content = this.itemData.content;
                    if (content.photos && content.photos.length > 0) {
                        this.initPhotoList(content.photos);
                    }

                    // reshared article not execute
                    if (this.isReshare) {
                        this.initActions();
                        this.dealReshare();
                    }

                    on(this.openNode, "click", function() {
                        albumSrv.photos(self.itemData.targetId, true).then(function(photosData) {
                            self.launchAppByName("ImageSlide", {
                                photos: photosData
                            });
                        });
                    });
                },
                initComments: function() {
                    if (this.comments.length > 0) {
                        this.commentContentNode.innerHTML = this.comments[0].text;
                        this.commentTimeNode.innerHTML = this.comments[0].createdAt;
                    }
                },
                initArticleData: function(itemData) {
                    var items = [];
                    var addSubs = function(comment) {
                        var subItems = [];
                        if (comment.subs) {
                            comment.subs.forEach(function(sub) {
                                sub.forUser = comment.userInfo;
                                subItems = subItems.concat(addSubs(sub));
                            });
                            subItems = subItems.concat(comment.subs);
                        }
                        return subItems;
                    };
                    itemData.comments.forEach(function(comment) {
                        items.push(comment);
                        items = items.concat(addSubs(comment));
                    }, this);
                    itemData.comments = items;
                    itemData.userId = itemData.userInfo.id;
                    itemData.commentCount = items.length;
                    this.itemData = itemData;
                    this.userId = itemData.userId;
                    this.targetId = itemData.targetId;
                    // var text,
                    //     orginText = itemData.text,
                    //     regex = /(^|[^@\w])@([\u4e00-\u9fa5\w]{1,15})\b/g,
                    //     replace = '$1<a class=username target=_blank href=http://utilhub.com/$2>@$2</a>';
                    // text = orginText.replace(regex, replace);
                    // 模板中引用的变量
                    this.article = {
                        avatar: itemData.userInfo.avatar,
                        text: this.processContent(itemData.text, this.notiObj),
                        username: itemData.userInfo.username,
                        time: this.time,
                        isoTime: itemData.updatedAt,
                        likeCount: itemData.likeCount,
                        commentCount: itemData.commentCount,
                        favouriteCount: itemData.favouriteCount,
                        reshareCount: itemData.reshareCount
                    };
                }
            }
        },

        "-public-": {
            "-attributes-": {},

            "-methods-": {}
        },

        "-constructor-": {
            initialize: function(params, srcNodeRef) {
                this["super"](params, srcNodeRef);
                if (params.itemData.comments) {
                    this.comments = params.itemData.comments;
                }

            }
        },

        "-static-": {
            "-methods-": {}
        }
    });
    return AlbumArticle;
});