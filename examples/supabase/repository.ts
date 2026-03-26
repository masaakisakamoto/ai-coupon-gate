import { createClient } from "@supabase/supabase-js";
import { CouponRepository } from "../../src/core/couponRepository";
import { CouponRecord } from "../../src/core/types";

type SupabaseCouponRow = {
  id: string;
  code: string;
  is_active: boolean;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
};

type CreateSupabaseCouponRepositoryOptions = {
  url: string;
  serviceRoleKey: string;
  tableName?: string;
};

function mapRowToCouponRecord(row: SupabaseCouponRow): CouponRecord {
  return {
    id: row.id,
    code: row.code,
    isActive: row.is_active,
    maxUses: row.max_uses,
    usedCount: row.used_count,
    expiresAt: row.expires_at ? new Date(row.expires_at) : null,
  };
}

export function createSupabaseCouponRepository(
  options: CreateSupabaseCouponRepositoryOptions
): CouponRepository {
  const tableName = options.tableName ?? "coupons";

  const supabase = createClient(options.url, options.serviceRoleKey);

  return {
    async getCouponByCode(code: string): Promise<CouponRecord | null> {
      const { data, error } = await supabase
        .from(tableName)
        .select("id, code, is_active, max_uses, used_count, expires_at")
        .eq("code", code)
        .single();

      if (error || !data) {
        return null;
      }

      return mapRowToCouponRecord(data as SupabaseCouponRow);
    },
  };
}
