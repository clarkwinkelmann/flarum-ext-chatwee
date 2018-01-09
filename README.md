# ChatWee Flarum SSO

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/clarkwinkelmann/flarum-ext-chatwee/blob/master/LICENSE.md) [![Latest Stable Version](https://img.shields.io/packagist/v/clarkwinkelmann/flarum-ext-chatwee.svg)](https://packagist.org/packages/clarkwinkelmann/flarum-ext-chatwee) [![Total Downloads](https://img.shields.io/packagist/dt/clarkwinkelmann/flarum-ext-chatwee.svg)](https://packagist.org/packages/clarkwinkelmann/flarum-ext-chatwee) [![Donate](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.me/clarkwinkelmann)

Integrate [ChatWee SSO](https://chatwee.com/) with your Flarum. Features:

- Automatically create accounts and connect users into ChatWee via SSO
- Login into ChatWee can be restricted to a list of Flarum groups
- Choose which Flarum groups get admin access in ChatWee
- Username, avatar and admin status are automatically synced every time the Flarum user is edited
- Integrates with Flarum account activation and suspension. Only activated and non-suspended users are logged into ChatWee
- If an admin change the password of a user or suspend its account, he is disconnected from all existing ChatWee sessions
- If the Flarum account was created before it being allowed to access ChatWee or if cookies expired/were deleted, a banner and button will allow the user to reconnect to ChatWee without having to reload the page

**Please note:** The Single Sign-on feature of ChatWee requires a ChatWee Pro account or higher.

## Installation

Use [Bazaar](https://discuss.flarum.org/d/5151-flagrow-bazaar-the-extension-marketplace) or install manually:

```bash
composer require clarkwinkelmann/flarum-ext-chatwee
```

## Updating

```bash
composer update clarkwinkelmann/flarum-ext-chatwee
php flarum migrate
php flarum cache:clear
```

## Configuration

Upon activation, the settings modal of the extension should appear.
If not, you can access it by going to *Admin > Extensions* and Clicking on *Settings* on the ChatWee extension icon.

The following settings need to be configured:

**Chat ID** (required): The `chatId` attribute you can find in your ChatWee account.

**Client Key** (required): The `clientKey` attribute you can find in your ChatWee account.

**Cookie Domain** (recommended): This should be the same domain as the one used by the ChatWee javascript client.
While not properly documented, it seems to be the second-level domain of your hostname.
If your forum is hosted at `forum.example.com`, use `example.com` here.

**Enable when logged out**: Enabling this option will run the ChatWee javascript client even if no user is logged into Flarum.
This can be useful to also enable guest access or another login provider inside ChatWee.
This does not enable guest access inside your ChatWee account.

The following permissions can be configured in the *Admin > Permissions* area:

**Auto-login via SSO**: Which Flarum users will be able to access ChatWee.
Set this option to *Members* to allow all enabled and non-suspended accounts to access it.
Please note that if you narrow down this setting while users are connected, this will not automatically disconnect any user who lost the privilege.
Their sessions will remain valid until they log out or are suspended.

**ChatWee Admin access**: Which Flarum users will get the admin flag (`isAdmin`) applied to their ChatWee SSO account.
Changing this setting will not automatically update the user status.
Users need to update their profile (username, avatar or group) to refresh the ChatWee account role (whether it was gained or lost).

## Acknowledgements

The original version of this extension was created for [Coinpedi](http://coinpedi.com/).

## Links

- [Flarum Discuss post](https://discuss.flarum.org/d/8275-chatwee-sso)
- [Source code on GitHub](https://github.com/clarkwinkelmann/flarum-ext-chatwee)
- [Report an issue](https://github.com/clarkwinkelmann/flarum-ext-chatwee/issues)
- [Download via Packagist](https://packagist.org/packages/clarkwinkelmann/flarum-ext-chatwee)

This is an extension by Clark Winkelmann.
Need a custom Flarum extension ? [Contact me !](https://clarkwinkelmann.com/flarum)
