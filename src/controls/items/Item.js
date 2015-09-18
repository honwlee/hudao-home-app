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
                templateString: template
            },

            "-methods-": {}
        },

        "-public-": {
            "-attributes-": {},

            "-methods-": {
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
                this["super"](params, srcNodeRef);
            }
        },

        "-static-": {
            "-methods-": {}
        }
    });
    return Item;
});
