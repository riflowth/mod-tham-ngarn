declare namespace Express {
  export interface Request {
    session?: {
      sessionId: string,
      staffId: number,
      zoneId?: number,
      branchId?: number,
    }
  }
}
