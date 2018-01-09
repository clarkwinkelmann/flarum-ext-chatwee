<?php

namespace ClarkWinkelmann\ChatWee\Listeners;

use ClarkWinkelmann\ChatWee\Controllers\ChatWeeLoginController;
use Flarum\Event\ConfigureApiRoutes;
use Illuminate\Contracts\Events\Dispatcher;

class AddApiRoutes
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureApiRoutes::class, [$this, 'routes']);
    }

    public function routes(ConfigureApiRoutes $routes)
    {
        $routes->post(
            '/chatwee/login',
            'clarkwinkelmann.api.chatwee-login',
            ChatWeeLoginController::class
        );
    }
}
