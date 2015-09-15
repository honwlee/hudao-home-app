define([
    "dojo/on",
    "dojo/topic",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "bundle!dependencies/services/article_ctrl",
    "qscript/lang/Class",
    "bundle!dependencies/services/album_srv"
], function(on, topic, domClass, domStyle, domConstruct, ArticleCtrl, Class, albumSrv) {
    var Item = Class.declare({
        "-parent-": ArticleCtrl.getControlClass(),
        "-protected-": {
            "-fields-": {
                baseClass: "timeline-item"
            },

            "-methods-": {}
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
    return Item;
});
