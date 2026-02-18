import Link from "next/link";

import { BillingPanel } from "@/features/account/billing-panel";

export default function AccountBillingPage() {
  return (
    <section className="page">
      <div className="button-row">
        <Link className="button" href="/account">
          Back to dashboard
        </Link>
      </div>
      <BillingPanel />
    </section>
  );
}
