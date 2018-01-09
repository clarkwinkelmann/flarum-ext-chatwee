import {extend} from 'flarum/extend';
import app from 'flarum/app';
import configureChatWeeClient from 'clarkwinkelmann/chatwee/configureChatWeeClient';

app.initializers.add('clarkwinkelmann-chatwee', () => {
    configureChatWeeClient();
});
