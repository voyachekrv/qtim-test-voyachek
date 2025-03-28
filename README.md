## Запуск при помощи Docker

Приложение может быть запущено при помощи Docker. Для этого нужно добавить файл `.env`.

```
POSTGRES_HOST='postgres.qtim'
POSTGRES_PORT=5432
POSTGRES_USER='postgres'
POSTGRES_PASSWORD='postgres'
POSTGRES_DB='qtim_test'
PGDATA='/var/lib/postgresql/data/pgdata'

REDIS_PORT=6379
REDIS_PASSWORD=admin
```

Далее ввести команду:

```sh
$ docker compose up
```
После перейти на [localhost:13000/api/docs](http://localhost:13000/api/docs).
