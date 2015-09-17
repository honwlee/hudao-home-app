define([
    "dojo/on",
    "dojo/topic",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "utilhub/ItemsControl",
    "dojo/text!../../templates/items/postFrame.html",
    "qface/controls/ITemplated",
    "qscript/lang/Class"
], function(on, topic, domClass, domStyle, domConstruct, ItemsControl, template, ITemplated, Class) {
    return Class.declare({
        "-parent-": ItemsControl,
        "-interface-": [ITemplated],
        "-protected-": {
            "-fields-": {
                templateString: template,
                userId: null,
                targetId: null,
                actions: null
            },

            "-methods-": {
                init: function() {
                    var self = this;
                    for (var actionName in self.actions) {
                        var action = self.actions[actionName];
                        var li = domConstruct.create("li", {
                            innerHtml: action.name,
                        }, self.actionNode);
                        var a = domConstruct.create("a", {
                            click: action.callback
                        }, li);
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
                this.init();
            }
        }
    });
});