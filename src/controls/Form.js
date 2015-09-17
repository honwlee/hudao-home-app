define([
    "dojo/on",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/i18n!../nls/app",
    "dojo/i18n!udesktop/system/nls/common",
    "dojo/text!../templates/form.html",
    "qscript/lang/Class",
    "qface/controls/ITemplated",
    "utilhub/ItemsControl"
], function(on, domClass, domStyle, domConstruct, nlsApp, nlsCommon, template,
    Class, ITemplated, ItemsControl) {
    return Class.declare({
        "-parent-": ItemsControl,
        "-interfaces-": [ITemplated],
        "-protected-": {
            "-fields-": {
                nls: nlsApp,
                templateString: template,
                fontAwesome: FontAwesome,
            },
            "-methods-": {
                init: function() {
                    var self = this;
                    on(this.postNode, "click", function() {
                        data = {
                            name: self.nameNode.value,
                            description: self.descriptionNode.value,
                            isStringified: true
                        };
                        self.onAddData(data);
                    });
                }
            }
        },

        "-public-": {
            "-attributes-": {
                nlsCommon: {
                    getter: function() {
                        return nlsCommon;
                    }
                }
            },
            "-methods-": {
                onUpData: function(data) {},
                onAddData: function(data) {}
            }
        },

        "-constructor-": {
            initialize: function(params) {
                this["super"](params);
                this.init();
            }
        }
    });
});