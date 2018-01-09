import app from 'flarum/app';
import sessionIdCookieIsSet from 'clarkwinkelmann/chatwee/sessionIdCookieIsSet';

export default {
    chatweeManager: null,
    load() {
        if (this.chatweeManager) {
            this.unload();
        }

        const chatId = app.forum.attribute('clarkwinkelmann-chatwee.chatId');
        const enableForGuests = app.forum.attribute('clarkwinkelmann-chatwee.enableForGuests');

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
    unload() {
        this.chatweeManager.Dispose();
        this.chatweeManager = null;
    },
}
