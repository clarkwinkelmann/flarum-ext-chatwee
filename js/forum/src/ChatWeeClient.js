import app from 'flarum/app';
import sessionIdCookieIsSet from 'clarkwinkelmann/chatwee/sessionIdCookieIsSet';

export default {
    chatweeManager: null,
    load() {
        if (this.chatweeManager) {
            this.unload();
        }

        if (!sessionIdCookieIsSet()) {
            return;
        }

        const chatId = app.forum.attribute('clarkwinkelmann-chatwee.chatId');

        this.chatweeManager = new ChatweeLib.ChatweeManager(chatId);
        this.chatweeManager.Run();
    },
    unload() {
        this.chatweeManager.Dispose();
        this.chatweeManager = null;
    },
}
