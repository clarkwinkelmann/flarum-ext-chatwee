<?php

namespace ClarkWinkelmann\ChatWee\Listeners;

use Flarum\Api\Serializer\CurrentUserSerializer;
use Flarum\Event\PrepareApiAttributes;
use Illuminate\Contracts\Events\Dispatcher;

class AddUserAttributes
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(PrepareApiAttributes::class, [$this, 'addAttributes']);
    }

    public function addAttributes(PrepareApiAttributes $event)
    {
        if ($event->isSerializer(CurrentUserSerializer::class)) {
            $event->attributes['canChatweeSsoLogin'] = $event->model->can('clarkwinkelmann-chatwee.ssoLogin');
        }
    }
}
