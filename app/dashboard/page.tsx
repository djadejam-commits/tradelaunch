import { auth, currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import Link from "next/link";

interface Site {
  id: string;
  name: string;
  subdomain: string;
  createdAt: string;
  content?: {
    theme?: 'blue' | 'red' | 'green';
  };
}

const themeGradients = {
  blue: 'from-blue-600 to-blue-800',
  red: 'from-red-600 to-red-800',
  green: 'from-emerald-600 to-emerald-800',
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

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    return null;
  }

  const sites = await getUserSites(userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TradeLaunch
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm hidden sm:block">
              {user?.emailAddresses[0]?.emailAddress}
            </span>
            <SignOutButton>
              <button className="text-gray-500 hover:text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition">
                Sign out
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Sites</h1>
            <p className="text-gray-500 mt-1">Manage and edit your generated websites</p>
          </div>
          <Link
            href="/"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-500/25"
          >
            + Create New Site
          </Link>
        </div>

        {sites.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center bg-white/50">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sites yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Get started by creating your first AI-generated website in seconds.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
            >
              Create your first site
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sites.map((site) => {
              const theme = site.content?.theme || 'blue';
              const gradient = themeGradients[theme];
              return (
                <div
                  key={site.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200 group"
                >
                  {/* Theme Color Strip */}
                  <div className={`h-2 bg-gradient-to-r ${gradient}`} />

                  {/* Card Body */}
                  <div className="p-6">
                    <h2 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {site.name}
                    </h2>
                    <p className="text-gray-500 text-sm mb-4 font-mono">
                      {site.subdomain}.localhost:3000
                    </p>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <Link
                        href={`/editor/${site.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                      <a
                        href={`http://${site.subdomain}.localhost:3000`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
                      >
                        View Live
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>

                    <p className="text-gray-400 text-xs mt-4">
                      Created {new Date(site.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
