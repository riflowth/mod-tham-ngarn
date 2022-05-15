declare namespace Express {
  export interface Request {
    session?: {
      sessionId: string,
      staffId: number,
      name: string,
      role?: string,
      zoneId?: number,
      branchId?: number,
    }
  }
}
