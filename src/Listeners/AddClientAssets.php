<?php

namespace ClarkWinkelmann\ChatWee\Listeners;

use ClarkWinkelmann\ChatWee\ChatWeeHelpers;
use DirectoryIterator;
use Flarum\Event\ConfigureLocales;
use Flarum\Event\ConfigureWebApp;
use Illuminate\Contracts\Events\Dispatcher;

class AddClientAssets
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureWebApp::class, [$this, 'addAssets']);
        $events->listen(ConfigureLocales::class, [$this, 'addLocales']);
    }

    public function addAssets(ConfigureWebApp $app)
    {
        if ($app->isAdmin()) {
            $app->addAssets([
                __DIR__ . '/../../js/admin/dist/extension.js',
            ]);
        }

        if ($app->isForum()) {
            $app->addAssets([
                __DIR__ . '/../../js/forum/dist/extension.js',
            ]);

            if (ChatWeeHelpers::isApiConfigured()) {
                $app->view->addHeadString('<script src="https://static.chatwee-api.com/v2/script.js"></script>');
            }
        }

        $app->addBootstrapper('clarkwinkelmann/chatwee/main');
    }

    public function addLocales(ConfigureLocales $event)
    {
        foreach (new DirectoryIterator(__DIR__ . '/../../locale') as $file) {
            if ($file->isFile() && in_array($file->getExtension(), ['yml', 'yaml'])) {
                $event->locales->addTranslations($file->getBasename('.' . $file->getExtension()), $file->getPathname());
            }
        }
    }
}
