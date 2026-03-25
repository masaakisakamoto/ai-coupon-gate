import { validateCoupon } from "../../src/core/validateCoupon";
import { CouponRepository } from "../../src/core/couponRepository";
import { CouponRecord } from "../../src/core/types";

const coupons: Record<string, CouponRecord> = {
  "VIP-ONLY": {
    code: "VIP-ONLY",
    isActive: true,
    maxUses: 10,
    usedCount: 2,
    expiresAt: new Date("2030-01-01"),
  },
  "OLD-ONE": {
    code: "OLD-ONE",
    isActive: true,
    maxUses: 10,
    usedCount: 1,
    expiresAt: new Date("2020-01-01"),
  },
  "USED-UP": {
    code: "USED-UP",
    isActive: true,
    maxUses: 3,
    usedCount: 3,
    expiresAt: new Date("2030-01-01"),
  },
  "OFF-ONE": {
    code: "OFF-ONE",
    isActive: false,
    maxUses: 10,
    usedCount: 0,
    expiresAt: new Date("2030-01-01"),
  },
};

const repository: CouponRepository = {
  async getCouponByCode(code: string) {
    return coupons[code] ?? null;
  },
};

async function run() {
  const codes = ["VIP-ONLY", "OLD-ONE", "USED-UP", "OFF-ONE", "NOT-FOUND"];

  for (const code of codes) {
    const result = await validateCoupon(code, repository, {
      now: new Date("2025-01-01"),
    });

    console.log(code, "=>", result);
  }
}

run();
