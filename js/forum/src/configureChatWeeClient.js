import {extend} from 'flarum/extend';
import app from 'flarum/app';
import Page from 'flarum/components/Page';

export default function () {
    let isConfigured = false;

    // We need app.forum to be available, so we run this on page init, but only once
    extend(Page.prototype, 'init', function () {
        if (isConfigured) {
            return;
        }

        isConfigured = true;

        const chatId = app.forum.attribute('clarkwinkelmann-chatwee.chatId');

        if (!chatId || !app.session.user) {
            return;
        }

        const chatweeManager = new ChatweeLib.ChatweeManager(chatId);
        chatweeManager.Run();
    });
}
