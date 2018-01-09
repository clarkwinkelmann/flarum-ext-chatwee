<?php

namespace ClarkWinkelmann\ChatWee;

use Flarum\Foundation\Application;
use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events, Application $app) {
    $app->register(Providers\ChatWeeServiceProvider::class);

    $events->subscribe(Listeners\AddApiRoutes::class);
    $events->subscribe(Listeners\AddClientAssets::class);
    $events->subscribe(Listeners\AddUserAttributes::class);
    $events->subscribe(Listeners\InjectSettings::class);
    $events->subscribe(Listeners\LoginLogout::class);
};
