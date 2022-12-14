# Vue3 + WaveUI + FastApi + Tortoise ORM + Vite

I got tired of setting up the same stuff the same way for new web apps, so made a repository of a basic set up I would use.
Has very basic user signup/login with JWT authentication.
Figured other people may want to skip a few steps if they use a Vue/FastApi stack a lot.

nonPythonic

sorryAboutThat

## Installation

Unless I messed something up, just run

```
docker-compose up

```

## Usage

You'll need to have a PostgreSQL database set up before running.
.env file needs to be in top level to run in docker-compose, for non-dockerized production it should be moved to the backend folder.

```
docker-compose exec backend aerich init -t src.models.config.TORTOISE_ORM
# Initialize aerich to use Tortoise models.

docker-compose exec backend aerich init-db
# Initialize database.

docker-compose exec backend aerich migrate
# If you need to migrate after init you can use this command.

docker-compose exec backend aerich upgrade
# Push migrations to database.
```

## Contributing

Pull requests are welcome.
