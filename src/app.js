const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const { accessibleRecordsPlugin } = require('@casl/mongoose')
const errorHandler = require('./error-handler')
const MODULES = ['auth', 'comments', 'posts', 'users']

module.exports = function createApp() {
  const app = express()
  const router = express.Router()

  mongoose.plugin(accessibleRecordsPlugin)
  app.use(bodyParser.json())

  MODULES.forEach(moduleName => {
    const module = require(`./modules/${moduleName}`)

    if (typeof module.configure === 'function') {
      module.configure(app)
    }
  })

  app.use(errorHandler)

  mongoose.Promise = global.Promise
  // return mongoose.connect('mongodb://localhost:27017/blog')
  // mongoose.connect('mongodb://username:password@host:port/database?options...');
  // return mongoose.connect('mongodb://siteRootAdmin:passw0rd@192.168.29.156:27017/blog')
  // return mongoose.connect('mongodb://siteUserAdmin:passw0rd@192.168.29.156:27017/blog')
  return mongoose.connect("mongodb://blog:blog@192.168.29.156:27017/blog", { useMongoClient: true, /* other options */ })
    .then(() => app)
}

/*
db.createUser( { user: "blog",
                         pwd: "blog",
                         customData: { employeeId: 12345 },
                         roles: [ { role: "clusterAdmin", db: "admin" },
                                  { role: "readAnyDatabase", db: "admin" },
                                  "readWrite"] },
  { w: "majority" , wtimeout: 5000 } )
 */