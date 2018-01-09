import app from 'flarum/app';

function cookieIsSet(cookieName) {
    return document.cookie.match(new RegExp('^(.*;)?\\s*' + cookieName + '\\s*=\\s*[^;]+(.*)?$')) !== null;
}

export default function() {
    const chatId = app.forum.attribute('clarkwinkelmann-chatwee.chatId');

    const controlCookieName = 'flarum-chatwee-' + chatId;
    const ssoCookieName = 'chatwee-SID-' + chatId;

    // We can't check against the chatwee-SID-chatId cookie only, because that cookie is automatically set by the
    // javascript client is none is present. Instead we use another cookie that is only created by Flarum upon ChatWee SSO login
    return cookieIsSet(controlCookieName) && cookieIsSet(ssoCookieName);
}
