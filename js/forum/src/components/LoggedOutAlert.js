import app from 'flarum/app';
import Component from 'flarum/Component';
import Alert from 'flarum/components/Alert';
import Button from 'flarum/components/Button';
import sessionIdCookieIsSet from 'clarkwinkelmann/chatwee/sessionIdCookieIsSet';
import ChatWeeClient from 'clarkwinkelmann/chatwee/ChatWeeClient';

class AlertWithContainer extends Alert {
    view() {
        const vdom = super.view();

        vdom.children = [
            m('.container', vdom.children),
        ];

        return vdom;
    }
}

export default class LoggedOutAlert extends Component {
    init() {
        this.loading = false;
    }

    shouldShowAlert() {
        const user = app.session.user;

        // If the user is logged out or does not have access to the chat we skip
        if (!user || !user.canChatweeSsoLogin()) {
            return false;
        }

        // If the ChatWee cookie does not exist
        // This could either mean:
        // The user doesn't have a ChatWee account associated yet
        // The user already has a ChatWee account but didn't have the permissions for SSO upon login
        // Or because the cookie was deleted by another mean (expiration/manual)
        return !sessionIdCookieIsSet();
    }

    view() {
        if (!this.shouldShowAlert()) {
            return m('div');
        }

        return AlertWithContainer.component({
            type: 'info',
            children: app.translator.trans('clarkwinkelmann-chatwee.forum.alert.loggedOut'),
            controls: [
                Button.component({
                    className: 'Button Button--link',
                    children: app.translator.trans('clarkwinkelmann-chatwee.forum.alert.login'),
                    onclick: () => {
                        this.loading = true;

                        app.request({
                            method: 'POST',
                            url: app.forum.attribute('apiUrl') + '/chatwee/login',
                        }).then(() => {
                            this.loading = false;
                            m.redraw();

                            ChatWeeClient.load();
                        });
                    },
                    disabled: this.loading,
                }),
            ],
        });
    }
}
