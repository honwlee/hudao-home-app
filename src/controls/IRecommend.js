define([
    "dojo/on",
    "dojo/aspect",
    "bundle!dependencies/services/social_srv",
    "bundle!dependencies/services/recommendPanel_ctrl",
    "qscript/lang/Interface"
], function(on, aspect, socialSrv, RecommendPanelCtrl, Interface) {
    var getDefaultData = function() {
        var deferred = new Deferred();
        socialSrv.init().then(function(info) {
            var usersData = [],
                topicsData = [];
            info.recommUsers = info.recommUsers || [];
            info.recommTopics = info.recommTopics || [];
            info.recommUsers.forEach(function(user) {
                usersData.push({
                    userId: user.id,
                    avatar: user.avatar,
                    username: user.username,
                    desc: user.profile.summary
                });
            });

            info.recommTopics.forEach(function(topic) {
                topicsData.push({
                    id: topic.id,
                    subject: topic.subject,
                    text: topic.text || ""
                });
            });
            deferred.resolve({
                usersData: usersData,
                topicsData: topicsData,
                withoutMore: false,
                withoutHeader: false
            });

        });
        return deferred.promise;
    };

    var discoverOpts = {
        user: {
            pageName: "discover",
            sub: {
                subName: "person",
                userId: runtime.currentUserId
            }
        },
        post: {
            pageName: "discover",
            sub: {
                subName: "topic",
                userId: runtime.currentUserId
            }
        }

    };

    var user = Interface.declare({
        "-parent-": Interface,
        "-public-": {
            "-attributes-": {},
            "-methods-": {
                initUserRecommend: function(container, args) {
                    var deferred = new Deferred();
                    getDefaultData().then(Function.hitch(this, function(defaultOpts) {
                        var opts = Function.delegate(defaultOpts, args),
                            recommend = RecommendPanelCtrl.createInstance({
                                itemClick: opts.itemClick,
                                itemsData: opts.usersData,
                                baseClass: "recommend-user recoms " + args.baseClass || "",
                                withoutMore: opts.withoutMore,
                                withoutHeader: opts.withoutHeader,
                                recommendDesc: {
                                    headerClass: "recoms-header",
                                    centerClass: "picitems_ul",
                                    footerClass: "view-more"
                                }
                            });
                        if (!opts.withoutMore) {
                            on(recommend, "more", Function.hitch(this, function() {
                                this.broadcast(opts.topicName, discoverOpts.user);
                            }));
                        }
                        if (container) container.appendChild(recommend.domNode);
                        deferred.resolve(recommend);
                    }));
                    return deferred.promise;
                }
            }
        },
        "-constructor-": {
            instantiate: function() {
                socialSrv.init();
            }
        }
    });

    var topic = Interface.declare({
        "-parent-": Interface,
        "-public-": {
            "-attributes-": {},
            "-methods-": {
                initTopicRecommend: function(container, args) {
                    var deferred = new Deferred();
                    getDefaultData().then(Function.hitch(this, function(defaultOpts) {
                        var opts = Function.delegate(defaultOpts, args),
                            recommendDesc = {
                                headerItems: "recoms-tab",
                                itemTpl: "post",
                                footerClass: "view-more"
                            };
                        if (!opts.withoutMore) recommendDesc.headerItems = [{
                            name: "popular",
                            data: opts.topicsData
                        }, {
                            name: "hot",
                            data: opts.topicsData
                        }, {
                            name: "recent",
                            data: opts.topicsData
                        }];
                        var recommend = RecommendPanelCtrl.createInstance({
                            itemClick: opts.itemClick,
                            itemsData: opts.topicsData,
                            baseClass: "post-recoms recoms " + args.baseClass || "",
                            withoutMore: opts.withoutMore,
                            withTopicFollowbtn: opts.withTopicFollowbtn,
                            withoutHeader: opts.withoutHeader,
                            recommendDesc: recommendDesc
                        });
                        if (!opts.withoutMore) {
                            on(recommend, "more", Function.hitch(this, function() {
                                this.broadcast(opts.topicName, discoverOpts.post);
                            }));
                        }
                        if (container) container.appendChild(recommend.domNode);
                        on(recommend, "item_click", opts.itemClick);
                        deferred.resolve(recommend);
                    }));
                    return deferred.promise;
                }
            }
        },
        "-constructor-": {
            instantiate: function() {
                socialSrv.init();
            }
        }
    });
    return {
        user: user,
        topic: topic,
        all: [user, topic]
    };
});
