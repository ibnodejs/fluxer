import 'mocha';
import supertest from 'supertest';
import chalk from 'chalk';
import { runApp } from './app';
import { PORT, appName } from './config';

// Start server
runApp();

const request = supertest(`http://127.0.0.1:${PORT}`);

beforeEach(done => setTimeout(done, 1500));

describe(`Server ${appName}`, () => {
    it('on / route should respond with json', function (done) {
        request.get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    // it('respond to highestAI', function (done) {
    //    request.post('/highest/ai')
    //         .send(demoData)
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /json/)
    //         .expect(200, done);
    // });
});