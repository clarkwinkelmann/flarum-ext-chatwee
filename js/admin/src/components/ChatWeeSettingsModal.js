import app from 'flarum/app';
import SettingsModal from 'flarum/components/SettingsModal';

const settingsPrefix = 'clarkwinkelmann-chatwee.';
const translationPrefix = 'clarkwinkelmann-chatwee.admin.settings.';

export default class ChatWeeSettingsModal extends SettingsModal {
    title() {
        return app.translator.trans(translationPrefix + 'title');
    }

    form() {
        return [
            m('.Form-group', [
                m('label', app.translator.trans(translationPrefix + 'field.chatId')),
                m('input.FormControl', {
                    bidi: this.setting(settingsPrefix + 'chatId'),
                    placeholder: '0123456789abcdef01234567',
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans(translationPrefix + 'field.clientKey')),
                m('input.FormControl', {
                    bidi: this.setting(settingsPrefix + 'clientKey'),
                    placeholder: '0123456789abcdef01234567',
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans(translationPrefix + 'field.cookieDomain')),
                m('input.FormControl', {
                    bidi: this.setting(settingsPrefix + 'cookieDomain'),
                    placeholder: 'example.com',
                }),
            ]),
        ];
    }
}
