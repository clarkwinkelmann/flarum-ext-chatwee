<?php

namespace ClarkWinkelmann\ChatWee\Listeners;

use Carbon\Carbon;
use ClarkWinkelmann\ChatWee\ChatWeeHelpers;
use ClarkWinkelmann\ChatWee\Middlewares\LoginMiddleware;
use ClarkWinkelmann\ChatWee\Middlewares\LogoutMiddleware;
use ClarkWinkelmann\ChatWee\Repositories\UserRepository;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Event\ConfigureMiddleware;
use Flarum\Event\UserAvatarWasChanged;
use Flarum\Event\UserGroupsWereChanged;
use Flarum\Event\UserPasswordWasChanged;
use Flarum\Event\UserWasDeleted;
use Flarum\Event\UserWasRenamed;
use Flarum\Event\UserWillBeSaved;
use Illuminate\Contracts\Events\Dispatcher;

class LoginLogout
{
    use AssertPermissionTrait;

    /**
     * @var UserRepository
     */
    protected $userRepository;

    protected function userRepository()
    {
        if (!$this->userRepository) {
            $this->userRepository = app(UserRepository::class);
        }

        return $this->userRepository;
    }

    public function subscribe(Dispatcher $events)
    {
        if (!ChatWeeHelpers::isApiConfigured()) {
            return;
        }

        $events->listen(UserWasRenamed::class, [$this, 'updated']);
        $events->listen(UserAvatarWasChanged::class, [$this, 'updated']);
        $events->listen(UserGroupsWereChanged::class, [$this, 'updated']);
        $events->listen(UserWasDeleted::class, [$this, 'deleted']);
        $events->listen(UserPasswordWasChanged::class, [$this, 'changedPassword']);
        $events->listen(UserWillBeSaved::class, [$this, 'watchForSuspension']);

        $events->listen(ConfigureMiddleware::class, [$this, 'middlewares']);
    }

    /**
     * @param UserWasRenamed|UserAvatarWasChanged|UserGroupsWereChanged $event
     */
    public function updated($event)
    {
        if (!ChatWeeHelpers::hasChatWeeAccount($event->user)) {
            return;
        }

        $this->userRepository()->update($event->user);
    }

    public function deleted(UserWasDeleted $event)
    {
        if (!ChatWeeHelpers::hasChatWeeAccount($event->user)) {
            return;
        }

        $this->userRepository()->delete($event->user);
    }

    public function changedPassword(UserPasswordWasChanged $event)
    {
        $this->userRepository()->logoutEverywhere($event->user);
    }

    public function watchForSuspension(UserWillBeSaved $event)
    {
        $attributes = array_get($event->data, 'attributes', []);

        // There are no events available for "UserWasSuspended", so we have to watch user data
        if (array_key_exists('suspendUntil', $attributes)) {
            // Check permissions the same way as the suspend extension does
            $this->assertCan($event->actor, 'suspend', $event->user);

            $isGettingSuspended = true;

            if (is_null($attributes['suspendUntil'])) {
                $isGettingSuspended = false;
            } else {
                try {
                    $date = Carbon::parse($attributes['suspendUntil']);

                    $isGettingSuspended = $date->gt(Carbon::now());
                } catch (\Exception $exception) {
                    // Silence any exception
                    // That's so we don't have to worry about the date format
                }
            }

            if ($isGettingSuspended) {
                // Force a global logout for that user if he's being suspended
                $this->userRepository()->logoutEverywhere($event->user);
            }
        }
    }

    public function middlewares(ConfigureMiddleware $middleware)
    {
        $middleware->pipe->pipe(null, app(LoginMiddleware::class));
        $middleware->pipe->pipe(null, app(LogoutMiddleware::class));
    }
}
