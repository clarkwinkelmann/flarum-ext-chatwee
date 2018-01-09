<?php

namespace ClarkWinkelmann\ChatWee;

use Flarum\Core\User;
use Flarum\Settings\SettingsRepositoryInterface;

abstract class ChatWeeHelpers
{
    public static function getChatWeeUserId(User $user)
    {
        return $user->chatwee_user_id;
    }

    public static function hasChatWeeAccount(User $user)
    {
        return !!self::getChatWeeUserId($user);
    }

    public static function isApiConfigured()
    {
        /**
         * @var $settings SettingsRepositoryInterface
         */
        $settings = app(SettingsRepositoryInterface::class);

        return $settings->get('clarkwinkelmann-chatwee.chatId') && $settings->get('clarkwinkelmann-chatwee.clientKey');
    }
}
