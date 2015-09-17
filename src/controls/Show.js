define([
    "dojo/on",
    "dojo/mouse",
    "dojo/topic",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "qscript/lang/Array",
    "dojo/i18n!../../nls/app",
    "dojo/text!../../templates/profilePages/desc.html",
    "qscript/lang/Class",
    "qface/controls/ITemplated",
    "utilhub/ItemsControl",
    "bundle!dependencies/services/iCropperDialog_lib#module",
    "bundle!dependencies/services/iUpload_lib#module"
], function(on, mouse, topic, domClass, domStyle, domConstruct, array, nlsApp, template, Class, ITemplated,
    ItemsControl, ICropperDialogLib, IUploadLib) {
    var Desc = Class.declare({
        "-parent-": ItemsControl,
        "-interfaces-": [ITemplated, ICropperDialogLib, IUploadLib],

        "-protected-": {
            "-fields-": {
                nls: nlsApp,
                templateString: template,
                fontAwesome: FontAwesome,
                baseClass: "desc"
            },
            "-methods-": {
                init: function() {
                    var intro = "Write words to introduce yourself";
                    if (this.info.profile && this.info.profile.summary) {
                        intro = this.info.profile.summary;
                    }
                    this.introNode.innerHTML = intro;
                    if (this.info.id == runtime.currentUser.id) {
                        domStyle.set(this.uploaderWrapNode, "display", "block");
                        this._initUpload(this.coverUploaderOpts);
                        on(this, "fileUpload", Function.hitch(this, "refreshBanner"));
                    }
                    this.refreshBanner(this.info.profile)
                },

                refreshBanner: function(profile) {
                    domStyle.set(this.coverWrapNode, "backgroundImage", "url(" + profile.banner.url + ")");
                }
            }
        },

        "-public-": {
            "-attributes-": {
                coverUploaderOpts: {
                    getter: function() {
                        return {
                            url: "/ubase/api/v1/users/banner" + "?private_token=" + runtime.currentUser.token,
                            paramName: "banner",
                            container: this.uploaderWrapNode,
                            cropSize: {
                                w: 900,
                                h: 300
                            },
                            multiple: false
                        };
                    }
                }
            },
            "-methods-": {
                startup: function() {
                    if (this._started) return;
                    this["super"]();
                    setTimeout(Function.hitch(this, function() {
                        domClass.add(this.coverWrapNode, "banner-transition");
                    }, 200));
                    this._started = true;
                }
            }
        },

        "-constructor-": {
            initialize: function(params) {
                this.info = params.info;
                this["super"](params);
                this.init();
            }
        }
    });
    return Desc;
});
