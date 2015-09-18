define([
    "dojo/on",
    "dojo/topic",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "./Item",
    "dojo/text!../../templates/items/game.html",
    "qscript/lang/Class"
], function(on, topic, domAttr, domClass, domStyle, domConstruct,
    Item, template, Class) {
    var GameArticle = Class.declare({
        "-parent-": Item,
        "-protected-": {
            "-fields-": {
                templateString: template,
                userId: null,
                targetId: null
            },

            "-methods-": {
                init: function() {
                    var self = this;
                    domClass.add(this.domNode, "game-article");
                    this.contentTextNode.innerHTML = this.processContent(this.itemData.text, this.notiObj);
                    this.notiObj = null;
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
                        self.launchApp(self.targetId);
                        //TODO
                        // self.userId;
                        // self.targetId;
                    });
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
            }
        },

        "-static-": {
            "-methods-": {}
        }
    });
    return GameArticle;
});