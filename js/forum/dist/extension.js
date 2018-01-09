'use strict';

System.register('clarkwinkelmann/chatwee/configureChatWeeClient', ['flarum/extend', 'flarum/app', 'flarum/components/Page'], function (_export, _context) {
    "use strict";

    var extend, app, Page;

    _export('default', function () {
        var isConfigured = false;

        // We need app.forum to be available, so we run this on page init, but only once
        extend(Page.prototype, 'init', function () {
            if (isConfigured) {
                return;
            }

            isConfigured = true;

            var chatId = app.forum.attribute('clarkwinkelmann-chatwee.chatId');

            if (!chatId || !app.session.user) {
                return;
            }

            var chatweeManager = new ChatweeLib.ChatweeManager(chatId);
            chatweeManager.Run();
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsPage) {
            Page = _flarumComponentsPage.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('clarkwinkelmann/chatwee/main', ['flarum/extend', 'flarum/app', 'clarkwinkelmann/chatwee/configureChatWeeClient'], function (_export, _context) {
    "use strict";

    var extend, app, configureChatWeeClient;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_clarkwinkelmannChatweeConfigureChatWeeClient) {
            configureChatWeeClient = _clarkwinkelmannChatweeConfigureChatWeeClient.default;
        }],
        execute: function () {

            app.initializers.add('clarkwinkelmann-chatwee', function () {
                configureChatWeeClient();
            });
        }
    };
});