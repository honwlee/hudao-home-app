define([
    "dojo/on",
    "qscript/lang/Interface"
], function(on, Interface) {
    return Interface.declare({
        "-parent-": Interface,
        "-interfaces-": [],
        "-public-": {
            "-methods-": {
                bindTweetsEvent: function(tweet) {
                    var self = this;
                    on(tweet, "userClick", function(data) {
                        self.broadcast("microblog:selectPage", {
                            pageName: self.getProfileName(data.userId),
                            sub: data
                        });
                    });

                    on(tweet, "show", function(data) {
                        // 具体细节在profile中，根据data，初始化profile的当前tweet的查看页面
                        // 这里只负责页面跳转以及参数的传递，不管参数具体是什么
                        // 参数是由tweet捕捉article "show" 冒泡事件传递的
                        // 就是说具体参数的形式由article本身决定
                        // 比如：data:{itemData:xx,userId:xx},itemData以及userId由article决定，
                        // 可以在article中随时更改，而不影响当前主线接口
                        data.subName = "details"; // mixin details to data

                        self.broadcast("microblog:selectPage", {
                            pageName: self.getProfileName(data.userId),
                            sub: data
                        });
                    });

                    on(tweet, "reshare", function(articleInfo) {
                        self.broadcast("microblog:showResharePage", articleInfo);
                    });

                    on(tweet, "refresh", function() {
                        self.newTweetIds = [];
                    });
                },

                getProfileName: function(userId) {
                    var profileName;
                    if (runtime.currentUserId === userId) {
                        profileName = "profile";
                    } else {
                        profileName = "otherProfile";
                    }
                    return profileName;
                },

                initTweetTopic: function() {
                    var self = this;
                    this.receive("microblog:tweet:initInterval", function() {
                        self.tweet.initInterval();
                    });

                    this.receive("microblog:tweet:clearInterval", function() {
                        self.tweet.clearInterval();
                    });
                }
            }
        },
        "-constructor-": {
            instantiate: function() {}
        }
    });
});
