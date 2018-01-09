import {extend} from 'flarum/extend';
import app from 'flarum/app';
import ChatWeeSettingsModal from 'clarkwinkelmann/chatwee/components/ChatWeeSettingsModal';
import addPermissions from 'clarkwinkelmann/chatwee/addPermissions';

app.initializers.add('clarkwinkelmann-chatwee', app => {
    app.extensionSettings['clarkwinkelmann-chatwee'] = () => app.modal.show(new ChatWeeSettingsModal());

    addPermissions();
});
