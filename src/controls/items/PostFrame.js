define([
    "dojo/on",
    "dojo/topic",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "utilhub/ItemsControl",
    "dojo/text!../../templates/items/postFrame.html",
    "qface/controls/ITemplated",
    "qscript/lang/Class",
    "bundle!dependencies/services/postFrame_ctrl",
    "bundle!dependencies/services/album_srv",
    "../Form"
], function(on, topic, domClass, domStyle, domConstruct, ItemsControl, template, ITemplated, Class, PostFrameCtrl, albumSrv, Form) {
    return Class.declare({
        "-parent-": ItemsControl,
        "-interfaces-": [ITemplated],
        "-protected-": {
            "-fields-": {
                templateString: template,
                userId: null,
                targetId: null
            },

            "-methods-": {
                init: function() {
                    var self = this,
                        actions = {
                            postWord: {
                                "actionName": "word",
                                "actionFunction": "initPostFrame"
                            },
                            album: {
                                "actionName": "album",
                                "actionFunction": "initAlbumForm"
                            }
                        },
                        initAction = function(actionName) {
                            var action = actions[actionName],
                                functionName = action["actionFunction"],
                                li = domConstruct.create("li", {
                                    "class": "nav-item"
                                }, self.actionNode),
                                a = domConstruct.create("a", {
                                    innerHTML: action.actionName,
                                    onclick: function() {
                                        self[functionName]();
                                    }
                                }, li);
                        };
                    for (var actionName in actions) {
                        initAction(actionName);
                    }
                    self.initPostFrame();
                },

                initAlbumForm: function() {
                    domConstruct.empty(this.actionZoneNode);
                    form = this.form = new Form();
                    this.actionZoneNode.appendChild(form.domNode);
                    on(form, "addData", Function.hitch(this, "addAlbum"));
                },

                addAlbum: function() {
                    var self = this;
                    albumSrv.add(data).then(function(cbData) {
                        self.onPost(cbData);
                    });
                },

                initPostFrame: function() {
                    domConstruct.empty(this.actionZoneNode);
                    var opts = {
                            needHeader: false,
                            needPhotos: true,
                            needTopic: true,
                            parentLayout: this.actionZoneNode
                        },
                        postFrame = PostFrameCtrl.createInstance(opts);
                    this.actionZoneNode.appendChild(postFrame.domNode);
                }
            }
        },

        "-public-": {
            "-attributes-": {},

            "-methods-": {
                onPost: function() {}
            }
        },

        "-constructor-": {
            initialize: function(params, srcNodeRef) {
                this["super"](params, srcNodeRef);
                this.init();
            }
        }
    });
});
