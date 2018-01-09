<?php

namespace ClarkWinkelmann\ChatWee\Listeners;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\PrepareApiAttributes;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;

class InjectSettings
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function subscribe(Dispatcher $events)
    {
        $events->listen(PrepareApiAttributes::class, [$this, 'permissions']);
    }

    public function permissions(PrepareApiAttributes $event)
    {
        if ($event->serializer instanceof ForumSerializer) {
            $event->attributes['clarkwinkelmann-chatwee.chatId'] = $this->settings->get('clarkwinkelmann-chatwee.chatId');
            $event->attributes['clarkwinkelmann-chatwee.enableForGuests'] = (bool)$this->settings->get('clarkwinkelmann-chatwee.enableForGuests');
        }
    }
}
