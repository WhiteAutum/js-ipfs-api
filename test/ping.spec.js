/* eslint-env mocha */
'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)

const parallel = require('async/parallel')
const series = require('async/series')

const DaemonFactory = require('ipfsd-ctl')
const df = DaemonFactory.create()

describe.skip('.ping', () => {
  let ipfsd
  let other

  before(function (done) {
    this.timeout(20 * 1000) // slow CI
    series([
      (cb) => {
        df.spawn((err, node) => {
          expect(err).to.not.exist()
          ipfsd = node
          cb()
        })
      },
      (cb) => {
        console.log('going to spawn second node')
        df.spawn((err, node) => {
          expect(err).to.not.exist()
          other = node
          cb()
        })
      },
      (cb) => {
        ipfsd.api.id((err, id) => {
          expect(err).to.not.exist()
          const ma = id.addresses[0]
          other.api.swarm.connect(ma, cb)
        })
      }
    ], done)
  })

  after((done) => {
    parallel([
      (cb) => ipfsd.stop(cb),
      (cb) => other.stop(cb)
    ], done)
  })

  describe('callback API', () => {
    it('ping another peer', (done) => {
      other.id((err, id) => {
        expect(err).to.not.exist()

        ipfsd.api.ping(id.id, (err, res) => {
          expect(err).to.not.exist()
          expect(res).to.have.a.property('Success')
          expect(res).to.have.a.property('Time')
          expect(res).to.have.a.property('Text')
          expect(res.Text).to.contain('Average latency')
          expect(res.Time).to.be.a('number')
          done()
        })
      })
    })
  })

  describe('promise API', () => {
    it('ping another peer', () => {
      return other.id()
        .then((id) => {
          return ipfsd.api.ping(id.id)
        })
        .then((res) => {
          expect(res).to.have.a.property('Success')
          expect(res).to.have.a.property('Time')
          expect(res).to.have.a.property('Text')
          expect(res.Text).to.contain('Average latency')
          expect(res.Time).to.be.a('number')
        })
    })
  })
})
