import {extend} from 'flarum/extend';
import app from 'flarum/app';
import PermissionGrid from 'flarum/components/PermissionGrid';
import ItemList from 'flarum/utils/ItemList';

export default function () {
    PermissionGrid.prototype.chatweeItems = function () {
        const items = new ItemList();

        items.add('clarkwinkelmann-chatwee-sso-login', {
            icon: 'user-plus',
            label: app.translator.trans('clarkwinkelmann-chatwee.admin.permissions.ssoLogin'),
            permission: 'clarkwinkelmann-chatwee.ssoLogin',
        });

        items.add('clarkwinkelmann-chatwee-admin-access', {
            icon: 'star',
            label: app.translator.trans('clarkwinkelmann-chatwee.admin.permissions.adminAccess'),
            permission: 'clarkwinkelmann-chatwee.adminAccess',
        });

        return items;
    };

    extend(PermissionGrid.prototype, 'permissionItems', function (items) {
        items.add('chatwee', {
            label: app.translator.trans('clarkwinkelmann-chatwee.admin.permissions.chatweeHeading'),
            children: this.chatweeItems().toArray()
        }, 50);
    });
}
