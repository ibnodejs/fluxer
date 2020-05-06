<h1 align="center">Exodus 📖</h1>
<h4 align="center">The Book of MarketData</h4>

<p align="center"> <img src="./docs/mkd.png"></img></p>

Small server that saves market data to influx

### Install
```
cd exodus 
yarn 
```

### Init
Create a `.env` file and add Env `INFLUX_HOST` and `INFLUX_PORT`

e.g
```
INFLUX_HOST=localhost
INFLUX_PORT=8086
```

### Run
```ts
yarn dev
```

## V1
- GET `/v1/query`
  ```ts
  ```
- POST `/v1/insert`
  ```ts
  ```

see `test.ts` for more