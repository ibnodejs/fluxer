import 'mocha';
import supertest from 'supertest';
import chalk from 'chalk';
import { runApp } from './app';

before(done => runApp().then(i => done()));

const request = supertest(`http://127.0.0.1:${PORT}`);

beforeEach(done => setTimeout(done, 1500));

describe('Given Position server /', () => {
    it('responds with json', function (done) {
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