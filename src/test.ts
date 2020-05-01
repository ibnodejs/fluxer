import 'mocha';
import supertest from 'supertest';
import chalk from 'chalk';
import { runApp } from './app';
import { PORT, appName } from './config';

// Start server
runApp();

const request = supertest(`http://127.0.0.1:${PORT}`);

beforeEach(done => setTimeout(done, 1500));

const object = {
    symbol: "USO",
    open: 2,
    high: 3,
    low: 1,
    close: 2,
    volume: 100,
    date: new Date(),
};

const arr = [object];

describe(`Server ${appName}`, () => {
    it('on / route should respond with json', function (done) {
        request.get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    /**
     * /insert
     */
    it('should insert object market data', function (done) {
        request.post('/v1/insert')
            .send(object)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('should insert array market data', function (done) {
        request.post('/v1/insert')
            .send(arr)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('should not insert empty array market data', function (done) {
        request.post('/v1/insert')
            .send([])
            .set('Accept', 'application/json')
            .expect(401, done);
    });

    it('should not insert empty market data item', function (done) {
        request.post('/v1/insert')
            .send({})
            .set('Accept', 'application/json')
            .expect(401, done);
    });

    // query

    it('should not insert empty market data item', function (done) {
        request.get('/v1/query')
            .send({})
            .set('Accept', 'application/json')
            .expect(200, done);
    });
});