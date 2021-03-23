# LegoCollectionManager
UI for managing Lego collections sorted by a LegoSorting machine.

## Installation

1. Install the mysql database using the latest databasedump in a mysql database server.

```bash
LegoCollectionManager/backend/sqldatabase/
```
2. Create a copy of
```bash
LegoCollectionManager/backend/.default.env
```
and rename the file to `.env`

3. Change the credentials of your created database

4. Get a [Bricklink Account](https://www.bricklink.com/v2/api/welcome.page) to get access to their [API](https://www.bricklink.com/v2/api/register_consumer.page). 
Register your current IP within their [consumer page](https://www.bricklink.com/v2/api/register_consumer.page) and feed this info to fill the `BRICKLINK_*`- Information in the `.env`-file.

5. Install the backend
```bash
LegoCollectionManager/backend/npm install
```

6. Install the frontend
```bash
LegoCollectionManager/frontend/npm install
```

## Usage

Postman file for backend service
```bash
LegoCollectionManager/backend/LegoSorterDB.postman_collection.json
```

Start the backend
```bash
LegoCollectionManager/backend/npm start
```

Start the frontend
```bash
LegoCollectionManager/frontend/npm start
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
