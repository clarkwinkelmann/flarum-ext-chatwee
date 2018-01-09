<?php

namespace ClarkWinkelmann\ChatWee\Repositories;

use ClarkWinkelmann\ChatWee\ChatWee\Client;
use ClarkWinkelmann\ChatWee\ChatWeeHelpers;
use Dflydev\FigCookies\FigRequestCookies;
use Dflydev\FigCookies\FigResponseCookies;
use Dflydev\FigCookies\SetCookie;
use Flarum\Core\User;
use Flarum\Settings\SettingsRepositoryInterface;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;

class SessionRepository
{
    protected $client;
    protected $settings;

    public function __construct(Client $client, SettingsRepositoryInterface $settings)
    {
        $this->client = $client;
        $this->settings = $settings;
    }

    /**
     * The name of the ChatWee cookie. The prefix is hard-coded in the ChatWee javascript client and can't be changed
     * @return string
     */
    protected function cookieName()
    {
        return 'chatwee-SID-' . $this->settings->get('clarkwinkelmann-chatwee.chatId');
    }

    protected function getSessionId(RequestInterface $request)
    {
        return FigRequestCookies::get($request, $this->cookieName())->getValue();
    }

    protected function configureCookie(SetCookie $cookie): SetCookie
    {
        $domain = $this->settings->get('clarkwinkelmann-chatwee.cookieDomain');

        if ($domain) {
            return $cookie->withDomain($domain);
        }

        return $cookie;
    }

    public function login(ResponseInterface $response, User $user): ResponseInterface
    {
        if (!ChatWeeHelpers::hasChatWeeAccount($user)) {
            throw new \Exception('User does not have a ChatWee account');
        }

        $sessionId = $this->client->loginUser(ChatWeeHelpers::getChatWeeUserId($user));

        return FigResponseCookies::set(
            $response,
            $this->configureCookie(SetCookie::create($this->cookieName(), $sessionId))
        );
    }

    public function logout(RequestInterface $request, ResponseInterface $response)
    {
        $sessionId = $this->getSessionId($request);

        if ($sessionId) {
            $this->client->removeSession($sessionId);
        }

        return FigResponseCookies::set(
            $response,
            $this->configureCookie(SetCookie::createExpired($this->cookieName()))
        );
    }
}
