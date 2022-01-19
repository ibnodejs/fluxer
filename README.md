<h1 align="center">Fluxer</h1>
<h4 align="center">InfluxDB MarketData</h4>

<p align="center"> <img src="./docs/InfluxDB-Cloud-2.0.png"></img></p>

This project is migrated from Exodus, an old app based on InfluxDB v1.

This one focuses on InfluxDB v2, mainly the Influx Cloud.

This focuses on the new Flux language - an open source functional data scripting language designed for querying, analyzing, and acting on data.

Sign up for InfluxData at https://influxdata.com

### Install

```
yarn
```

### Init

Create a `.env` file and add envs below

e.g

```
INFLUX_URL=
INFLUX_TOKEN=
INFLUX_ORG=
INFLUX_BUCKET=
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
