<?php

namespace ClarkWinkelmann\ChatWee\Controllers;

use ClarkWinkelmann\ChatWee\ChatWeeHelpers;
use ClarkWinkelmann\ChatWee\Repositories\SessionRepository;
use ClarkWinkelmann\ChatWee\Repositories\UserRepository;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\Http\Controller\ControllerInterface;
use Psr\Http\Message\ServerRequestInterface;
use Zend\Diactoros\Response\EmptyResponse;

class ChatWeeLoginController implements ControllerInterface
{
    protected $userRepository;
    protected $sessionRepository;

    public $serializer = UserSerializer::class;

    public function __construct(UserRepository $userRepository, SessionRepository $sessionRepository)
    {
        $this->userRepository = $userRepository;
        $this->sessionRepository = $sessionRepository;
    }

    public function handle(ServerRequestInterface $request)
    {
        $user = $request->getAttribute('actor');

        if (!ChatWeeHelpers::hasChatWeeAccount($user)) {
            $this->userRepository->registerIfAllowed($user);
        }

        $response = new EmptyResponse();

        // Do the test again because it might have changed
        if (ChatWeeHelpers::hasChatWeeAccount($user)) {
            return $this->sessionRepository->loginIfAllowed($response, $user);
        }

        return $response;
    }
}
