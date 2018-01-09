<?php

namespace ClarkWinkelmann\ChatWee\Middlewares;

use ClarkWinkelmann\ChatWee\ChatWeeHelpers;
use ClarkWinkelmann\ChatWee\Repositories\SessionRepository;
use ClarkWinkelmann\ChatWee\Repositories\UserRepository;
use Flarum\Core\User;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Zend\Stratigility\MiddlewareInterface;

class LoginMiddleware implements MiddlewareInterface
{
    public function __invoke(Request $request, Response $response, callable $out = null)
    {
        $response = $out ? $out($request, $response) : $response;

        if (in_array($request->getUri()->getPath(), ['/login', '/register'])) {
            // The actor attribute isn't automatically re-populated after the login/register
            // However we can replicate the behaviour to get which user is logged in now
            $session = $request->getAttribute('session');
            $actor = User::find($session->get('user_id'));

            if ($actor) {
                if (!ChatWeeHelpers::hasChatWeeAccount($actor)) {
                    /**
                     * @var $userRepository UserRepository
                     */
                    $userRepository = app(UserRepository::class);

                    $userRepository->registerIfAllowed($actor);
                }

                // Do the test again because it might have changed
                if (ChatWeeHelpers::hasChatWeeAccount($actor)) {
                    /**
                     * @var $sessionRepository SessionRepository
                     */
                    $sessionRepository = app(SessionRepository::class);

                    $response = $sessionRepository->loginIfAllowed($response, $actor);
                }
            }
        }

        return $response;
    }
}
