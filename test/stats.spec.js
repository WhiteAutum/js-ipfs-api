/* eslint-env mocha */
'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)

const DaemonFactory = require('ipfsd-ctl')
const df = DaemonFactory.create()

describe('stats', function () {
  this.timeout(50 * 1000) // slow CI

  let ipfsd

  before((done) => {
    df.spawn((err, node) => {
      expect(err).to.not.exist()
      ipfsd = node
      done()
    })
  })

  after((done) => ipfsd.stop(done))

  describe('Callback API', () => {
    it('.stats.bitswap', (done) => {
      ipfsd.api.stats.bitswap((err, res) => {
        expect(err).to.not.exist()
        expect(res).to.exist()
        expect(res).to.have.a.property('ProvideBufLen')
        expect(res).to.have.a.property('Wantlist')
        expect(res).to.have.a.property('Peers')
        expect(res).to.have.a.property('BlocksReceived')
        expect(res).to.have.a.property('DataReceived')
        expect(res).to.have.a.property('BlocksSent')
        expect(res).to.have.a.property('DataSent')
        expect(res).to.have.a.property('DupBlksReceived')
        expect(res).to.have.a.property('DupDataReceived')
        done()
      })
    })

    it('.stats.bw', (done) => {
      ipfsd.api.stats.bw((err, res) => {
        expect(err).to.not.exist()
        expect(res).to.exist()
        expect(res).to.have.a.property('TotalIn')
        expect(res).to.have.a.property('TotalOut')
        expect(res).to.have.a.property('RateIn')
        expect(res).to.have.a.property('RateOut')
        done()
      })
    })

    it('.stats.repo', (done) => {
      ipfsd.api.stats.repo((err, res) => {
        expect(err).to.not.exist()
        expect(res).to.exist()
        expect(res).to.have.a.property('NumObjects')
        expect(res).to.have.a.property('RepoSize')
        expect(res).to.have.a.property('RepoPath')
        expect(res).to.have.a.property('Version')
        expect(res).to.have.a.property('StorageMax')
        done()
      })
    })
  })

  describe('Promise API', () => {
    it('.stats.bw', () => {
      return ipfsd.api.stats.bw()
        .then((res) => {
          expect(res).to.exist()
          expect(res).to.have.a.property('TotalIn')
          expect(res).to.have.a.property('TotalOut')
          expect(res).to.have.a.property('RateIn')
          expect(res).to.have.a.property('RateOut')
        })
    })

    it('.stats.repo', () => {
      return ipfsd.api.stats.repo()
        .then((res) => {
          expect(res).to.exist()
          expect(res).to.have.a.property('NumObjects')
          expect(res).to.have.a.property('RepoSize')
          expect(res).to.have.a.property('RepoPath')
          expect(res).to.have.a.property('Version')
          expect(res).to.have.a.property('StorageMax')
        })
    })

    it('.stats.bitswap', () => {
      return ipfsd.api.stats.bitswap()
        .then((res) => {
          expect(res).to.exist()
          expect(res).to.have.a.property('ProvideBufLen')
          expect(res).to.have.a.property('Wantlist')
          expect(res).to.have.a.property('Peers')
          expect(res).to.have.a.property('BlocksReceived')
          expect(res).to.have.a.property('DataReceived')
          expect(res).to.have.a.property('BlocksSent')
          expect(res).to.have.a.property('DataSent')
          expect(res).to.have.a.property('DupBlksReceived')
          expect(res).to.have.a.property('DupDataReceived')
        })
    })
  })
})
