import { CouponRepository } from "./couponRepository";
import { CouponValidationResult } from "./types";
import { validateCouponRecord } from "./validateCouponRecord";

type ValidateCouponOptions = {
  now?: Date;
  normalizeCode?: (code: string) => string;
};

const defaultNormalizeCode = (code: string) => code.trim().toUpperCase();

export async function validateCoupon(
  code: string,
  repository: CouponRepository,
  options: ValidateCouponOptions = {}
): Promise<CouponValidationResult> {
  const normalizeCode = options.normalizeCode ?? defaultNormalizeCode;
  const normalizedCode = normalizeCode(code);

  if (!normalizedCode) {
    return { ok: false, reason: "invalid" };
  }

  const coupon = await repository.getCouponByCode(normalizedCode);

  return validateCouponRecord(coupon, {
    now: options.now,
  });
}
