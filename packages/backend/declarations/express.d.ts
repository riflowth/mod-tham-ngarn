declare namespace Express {
  export interface Request {
    session?: {
      sessionId: string,
      staffId: number,
    }
  }
}
