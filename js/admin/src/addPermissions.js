import {extend} from 'flarum/extend';
import app from 'flarum/app';
import PermissionGrid from 'flarum/components/PermissionGrid';

export default function () {
    extend(PermissionGrid.prototype, 'moderateItems', items => {
        items.add('clarkwinkelmann-chatwee-admin-access', {
            icon: 'comments',
            label: app.translator.trans('clarkwinkelmann-chatwee.admin.permissions.adminAccess'),
            permission: 'clarkwinkelmann-chatwee.adminAccess',
        });
    });
}
