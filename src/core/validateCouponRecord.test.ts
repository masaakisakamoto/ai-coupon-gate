import { describe, it, expect } from "vitest";
import { validateCouponRecord } from "./validateCouponRecord";
import { CouponRecord } from "./types";

const baseCoupon: CouponRecord = {
  code: "TEST",
  isActive: true,
  maxUses: 5,
  usedCount: 0,
  expiresAt: null,
};

describe("validateCouponRecord", () => {
  it("returns invalid when coupon is null", () => {
    const result = validateCouponRecord(null);
    expect(result).toEqual({ ok: false, reason: "invalid" });
  });

  it("returns inactive when coupon is not active", () => {
    const coupon = { ...baseCoupon, isActive: false };
    const result = validateCouponRecord(coupon);
    expect(result).toEqual({ ok: false, reason: "inactive" });
  });

  it("returns expired when expiresAt is in the past", () => {
    const coupon = {
      ...baseCoupon,
      expiresAt: new Date("2020-01-01"),
    };

    const result = validateCouponRecord(coupon, {
      now: new Date("2025-01-01"),
    });

    expect(result).toEqual({ ok: false, reason: "expired" });
  });

  it("returns limit_reached when usedCount >= maxUses", () => {
    const coupon = {
      ...baseCoupon,
      usedCount: 5,
      maxUses: 5,
    };

    const result = validateCouponRecord(coupon);
    expect(result).toEqual({ ok: false, reason: "limit_reached" });
  });

  it("returns ok when coupon is valid", () => {
    const coupon = {
      ...baseCoupon,
      usedCount: 1,
      maxUses: 5,
      expiresAt: new Date("2030-01-01"),
    };

    const result = validateCouponRecord(coupon, {
      now: new Date("2025-01-01"),
    });

    expect(result).toEqual({
      ok: true,
      coupon,
    });
  });
});
