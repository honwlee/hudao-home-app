define([
    "dojo/on",
    "dojo/topic",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "bundle!dependencies/services/article_ctrl",
    "dojo/text!../../templates/items/item.html",
    "qscript/lang/Class",
    "bundle!dependencies/services/album_srv"
], function(on, topic, domClass, domStyle, domConstruct, ArticleCtrl, template, Class, albumSrv) {
    var Item = Class.declare({
        "-parent-": ArticleCtrl.getControlClass(),
        "-protected-": {
            "-fields-": {
                baseClass: "timeline-item",
                templateString: template,
                comments: null
            },

            "-methods-": {}
        },

        "-public-": {
            "-attributes-": {},

            "-methods-": {

                init: function() {
                    this.initComments();
                    this.eventsBind();
                },

                initComments: function() {
                    if (this.comments.length > 0) {
                        this.commentContentNode.innerHTML = this.comments[0].text;
                        this.commentTimeNode.innerHTML = this.comments[0].createdAt;
                    }
                },
                eventsBind: function() {
                    on(this.likeLinkNode, "click", Function.hitch(this, "like"));
                    on(this.favouriteLinkNode, "click", Function.hitch(this, "favourite"));
                    on(this.reshareLinkNode, "click", Function.hitch(this, "reshare"));
                },

                like: function() {
                    if (this.itemData.liked) return this.unlike();
                    this.itemData.liked = true;
                    likeSrv.like({
                        target_id: this.itemData.id,
                        target_type: "Tweet"
                    }).then(Function.hitch(this, function(retObj) {
                        // this.itemData.likers.push(this.itemData.userInfo);
                        // this.initLikedList();
                        this.itemData.likeCount += 1;
                        this.sendNotification("like");
                        this.onLike(this.itemData);
                    }));
                },

                reshare: function() {},

                unlike: function() {
                    if (!this.itemData.liked) return this.like();
                    this.itemData.liked = false;
                    likeSrv.unlike({
                        target_id: this.itemData.id,
                        target_type: "Tweet"
                    }).then(Function.hitch(this, function() {
                        this.itemData.likeCount -= 1;
                        // this.initLikedList();
                        this.onUnLike(this.itemData);
                    }));
                },

                favourite: function() {
                    if (this.itemData.favourited) return this.unfavourite();
                    tweetSrv.favourite(this.itemData.id).then(Function.hitch(this, function() {
                        this.itemData.favouriteCount += 1;
                        this.itemData.favourited = true;
                        // this.itemData.favouriters.push(this.itemData.userInfo);
                        this.sendNotification("favourite");
                        this.onFav(this.itemData);
                    }));
                },
                initPhotoList: function(photos) {
                    if (!this.photoListNode) return;
                    domConstruct.empty(this.photoListNode);
                    if (photos.length > 0) {
                        domClass.remove(this.photoListNode, "hide");
                    }
                    if (photos.length === 1) {
                        this.addPhotoItem(photos[0], true);
                    } else {
                        photos.forEach(function(photo) {
                            this.addPhotoItem(photo);
                        }, this);
                    }

                    $(this.photoListNode).magnificPopup({
                        delegate: 'li', // the selector for gallery item
                        type: 'image',
                        tLoading: 'Loading...',
                        gallery: {
                            enabled: true
                        },
                        image: {
                            verticalFit: false
                        },
                        zoom: {
                            enabled: true // By default it's false, so don't forget to enable it
                        }
                    });
                },

            }
        },

        "-constructor-": {
            initialize: function(params, srcNodeRef) {
                if (params.itemData.comments) {
                    this.comments = params.itemData.comments;
                }
                this.itemData = params.itemData;
                this["super"](params, srcNodeRef);
                this.init();
            }
        },

        "-static-": {
            "-methods-": {}
        }
    });
    return Item;
});