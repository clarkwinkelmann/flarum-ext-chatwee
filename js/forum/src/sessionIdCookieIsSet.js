import app from 'flarum/app';

function cookieIsSet(cookieName) {
    return document.cookie.match(new RegExp('^(.*;)?\\s*' + cookieName + '\\s*=\\s*[^;]+(.*)?$')) !== null;
}

export default function() {
    const ssoCookieName = 'chatwee-SID-' + app.forum.attribute('clarkwinkelmann-chatwee.chatId');

    // We can't check against the chatwee-SID-chatId cookie only, because that cookie is automatically set by the
    // javascript client is none is present. Instead we use another cookie that is only created by Flarum upon ChatWee SSO login
    return cookieIsSet('flarum_chatwee_session') && cookieIsSet(ssoCookieName);
}
