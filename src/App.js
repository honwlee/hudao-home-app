define([
    "utilhub/Application",
    "dojo/i18n!udesktop/system/nls/apps",
    "bundle!dependencies/services/tweet_srv",
    "qscript/lang/Class",
    "./controls/Layout"
], function(Application, nls, tweetSrv, Class, Layout) {
    return Class.declare({
        "-parent-": Application,
        "-protected-": {
            "-fields-": {
                isDeferred: true,
                winMaxed: false,
                width: 950,
                height: 570,
                title: null
            },

            "-methods-": {
                init: function() {
                    this["super"]();
                    var self = this;
                    tweetSrv.init().then(function() {
                        self.content = new Layout({});
                        self.deferred.resolve();
                    });
                    return this.deferred.promise;
                }
            }
        },

        "-public-": {
            "-attributes-": {

            },

            "-methods-": {
                // blockade the app's Interval or some other things
                blockade: function() {

                },

                // start app's Interval or some other things
                unblock: function() {

                }
            }
        },

        "-constructor-": {
            initialize: function(args) {
                this["super"](args);
            }
        }
    });
});
