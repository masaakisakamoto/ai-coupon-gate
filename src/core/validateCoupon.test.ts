import { describe, it, expect } from "vitest";
import { validateCoupon } from "./validateCoupon";
import { CouponRepository } from "./couponRepository";
import { CouponRecord } from "./types";

describe("validateCoupon", () => {
  it("returns invalid when normalized code is empty", async () => {
    const repository: CouponRepository = {
      async getCouponByCode() {
        return null;
      },
    };

    const result = await validateCoupon("   ", repository);

    expect(result).toEqual({ ok: false, reason: "invalid" });
  });

  it("normalizes code before calling repository", async () => {
    let receivedCode: string | null = null;

    const repository: CouponRepository = {
      async getCouponByCode(code: string) {
        receivedCode = code;
        return null;
      },
    };

    await validateCoupon("  vip-only  ", repository);

    expect(receivedCode).toBe("VIP-ONLY");
  });

  it("returns invalid when repository returns null", async () => {
    const repository: CouponRepository = {
      async getCouponByCode() {
        return null;
      },
    };

    const result = await validateCoupon("NOT-FOUND", repository);

    expect(result).toEqual({ ok: false, reason: "invalid" });
  });

  it("returns ok when repository returns a valid coupon", async () => {
    const coupon: CouponRecord = {
      code: "VIP-ONLY",
      isActive: true,
      maxUses: 10,
      usedCount: 1,
      expiresAt: new Date("2030-01-01"),
    };

    const repository: CouponRepository = {
      async getCouponByCode() {
        return coupon;
      },
    };

    const result = await validateCoupon("vip-only", repository, {
      now: new Date("2025-01-01"),
    });

    expect(result).toEqual({
      ok: true,
      coupon,
    });
  });

  it("returns expired when repository returns an expired coupon", async () => {
    const coupon: CouponRecord = {
      code: "OLD-ONE",
      isActive: true,
      maxUses: 10,
      usedCount: 1,
      expiresAt: new Date("2020-01-01"),
    };

    const repository: CouponRepository = {
      async getCouponByCode() {
        return coupon;
      },
    };

    const result = await validateCoupon("old-one", repository, {
      now: new Date("2025-01-01"),
    });

    expect(result).toEqual({ ok: false, reason: "expired" });
  });

  it("supports custom normalizeCode", async () => {
    let receivedCode: string | null = null;

    const repository: CouponRepository = {
      async getCouponByCode(code: string) {
        receivedCode = code;
        return null;
      },
    };

    await validateCoupon("MiA-ViP", repository, {
      normalizeCode: (code) => code.trim().toLowerCase(),
    });

    expect(receivedCode).toBe("mia-vip");
  });
});
