import {override} from 'flarum/extend';
import IndexPage from 'flarum/components/IndexPage';
import LoggedOutAlert from 'clarkwinkelmann/chatwee/components/LoggedOutAlert';

export default function () {
    override(IndexPage.prototype, 'hero', original => {
        return [
            original(),
            LoggedOutAlert.component(),
        ];
    });
}
