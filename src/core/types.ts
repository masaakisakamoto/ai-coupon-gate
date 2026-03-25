export type CouponRecord = {
  id?: string;
  code: string;
  isActive: boolean;
  maxUses: number;
  usedCount: number;
  expiresAt?: Date | null;
};

export type CouponValidationFailureReason =
  | "invalid"
  | "inactive"
  | "expired"
  | "limit_reached";

export type CouponValidationSuccess = {
  ok: true;
  coupon: CouponRecord;
};

export type CouponValidationFailure = {
  ok: false;
  reason: CouponValidationFailureReason;
};

export type CouponValidationResult =
  | CouponValidationSuccess
  | CouponValidationFailure;
  