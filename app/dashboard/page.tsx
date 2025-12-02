import { auth, currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiteLink } from "@/components/SiteLink";

interface Site {
  id: string;
  name: string;
  subdomain: string;
  createdAt: string;
  trade?: string;
  city?: string;
  content?: {
    theme?: 'blue' | 'red' | 'green';
  };
}

const themeColors = {
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  green: 'bg-emerald-500',
} as const;

async function getUserSites(userId: string): Promise<Site[]> {
  const sitesRef = collection(db, "sites");
  const q = query(
    sitesRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Site[];
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    return null;
  }

  const sites = await getUserSites(userId);
  const activeSites = sites.filter(s => s.content); // Sites with generated content
  const totalSites = sites.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">

      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800 bg-slate-900/50 backdrop-blur-lg sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold gradient-text">
            QuickProSite
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm hidden sm:block">
              {user?.emailAddresses[0]?.emailAddress}
            </span>
            <SignOutButton>
              <button className="text-slate-400 hover:text-slate-200 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-slate-800/50 transition">
                Sign out
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 tracking-tight mb-2">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
          </h1>
          <p className="text-slate-400 text-lg">
            Manage your AI-generated websites
          </p>
        </div>

        {sites.length === 0 ? (
          // Empty State
          <Card variant="glass" padding="lg" className="text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mb-3">No sites yet</h3>
            <p className="text-slate-400 mb-8 text-lg max-w-md mx-auto">
              Create your first AI-powered website in under 30 seconds.
            </p>
            <Link href="/">
              <Button variant="primary" size="lg" icon={<span>✨</span>}>
                Create Your First Site
              </Button>
            </Link>
          </Card>
        ) : (
          // Bento Grid Layout
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-auto">

            {/* Stats Cards */}
            <Card variant="glass" hover padding="lg" className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="font-medium">Total Sites</span>
                </div>
                <p className="text-5xl font-bold gradient-text">{totalSites}</p>
              </div>
              <p className="text-sm text-slate-500 mt-4">All time</p>
            </Card>

            <Card variant="glass" hover padding="lg" className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Active</span>
                </div>
                <p className="text-5xl font-bold text-green-400">{activeSites.length}</p>
              </div>
              <p className="text-sm text-slate-500 mt-4">Live sites</p>
            </Card>

            {/* Quick Action Card */}
            <Card variant="elevated" hover glow padding="lg" className="md:col-span-1 flex flex-col justify-center">
              <h3 className="text-lg font-bold text-slate-100 mb-4">Quick Actions</h3>
              <Link href="/">
                <Button variant="primary" size="md" fullWidth icon={<span>✨</span>}>
                  New Site
                </Button>
              </Link>
            </Card>

            {/* Recent Sites - Large Card */}
            <Card variant="glass" hover className="md:col-span-3 lg:col-span-4 md:row-span-2" padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-100">Your Sites</h2>
                <Link href="/">
                  <Button variant="ghost" size="sm" icon={<span>+</span>}>
                    New Site
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sites.map((site) => {
                  const theme = site.content?.theme || 'blue';
                  const themeColor = themeColors[theme];

                  return (
                    <Card
                      key={site.id}
                      variant="elevated"
                      hover
                      padding="none"
                      className="overflow-hidden group"
                    >
                      {/* Theme Color Strip */}
                      <div className={`h-1.5 ${themeColor}`} />

                      {/* Card Body */}
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-slate-100 mb-1 truncate group-hover:text-cyan-400 transition-colors">
                              {site.name}
                            </h3>
                            {site.trade && site.city && (
                              <p className="text-slate-500 text-sm mb-2">
                                {site.trade} • {site.city}
                              </p>
                            )}
                            <p className="text-slate-600 text-xs font-mono truncate">
                              {site.subdomain}.quickprosite.com
                            </p>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${site.content ? 'bg-green-500' : 'bg-slate-600'} flex-shrink-0 mt-2`}
                               title={site.content ? 'Live' : 'Draft'}
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
                          <Link
                            href={`/editor/${site.id}`}
                            className="flex-1"
                          >
                            <Button variant="secondary" size="sm" fullWidth>
                              Edit
                            </Button>
                          </Link>
                          <SiteLink subdomain={site.subdomain} />
                        </div>

                        {/* Timestamp */}
                        <p className="text-slate-600 text-xs mt-3">
                          {formatTimeAgo(site.createdAt)}
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>

          </div>
        )}
      </main>

      {/* Floating Action Button (Mobile) */}
      <Link href="/" className="md:hidden fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full shadow-lg shadow-purple-500/50 flex items-center justify-center text-white text-2xl hover:scale-110 active:scale-95 transition-all">
          +
        </button>
      </Link>
    </div>
  );
}
