const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

const testData = { score: 98 }

tape('health', async function (t) {
  const url = `${endpoint}/health`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful healthcheck')
    t.end()
  })
})

tape('put student\'s property', async function (t) {
  const uri = `${endpoint}/test/courses/calculus/quizzes/ye0ab61`
  jsonist.put(uri, testData, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should be successed')
    t.end()
  })
})

tape('get student\'s property', async function (t) {
  t.plan(3)
  let uri = `${endpoint}/test/courses/calculus/quizzes/ye0ab61/score`
  jsonist.get(uri, (err, body) => {
    if (err) t.error(err)
    t.ok(body.result === 98, 'should be successed')
  })

  uri = `${endpoint}/wrongtest/courses/calculus/quizzes/ye0ab61`
  jsonist.get(uri, (err, body, res) => {
    if (err) t.error(err)
    if (!body.error) t.error(new Error('should be failed but succesed'))
    t.ok(res.statusCode === 404, 'should be failed for student not exist')
  })

  uri = `${endpoint}/test/courses/calculus/quizzes/wrongproperty`
  jsonist.get(uri, (err, body, res) => {
    if (err) t.error(err)
    if (!body.error) t.error(new Error('should be failed but succesed'))
    t.ok(res.statusCode === 404, 'should be failed for property not exist')
  })
})

tape('delete student\'s property', async function (t) {
  t.plan(3)
  let uri = `${endpoint}/test/courses/calculus/quizzes/ye0ab61`
  jsonist.delete(uri, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should be successed')
  })

  uri = `${endpoint}/wrongtest/courses/calculus/quizzes`
  jsonist.delete(uri, (err, body, res) => {
    if (err) t.error(err)
    if (!body.error) t.error(new Error('should be failed but succesed'))
    t.ok(res.statusCode === 404, 'should be failed for student not exist')
  })

  uri = `${endpoint}/test/courses/calculus/wrongproperty`
  jsonist.delete(uri, (err, body, res) => {
    if (err) t.error(err)
    if (!body.error) t.error(new Error('should be failed but succesed'))
    t.ok(res.statusCode === 404, 'should be failed for property not exist')
  })
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})
