export const REFRESH_TOKEN_CONFIG = {
  expiresIn: "7d",
}
export const ACCESS_TOKEN_CONFIG = {
  expiresIn: "15m",
}
export const COOKIE_CONFIG = {
  httpOnly : true,
  secure: process.env?.ENVIRONMENT==="production" ? true : false,
  sameSite: "strict",
}

export const CORS_OPTIONS = {
  origin: "http://localhost:5173",
  credentials: true,
  maxAge: "7d",
}