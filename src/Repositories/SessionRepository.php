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

    protected function controlCookieName()
    {
        return 'flarum-chatwee-' . $this->settings->get('clarkwinkelmann-chatwee.chatId');
    }

    protected function getSessionId(RequestInterface $request)
    {
        return FigRequestCookies::get($request, $this->cookieName())->getValue();
    }

    protected function configureCookie(SetCookie $cookie): SetCookie
    {
        $cookie = $cookie->withPath('/');

        $domain = $this->settings->get('clarkwinkelmann-chatwee.cookieDomain');

        if ($domain) {
            return $cookie->withDomain($domain);
        }

        return $cookie;
    }

    protected function login(ResponseInterface $response, User $user): ResponseInterface
    {
        if (!ChatWeeHelpers::hasChatWeeAccount($user)) {
            throw new \Exception('User does not have a ChatWee account');
        }

        $sessionId = $this->client->loginUser(ChatWeeHelpers::getChatWeeUserId($user));

        $response = FigResponseCookies::set(
            $response,
            $this->configureCookie(SetCookie::create($this->cookieName(), $sessionId))
        );

        $response = FigResponseCookies::set(
            $response,
            $this->configureCookie(SetCookie::create($this->controlCookieName(), $sessionId))
        );

        return $response;
    }

    public function loginIfAllowed(ResponseInterface $response, User $user): ResponseInterface
    {
        if ($user->can('clarkwinkelmann-chatwee.ssoLogin')) {
            return $this->login($response, $user);
        }

        return $response;
    }

    public function logout(RequestInterface $request, ResponseInterface $response)
    {
        $sessionId = $this->getSessionId($request);

        if ($sessionId) {
            $this->client->removeSession($sessionId);
        }

        $response = FigResponseCookies::set(
            $response,
            $this->configureCookie(SetCookie::createExpired($this->cookieName()))
        );

        $response = FigResponseCookies::set(
            $response,
            $this->configureCookie(SetCookie::createExpired($this->controlCookieName()))
        );

        return $response;
    }
}
