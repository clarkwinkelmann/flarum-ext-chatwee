import {extend} from 'flarum/extend';
import Page from 'flarum/components/Page';
import ChatWeeClient from 'clarkwinkelmann/chatwee/ChatWeeClient';

export default function () {
    let isConfigured = false;

    // We need app.forum to be available, so we run this on page init, but only once
    extend(Page.prototype, 'init', function () {
        if (isConfigured) {
            return;
        }

        isConfigured = true;

        ChatWeeClient.load();
    });
}
