import mongoose from "mongoose"
import moment from "moment"

import { RateLimiterMongo } from "rate-limiter-flexible"
import { Request, Response, NextFunction } from "express"

moment.locale("fr")

export class MongoBruteForcePrevent {
  async prevent(req: Request, res: Response, next: NextFunction) {
    try {
      const dbName = "security"
      const uri = `mongodb://127.0.0.1:27017/${dbName}`

      const mongooseInstance = mongoose.createConnection(uri)

      const opts = {
        storeClient: mongooseInstance,
        points: 3, // Number of points
        duration: 60, // Per second(s)
      }
      const key: string = `${req.ip}`

      const rateLimiterMongo = new RateLimiterMongo(opts)
      rateLimiterMongo
        .consume(key)
        .then(handleSucess(mongooseInstance))
        .catch((rateLimiterRes) => {
          const newBlockLifetimeSecs =
            Math.round(rateLimiterRes.msBeforeNext / 1000) + 30

          const callback = () => handleErreor(mongooseInstance, rateLimiterRes)

          rateLimiterMongo
            .block(key, newBlockLifetimeSecs)
            .then(callback)
            .catch(callback)
        })
    } catch (error) {
      next()
    }

    function handleSucess(mongooseInstance: mongoose.Connection) {
      return () => {
        mongooseInstance.close()
        next()
      }
    }

    function handleErreor(
      mongooseInstance: mongoose.Connection,
      rateLimiterRes: any,
    ) {
      mongooseInstance.close()
      const date = new Date()
      date.setMilliseconds(rateLimiterRes.msBeforeNext)
      const dateFormat = moment(date).fromNow()
      const message = `Vous avez fait trop de tentatives infructueuses en peu de temps, veuillez réessayer ${dateFormat}`
      res
        .status(429)
        .json({ statusCode: 429, success: false, message: message })
    }
  }
}
