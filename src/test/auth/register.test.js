const jwt = require('jsonwebtoken');
var async = require('async');
const rand = require("../../utils/randomUtil");
const config = require("config");
const expect = require('chai').expect;
const request = require('supertest');
const constants = require('../../utils/constantUtil');
const app = require('../../bin/www');
const { populateDB } = require('../seed');
const cryptConfig = config.get('crypt');
const Redis = require("../../dao/storageRedis");
const couchdb = require('../../dao/storageCouchDB');
const AccountModel = require("../../model/accountModel");

describe('AUTH register', function() {
    const account = {
            boundMailbox: "benchmark@unifans.test",
            passwd: "123456",
            sessionId: "123456789012"
        }
    before(async function() {
        await populateDB()
    })

    // let sessionId = rand.randomInt(constants.RANDOM_MIN, constants.RANDOM_MAX).toString();
    let sessionId = account.sessionId
    let code = ""
    it('registerVerificationCode:' + account.boundMailbox, function(done) {
        request(app)
            .post('/common/registerVerificationCode')
            .send({ boundMailbox: account.boundMailbox, sessionId: sessionId })
            .expect(200)
            .expect((res) => {
                expect(res.body.data.code).to.be.equal(0)
            })
            .end(async function(err,res) {
                code = await Redis.CONN0.lindex(sessionId, 1)
                done()
            })
    })
    
    it('verify:' + account.boundMailbox, function(done) {
        request(app)
            .post('/common/verify')
            .send({ code: code, type: 'register', sessionId: sessionId })
            .expect(200)
            .expect((res) => {
                expect(res.body.data.code).to.be.equal(0)
            })
            .end(done)
    })
    // parallel calling register
    it('parallel register:' + account.boundMailbox, function(done) {
        let parallelRuns = 100;
        let actualRuns = 0;
        let asyncTask = function(err, result) {
            request(app)
                .post('/account/register')
                .send({ boundMailbox: account.boundMailbox, sessionId: sessionId, password: account.passwd })
                .expect(200)
                .end(function(err, res) {
                    actualRuns++
                    if (actualRuns === parallelRuns) {
                        done()
                    }
                })

        }
        async.times(parallelRuns, asyncTask, done)
    })
    it('login account:' + account.boundMailbox, function(done) {
        request(app)
            .post('/account/login')
            .send({ boundMailbox: account.boundMailbox, password: account.passwd })
            .expect(200)
            .expect( (res) => {
                expect(res.body.data).to.have.property('token')
                let token = res.body.data.token
                const tokenData = jwt.verify(token, cryptConfig.secret);
                const role = tokenData.role;
                expect(tokenData).to.have.property('accountId')
                expect(role).to.be.equal(constants.ACCOUNT_ROLE_FAN)
            })
            .end(done)
    })
    it('accounts number should be one, email:' + account.boundMailbox, async function() {
            const q = {
                reduce: false,
                descending: false,
                include_docs: true,
                key: account.boundMailbox
            }
            const result = await couchdb.getDataByView(
                AccountModel.dbName,
                constants.DESIGN_ACCOUNT_INFORMATION,
                constants.VIEW_ACCOUNT_BY_MAILBOX,
                q);
            expect(result.rows.length).to.be.lessThan(5)
    })
})