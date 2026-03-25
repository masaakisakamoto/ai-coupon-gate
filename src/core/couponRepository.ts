import { CouponRecord } from "./types";

export interface CouponRepository {
  getCouponByCode(code: string): Promise<CouponRecord | null>;
}
