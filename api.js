const fs = require('fs')
const { JsonDB } = require('node-json-db')

module.exports = {
  getHealth,
  putStudentProperty,
  getStudentProperty,
  deleteStudentProperty
}

async function getHealth (req, res, next) {
  res.json({ success: true })
}

async function putStudentProperty (req, res, next) {
  const { studentId, propertyName } = req.params
  const { body } = req
  const db = new JsonDB(`./data/${studentId}`, true, true, '/')
  db.push(`/${propertyName}`, body)
  return res.json({ success: true })
}

async function getStudentProperty (req, res, next) {
  const { studentId, propertyName } = req.params

  if (!fs.existsSync(`./data/${studentId}.json`)) {
    return res.status(404).json({ error: 'Not Found' })
  }

  const db = new JsonDB(`./data/${studentId}`, true, true, '/')

  try {
    const result = db.getData(`/${propertyName}`)
    return res.status(200).send({ result })
  } catch (_err) {
    return res.status(404).json({ error: 'Not Found' })
  }
}

async function deleteStudentProperty (req, res, next) {
  const { studentId, propertyName } = req.params

  if (!fs.existsSync(`./data/${studentId}.json`)) {
    return res.status(404).json({ error: 'Not Found' })
  }

  const db = new JsonDB(`./data/${studentId}`, true, true, '/')

  if (!db.exists(`/${propertyName}`)) {
    return res.status(404).json({ error: 'Not Found' })
  }

  db.delete(`/${propertyName}`)
  return res.json({ success: true })
}
