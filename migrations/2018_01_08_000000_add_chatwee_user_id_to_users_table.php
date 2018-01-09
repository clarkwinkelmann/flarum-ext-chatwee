<?php

use Flarum\Database\Migration;

return Migration::addColumns('users', [
    'chatwee_user_id' => [
        'string',
        'length' => 255,
        'nullable' => true,
    ],
]);
