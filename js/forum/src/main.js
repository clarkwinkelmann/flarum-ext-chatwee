import {extend} from 'flarum/extend';
import app from 'flarum/app';
import addLoggedOutAlert from 'clarkwinkelmann/chatwee/addLoggedOutAlert';
import configureChatWeeClient from 'clarkwinkelmann/chatwee/configureChatWeeClient';
import User from 'flarum/models/User';
import Model from 'flarum/Model';

app.initializers.add('clarkwinkelmann-chatwee', () => {
    User.prototype.canChatweeSsoLogin = Model.attribute('canChatweeSsoLogin');

    addLoggedOutAlert();
    configureChatWeeClient();
});
