# sales-dashboard-api

Developed using NodeJS and Express. Docker is used to allow easy instantiation of MySQL on local machine.
Initiation of DB follows the script in /sql/init.sql

## How to Run

1. Run `npm install` to install used dependencies.
2. Open up Docker Desktop and run `docker compose up` in terminal. Designed docker-compose file that builds container named:
   - db to instantiate MySQL db according to script
   - api to run node server for endpoints
3. Check instantiated db with `docker exec -it mysql_db mysql -u devUser -pdevUser vuetest`.
4. Backend should be ready and data will reflect in frontend.
