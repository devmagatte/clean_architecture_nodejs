import session from "express-session"

export const configSession = session({
  secret: "?7r+hu3HeHYh*{ZC@A%Cl&JT1;&RU=",
  resave: false,
  saveUninitialized: true,
})
