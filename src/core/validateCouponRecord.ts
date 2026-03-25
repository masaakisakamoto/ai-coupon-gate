import {
  CouponRecord,
  CouponValidationResult,
} from "./types";

type ValidateCouponRecordOptions = {
  now?: Date;
};

export function validateCouponRecord(
  coupon: CouponRecord | null,
  options: ValidateCouponRecordOptions = {}
): CouponValidationResult {
  const now = options.now ?? new Date();

  if (!coupon) {
    return { ok: false, reason: "invalid" };
  }

  if (!coupon.isActive) {
    return { ok: false, reason: "inactive" };
  }

  if (coupon.expiresAt && coupon.expiresAt.getTime() < now.getTime()) {
    return { ok: false, reason: "expired" };
  }

  if (coupon.usedCount >= coupon.maxUses) {
    return { ok: false, reason: "limit_reached" };
  }

  return { ok: true, coupon };
}
