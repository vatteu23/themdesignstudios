import Link from "next/link";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { runSeoAudit, AuditIssue } from "@/lib/seo/audit";
import { getSiteUrl } from "@/lib/seo/config";
import { getSiteSettingsServer } from "@/lib/seo/firebase-server";

function SeverityBadge({ severity }: { severity: AuditIssue["severity"] }) {
  const styles = {
    error: "bg-red-100 text-red-800",
    warning: "bg-amber-100 text-amber-800",
    info: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${styles[severity]}`}
    >
      {severity}
    </span>
  );
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

export default async function SeoAuditPage() {
  const [audit, settings] = await Promise.all([
    runSeoAudit(),
    getSiteSettingsServer(),
  ]);
  const siteUrl = getSiteUrl(settings);

  const grouped = audit.issues.reduce<Record<string, AuditIssue[]>>(
    (acc, issue) => {
      const key = issue.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(issue);
      return acc;
    },
    {}
  );

  return (
    <>
      <AdminTopBar title="SEO Audit" />
      <div className="space-y-6 p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">SEO Score</p>
            <p className={`mt-1 text-3xl font-semibold ${scoreColor(audit.score)}`}>
              {audit.score}/100
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Errors</p>
            <p className="mt-1 text-3xl font-semibold text-red-600">
              {audit.summary.errors}
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Warnings</p>
            <p className="mt-1 text-3xl font-semibold text-amber-600">
              {audit.summary.warnings}
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Sitemap URLs</p>
            <p className="mt-1 text-3xl font-semibold text-stone-800">
              {audit.summary.pagesInSitemap}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-stone-800">Quick links</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link
              href="/them-admin/site-settings"
              className="text-stone-600 underline hover:text-stone-900"
            >
              Edit page SEO & site URL
            </Link>
            <a
              href={`${siteUrl}/sitemap.xml`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-600 underline hover:text-stone-900"
            >
              View sitemap.xml
            </a>
            <a
              href={`${siteUrl}/robots.txt`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-600 underline hover:text-stone-900"
            >
              View robots.txt
            </a>
          </div>
          <p className="mt-2 text-xs text-stone-500">
            Last checked: {new Date(audit.checkedAt).toLocaleString()}
          </p>
        </div>

        {Object.entries(grouped).map(([category, issues]) => (
          <div
            key={category}
            className="rounded-xl border border-stone-200 bg-white"
          >
            <div className="border-b border-stone-100 px-5 py-3">
              <h2 className="font-medium text-stone-800">{category}</h2>
            </div>
            <ul className="divide-y divide-stone-100">
              {issues.map((issue) => (
                <li key={issue.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <SeverityBadge severity={issue.severity} />
                    <span className="text-sm text-stone-800">{issue.message}</span>
                  </div>
                  {issue.fix && (
                    <p className="mt-1 text-xs text-stone-500">{issue.fix}</p>
                  )}
                  {issue.path && (
                    <p className="mt-1 font-mono text-xs text-stone-400">
                      {issue.path}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
