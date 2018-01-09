'use strict';

System.register('clarkwinkelmann/chatwee/components/ChatWeeSettingsModal', ['flarum/app', 'flarum/components/SettingsModal'], function (_export, _context) {
    "use strict";

    var app, SettingsModal, settingsPrefix, translationPrefix, ChatWeeSettingsModal;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsSettingsModal) {
            SettingsModal = _flarumComponentsSettingsModal.default;
        }],
        execute: function () {
            settingsPrefix = 'clarkwinkelmann-chatwee.';
            translationPrefix = 'clarkwinkelmann-chatwee.admin.settings.';

            ChatWeeSettingsModal = function (_SettingsModal) {
                babelHelpers.inherits(ChatWeeSettingsModal, _SettingsModal);

                function ChatWeeSettingsModal() {
                    babelHelpers.classCallCheck(this, ChatWeeSettingsModal);
                    return babelHelpers.possibleConstructorReturn(this, (ChatWeeSettingsModal.__proto__ || Object.getPrototypeOf(ChatWeeSettingsModal)).apply(this, arguments));
                }

                babelHelpers.createClass(ChatWeeSettingsModal, [{
                    key: 'title',
                    value: function title() {
                        return app.translator.trans(translationPrefix + 'title');
                    }
                }, {
                    key: 'form',
                    value: function form() {
                        return [m('.Form-group', [m('label', app.translator.trans(translationPrefix + 'field.chatId')), m('input.FormControl', {
                            bidi: this.setting(settingsPrefix + 'chatId'),
                            placeholder: '0123456789abcdef01234567'
                        })]), m('.Form-group', [m('label', app.translator.trans(translationPrefix + 'field.clientKey')), m('input.FormControl', {
                            bidi: this.setting(settingsPrefix + 'clientKey'),
                            placeholder: '0123456789abcdef01234567'
                        })]), m('.Form-group', [m('label', app.translator.trans(translationPrefix + 'field.cookieDomain')), m('input.FormControl', {
                            bidi: this.setting(settingsPrefix + 'cookieDomain'),
                            placeholder: 'example.com'
                        })])];
                    }
                }]);
                return ChatWeeSettingsModal;
            }(SettingsModal);

            _export('default', ChatWeeSettingsModal);
        }
    };
});;
'use strict';

System.register('clarkwinkelmann/chatwee/main', ['flarum/extend', 'flarum/app', 'clarkwinkelmann/chatwee/components/ChatWeeSettingsModal', 'clarkwinkelmann/chatwee/addPermissions'], function (_export, _context) {
    "use strict";

    var extend, app, ChatWeeSettingsModal, addPermissions;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_clarkwinkelmannChatweeComponentsChatWeeSettingsModal) {
            ChatWeeSettingsModal = _clarkwinkelmannChatweeComponentsChatWeeSettingsModal.default;
        }, function (_clarkwinkelmannChatweeAddPermissions) {
            addPermissions = _clarkwinkelmannChatweeAddPermissions.default;
        }],
        execute: function () {

            app.initializers.add('clarkwinkelmann-chatwee', function (app) {
                app.extensionSettings['clarkwinkelmann-chatwee'] = function () {
                    return app.modal.show(new ChatWeeSettingsModal());
                };

                addPermissions();
            });
        }
    };
});;
'use strict';

System.register('clarkwinkelmann/chatwee/addPermissions', ['flarum/extend', 'flarum/app', 'flarum/components/PermissionGrid'], function (_export, _context) {
    "use strict";

    var extend, app, PermissionGrid;

    _export('default', function () {
        extend(PermissionGrid.prototype, 'moderateItems', function (items) {
            items.add('clarkwinkelmann-chatwee-admin-access', {
                icon: 'comments',
                label: app.translator.trans('clarkwinkelmann-chatwee.admin.permissions.adminAccess'),
                permission: 'clarkwinkelmann-chatwee.adminAccess'
            });
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsPermissionGrid) {
            PermissionGrid = _flarumComponentsPermissionGrid.default;
        }],
        execute: function () {}
    };
});