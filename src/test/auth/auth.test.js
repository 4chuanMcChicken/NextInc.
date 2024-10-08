const jwt = require('jsonwebtoken');
const rand = require("../../utils/randomUtil");
const config = require("config");
const expect = require('chai').expect;
const request = require('supertest');
const constants = require('../../utils/constantUtil');
const app = require('../../bin/www');
const { populateDB, checkAccounts } = require('../seed');
const cryptConfig = config.get('crypt');
const Redis = require("../../dao/storageRedis");

describe('clear db and add accounts', function() {
    before(async function() {
        await populateDB()
    })
    it('three account in db', async function() {
        const accountCount = await checkAccounts()
        expect(accountCount).to.be.equal(6)
    })
})

describe('AUTH register', function() {
    const accounts = [
        {
            boundMailbox: "test@unifans.test",
            passwd: "1",
        },
        {
            boundMailbox: "fan@UNIFANS.test",
            passwd: "123456",
        },
        {
            boundMailbox: "creator@Unifans.Test",
            passwd: "098adfjl!",
        },
        {
            boundMailbox: "Sanadate@hotmail.com",
            passwd: "098adfjl!",
        },
    ]
    before(async function() {
        await populateDB()
    })
    for (let account of accounts) {
        let sessionId = rand.randomInt(constants.RANDOM_MIN, constants.RANDOM_MAX).toString();
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
        it('register:' + account.boundMailbox, function(done) {
            request(app)
                .post('/account/register')
                .send({ boundMailbox: account.boundMailbox, sessionId: sessionId, password: account.passwd })
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.code).to.be.equal(0)
                })
                .end(done)
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
    }
})

describe('AUTH login', function() {
    const accounts = [
        {
            boundMailbox: "admin@unifans.test",
            role: constants.ACCOUNT_ROLE_ADMIN,
            nickName: "admin",
            passwd: "123456",
        },
        {
            boundMailbox: "fans1@unifans.test",
            role: constants.ACCOUNT_ROLE_FAN,
            nickName: "fans1",
            passwd: "123456",
        },
        {
            boundMailbox: "creator11@unifans.test",
            role: constants.ACCOUNT_ROLE_CREATOR,
            nickName: "creator1",
            passwd: "123456",
        },
        {
            boundMailbox: "Sanadate@hotmail.com",
            passwd: "098adfjl!",
            role: constants.ACCOUNT_ROLE_CREATOR,
            nickName: "creator2",
        },
    ]
    before(async function() {
        await populateDB(accounts, [], [], [], [])
    })
    for (let account of accounts) {
        it('login account:' + account.nickName, function(done) {
            request(app)
                .post('/account/login')
                .send({ boundMailbox: account.boundMailbox, password: account.passwd })
                .expect(200)
                .expect( (res) => {
                    expect(res.body.data).to.have.property('token')
                    let token = res.body.data.token
                    const tokenData = jwt.verify(token, cryptConfig.secret);
                    // const accountId = tokenData.accountId;
                    const role = tokenData.role;
                    expect(tokenData).to.have.property('accountId')
                    expect(role).to.be.equal(account.role)
                })
                .end(done)
        })
        it('login upper case account:' + account.nickName, function(done) {
            request(app)
                .post('/account/login')
                .send({ boundMailbox: account.boundMailbox.toUpperCase(), password: account.passwd })
                .expect(200)
                .expect( (res) => {
                    expect(res.body.data).to.have.property('token')
                    let token = res.body.data.token
                    const tokenData = jwt.verify(token, cryptConfig.secret);
                    // const accountId = tokenData.accountId;
                    const role = tokenData.role;
                    expect(tokenData).to.have.property('accountId')
                    expect(role).to.be.equal(account.role)
                })
                .end(done)
        })
    }
})