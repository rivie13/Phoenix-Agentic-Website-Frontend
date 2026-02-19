import Link from "next/link";

import { AccountDashboard } from "@/features/account/account-dashboard";

export default function AccountPage() {
  return (
    <section className="page">
      <div className="button-row">
        <Link className="button" href="/account/billing">
          Billing
        </Link>
        <Link className="button" href="/account/orchestration">
          Orchestration
        </Link>
        <Link className="button" href="/account/settings">
          Settings
        </Link>
      </div>
      <AccountDashboard />
    </section>
  );
}
