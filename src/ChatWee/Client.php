<?php

namespace ClarkWinkelmann\ChatWee\ChatWee;

use GuzzleHttp\Client as GuzzleClient;

class Client
{
    protected $chatId;
    protected $clientKey;
    protected $guzzle;

    public function __construct(string $chatId, string $clientKey)
    {
        $this->guzzle = new GuzzleClient([
            'base_uri' => 'https://chatwee-api.com/v2/',
        ]);

        $this->chatId = $chatId;
        $this->clientKey = $clientKey;
    }

    protected function addCredentialsToQuery(array $query): array
    {
        $query += [
            'chatId' => $this->chatId,
            'clientKey' => $this->clientKey,
        ];

        return $query;
    }

    protected function get(string $url, array $query = [])
    {
        $response = $this->guzzle->get($url, [
            'query' => $this->addCredentialsToQuery($query),
        ]);

        return json_decode($response->getBody(), true);
    }

    protected function expectTrue($response)
    {
        if ($response !== true) {
            throw new \Exception('Unexpected ChatWee Api response. Expected true, got ' . json_encode($response));
        }
    }

    /**
     * @param string $login
     * @param bool $isAdmin
     * @param string|null $avatar
     * @return string userId
     */
    public function registerUser(string $login, bool $isAdmin = false, string $avatar = null): string
    {
        return $this->get('sso-user/register', [
            'login' => $login,
            'isAdmin' => $isAdmin ? 1 : 0,
            'avatar' => $avatar,
        ]);
    }

    /**
     * @param string $userId
     * @param string|null $userIp
     * @return string sessionId
     */
    public function loginUser(string $userId, string $userIp = null): string
    {
        return $this->get('sso-user/login', [
            'userId' => $userId,
            'userIp' => $userIp,
        ]);
    }

    public function logoutUser(string $userId)
    {
        $this->expectTrue($this->get('sso-user/logout', [
            'userId' => $userId,
        ]));
    }

    public function removeSession(string $sessionId)
    {
        $this->expectTrue($this->get('sso-user/remove-session', [
            'sessionId' => $sessionId,
        ]));
    }

    public function validateSession(string $sessionId): bool
    {
        return $this->get('sso-user/validate-session', [
            'sessionId' => $sessionId,
        ]);
    }

    public function editUser(string $userId, string $login, bool $isAdmin = false, string $avatar = null)
    {
        $this->expectTrue($this->get('sso-user/edit', [
            'userId' => $userId,
            'login' => $login,
            'isAdmin' => $isAdmin ? 1 : 0,
            'avatar' => $avatar,
        ]));
    }

    public function removeUser(string $userId)
    {
        $this->expectTrue($this->get('sso-user/remove', [
            'userId' => $userId,
        ]));
    }
}
