import Link from "next/link";

import { OrchestrationPanel } from "@/features/account/orchestration-panel";

export default function AccountOrchestrationPage() {
  return (
    <section className="page">
      <div className="button-row">
        <Link className="button" href="/account">
          Back to dashboard
        </Link>
      </div>
      <OrchestrationPanel />
    </section>
  );
}
