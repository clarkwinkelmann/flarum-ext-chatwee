'use strict';

System.register('clarkwinkelmann/chatwee/addLoggedOutAlert', ['flarum/extend', 'flarum/components/IndexPage', 'clarkwinkelmann/chatwee/components/LoggedOutAlert'], function (_export, _context) {
    "use strict";

    var override, IndexPage, LoggedOutAlert;

    _export('default', function () {
        override(IndexPage.prototype, 'hero', function (original) {
            return [original(), LoggedOutAlert.component()];
        });
    });

    return {
        setters: [function (_flarumExtend) {
            override = _flarumExtend.override;
        }, function (_flarumComponentsIndexPage) {
            IndexPage = _flarumComponentsIndexPage.default;
        }, function (_clarkwinkelmannChatweeComponentsLoggedOutAlert) {
            LoggedOutAlert = _clarkwinkelmannChatweeComponentsLoggedOutAlert.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('clarkwinkelmann/chatwee/ChatWeeClient', ['flarum/app', 'clarkwinkelmann/chatwee/sessionIdCookieIsSet'], function (_export, _context) {
    "use strict";

    var app, sessionIdCookieIsSet;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_clarkwinkelmannChatweeSessionIdCookieIsSet) {
            sessionIdCookieIsSet = _clarkwinkelmannChatweeSessionIdCookieIsSet.default;
        }],
        execute: function () {
            _export('default', {
                chatweeManager: null,
                load: function load() {
                    if (this.chatweeManager) {
                        this.unload();
                    }

                    var chatId = app.forum.attribute('clarkwinkelmann-chatwee.chatId');
                    var enableForGuests = app.forum.attribute('clarkwinkelmann-chatwee.enableForGuests');

                    if (!chatId) {
                        return;
                    }

                    if (!enableForGuests && !sessionIdCookieIsSet()) {
                        return;
                    }

                    this.chatweeManager = new ChatweeLib.ChatweeManager(chatId);

                    this.chatweeManager.SetChatProperty('chatweeLayout', 'fixed');
                    this.chatweeManager.SetChatProperty('chatweeAutoStart', false);

                    if (!enableForGuests) {
                        this.chatweeManager.SetChatProperty('chatweeLoggedUsersOnly', true);
                    }

                    this.chatweeManager.Run();
                },
                unload: function unload() {
                    this.chatweeManager.Dispose();
                    this.chatweeManager = null;
                }
            });
        }
    };
});;
'use strict';

System.register('clarkwinkelmann/chatwee/components/LoggedOutAlert', ['flarum/app', 'flarum/Component', 'flarum/components/Alert', 'flarum/components/Button', 'clarkwinkelmann/chatwee/sessionIdCookieIsSet', 'clarkwinkelmann/chatwee/ChatWeeClient'], function (_export, _context) {
    "use strict";

    var app, Component, Alert, Button, sessionIdCookieIsSet, ChatWeeClient, AlertWithContainer, LoggedOutAlert;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumComponentsAlert) {
            Alert = _flarumComponentsAlert.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_clarkwinkelmannChatweeSessionIdCookieIsSet) {
            sessionIdCookieIsSet = _clarkwinkelmannChatweeSessionIdCookieIsSet.default;
        }, function (_clarkwinkelmannChatweeChatWeeClient) {
            ChatWeeClient = _clarkwinkelmannChatweeChatWeeClient.default;
        }],
        execute: function () {
            AlertWithContainer = function (_Alert) {
                babelHelpers.inherits(AlertWithContainer, _Alert);

                function AlertWithContainer() {
                    babelHelpers.classCallCheck(this, AlertWithContainer);
                    return babelHelpers.possibleConstructorReturn(this, (AlertWithContainer.__proto__ || Object.getPrototypeOf(AlertWithContainer)).apply(this, arguments));
                }

                babelHelpers.createClass(AlertWithContainer, [{
                    key: 'view',
                    value: function view() {
                        var vdom = babelHelpers.get(AlertWithContainer.prototype.__proto__ || Object.getPrototypeOf(AlertWithContainer.prototype), 'view', this).call(this);

                        vdom.children = [m('.container', vdom.children)];

                        return vdom;
                    }
                }]);
                return AlertWithContainer;
            }(Alert);

            LoggedOutAlert = function (_Component) {
                babelHelpers.inherits(LoggedOutAlert, _Component);

                function LoggedOutAlert() {
                    babelHelpers.classCallCheck(this, LoggedOutAlert);
                    return babelHelpers.possibleConstructorReturn(this, (LoggedOutAlert.__proto__ || Object.getPrototypeOf(LoggedOutAlert)).apply(this, arguments));
                }

                babelHelpers.createClass(LoggedOutAlert, [{
                    key: 'init',
                    value: function init() {
                        this.loading = false;
                    }
                }, {
                    key: 'shouldShowAlert',
                    value: function shouldShowAlert() {
                        var user = app.session.user;

                        // If the user is logged out or does not have access to the chat we skip
                        if (!user || !user.canChatweeSsoLogin()) {
                            return false;
                        }

                        // If the ChatWee cookie does not exist
                        // This could either mean:
                        // The user doesn't have a ChatWee account associated yet
                        // The user already has a ChatWee account but didn't have the permissions for SSO upon login
                        // Or because the cookie was deleted by another mean (expiration/manual)
                        return !sessionIdCookieIsSet();
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        var _this3 = this;

                        if (!this.shouldShowAlert()) {
                            return m('div');
                        }

                        return AlertWithContainer.component({
                            type: 'info',
                            children: app.translator.trans('clarkwinkelmann-chatwee.forum.alert.loggedOut'),
                            controls: [Button.component({
                                className: 'Button Button--link',
                                children: app.translator.trans('clarkwinkelmann-chatwee.forum.alert.login'),
                                onclick: function onclick() {
                                    _this3.loading = true;

                                    app.request({
                                        method: 'POST',
                                        url: app.forum.attribute('apiUrl') + '/chatwee/login'
                                    }).then(function () {
                                        _this3.loading = false;
                                        m.redraw();

                                        ChatWeeClient.load();
                                    });
                                },
                                disabled: this.loading
                            })]
                        });
                    }
                }]);
                return LoggedOutAlert;
            }(Component);

            _export('default', LoggedOutAlert);
        }
    };
});;
'use strict';

