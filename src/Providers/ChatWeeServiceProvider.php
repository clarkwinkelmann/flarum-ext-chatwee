<?php

namespace ClarkWinkelmann\ChatWee\Providers;

use ClarkWinkelmann\ChatWee\ChatWee\Client;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class ChatWeeServiceProvider extends ServiceProvider
{
    public function register()
    {
        /** @var SettingsRepositoryInterface $settings */
        $settings = $this->app->make(SettingsRepositoryInterface::class);

        $this->app->singleton(Client::class, function () use ($settings) {
            return new Client(
                $settings->get('clarkwinkelmann-chatwee.chatId'),
                $settings->get('clarkwinkelmann-chatwee.clientKey')
            );
        });
    }
}
