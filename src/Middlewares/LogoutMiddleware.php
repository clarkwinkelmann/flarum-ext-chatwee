<?php

namespace ClarkWinkelmann\ChatWee\Middlewares;

use ClarkWinkelmann\ChatWee\Repositories\SessionRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Zend\Stratigility\MiddlewareInterface;

class LogoutMiddleware implements MiddlewareInterface
{
    public function __invoke(Request $request, Response $response, callable $out = null)
    {
        $response = $out ? $out($request, $response) : $response;

        if ($request->getUri()->getPath() === '/logout') {
            /**
             * @var $sessionRepository SessionRepository
             */
            $sessionRepository = app(SessionRepository::class);

            $response = $sessionRepository->logout($request, $response);
        }

        return $response;
    }
}