System.register('clarkwinkelmann/chatwee/configureChatWeeClient', ['flarum/extend', 'flarum/components/Page', 'clarkwinkelmann/chatwee/ChatWeeClient'], function (_export, _context) {
    "use strict";

    var extend, Page, ChatWeeClient;

    _export('default', function () {
        var isConfigured = false;

        // We need app.forum to be available, so we run this on page init, but only once
        extend(Page.prototype, 'init', function () {
            if (isConfigured) {
                return;
            }

            isConfigured = true;

            ChatWeeClient.load();
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsPage) {
            Page = _flarumComponentsPage.default;
        }, function (_clarkwinkelmannChatweeChatWeeClient) {
            ChatWeeClient = _clarkwinkelmannChatweeChatWeeClient.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('clarkwinkelmann/chatwee/main', ['flarum/extend', 'flarum/app', 'clarkwinkelmann/chatwee/addLoggedOutAlert', 'clarkwinkelmann/chatwee/configureChatWeeClient', 'flarum/models/User', 'flarum/Model'], function (_export, _context) {
    "use strict";

    var extend, app, addLoggedOutAlert, configureChatWeeClient, User, Model;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_clarkwinkelmannChatweeAddLoggedOutAlert) {
            addLoggedOutAlert = _clarkwinkelmannChatweeAddLoggedOutAlert.default;
        }, function (_clarkwinkelmannChatweeConfigureChatWeeClient) {
            configureChatWeeClient = _clarkwinkelmannChatweeConfigureChatWeeClient.default;
        }, function (_flarumModelsUser) {
            User = _flarumModelsUser.default;
        }, function (_flarumModel) {
            Model = _flarumModel.default;
        }],
        execute: function () {

            app.initializers.add('clarkwinkelmann-chatwee', function () {
                User.prototype.canChatweeSsoLogin = Model.attribute('canChatweeSsoLogin');

                addLoggedOutAlert();
                configureChatWeeClient();
            });
        }
    };
});;
'use strict';

System.register('clarkwinkelmann/chatwee/sessionIdCookieIsSet', ['flarum/app'], function (_export, _context) {
    "use strict";

    var app;


    function cookieIsSet(cookieName) {
        return document.cookie.match(new RegExp('^(.*;)?\\s*' + cookieName + '\\s*=\\s*[^;]+(.*)?$')) !== null;
    }

    _export('default', function () {
        var chatId = app.forum.attribute('clarkwinkelmann-chatwee.chatId');

        var controlCookieName = 'flarum-chatwee-' + chatId;
        var ssoCookieName = 'chatwee-SID-' + chatId;

        // We can't check against the chatwee-SID-chatId cookie only, because that cookie is automatically set by the
        // javascript client is none is present. Instead we use another cookie that is only created by Flarum upon ChatWee SSO login
        return cookieIsSet(controlCookieName) && cookieIsSet(ssoCookieName);
    });

    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }],
        execute: function () {}
    };
});