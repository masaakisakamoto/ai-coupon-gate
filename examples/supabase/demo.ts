import "dotenv/config";
import { validateCoupon } from "../../src/core/validateCoupon";
import { createSupabaseCouponRepository } from "./repository";

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.error(
      "Missing env: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required."
    );
    process.exit(1);
  }

  const repository = createSupabaseCouponRepository({
    url,
    serviceRoleKey,
  });

  const code = process.argv[2] ?? "MIA-VIP";

  const result = await validateCoupon(code, repository);

  console.log(`validateCoupon("${code}") =>`);
  console.dir(result, { depth: null });
}

run();
