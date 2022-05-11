declare namespace Express {
  export interface Request {
    session?: {
      sessionId: string,
      staffId: number,
      role?: string,
      zoneId?: number,
      branchId?: number,
    }
  }
}
