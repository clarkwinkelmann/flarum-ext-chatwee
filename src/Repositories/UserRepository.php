<?php

namespace ClarkWinkelmann\ChatWee\Repositories;

use ClarkWinkelmann\ChatWee\ChatWee\Client;
use ClarkWinkelmann\ChatWee\ChatWeeHelpers;
use Flarum\Core\User;

class UserRepository
{
    protected $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    protected function isAdmin(User $user)
    {
        return $user->can('clarkwinkelmann-chatwee.adminAccess');
    }

    protected function register(User $user)
    {
        if (ChatWeeHelpers::hasChatWeeAccount($user)) {
            throw new \Exception('User already has a ChatWee account');
        }

        $userId = $this->client->registerUser(
            $user->username,
            $this->isAdmin($user),
            $user->avatar_url
        );

        $user->chatwee_user_id = $userId;
        $user->save();
    }

    public function registerIfAllowed(User $user)
    {
        if ($user->can('clarkwinkelmann-chatwee.ssoLogin')) {
            $this->register($user);
        }
    }

    public function logoutEverywhere(User $user)
    {
        if (!ChatWeeHelpers::hasChatWeeAccount($user)) {
            throw new \Exception('User does not have a ChatWee account');
        }

        $this->client->logoutUser(ChatWeeHelpers::getChatWeeUserId($user));
    }

    public function update(User $user)
    {
        if (!ChatWeeHelpers::hasChatWeeAccount($user)) {
            throw new \Exception('User does not have a ChatWee account');
        }

        $this->client->editUser(
            ChatWeeHelpers::getChatWeeUserId($user),
            $user->username,
            $this->isAdmin($user),
            $user->avatar_url
        );
    }

    public function delete(User $user)
    {
        if (!ChatWeeHelpers::hasChatWeeAccount($user)) {
            throw new \Exception('User does not have a ChatWee account');
        }

        $this->client->removeUser(ChatWeeHelpers::getChatWeeUserId($user));
    }
}
