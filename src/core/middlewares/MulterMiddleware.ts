import Multer from "multer"
import { urlTmpMedia } from "../constant/UrlMedia"

export const multerArray = (fileName = "medias") =>
  Multer({
    storage: Multer.diskStorage({
      destination: urlTmpMedia,
      filename: (req, file, callback) => {
        const originalname = file.originalname
        const extension = originalname.split(".").pop()
        const uniqueSuffix = Date.now()
        callback(null, uniqueSuffix + "." + extension)
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024 * 1024,
    },
  }).array(fileName)
