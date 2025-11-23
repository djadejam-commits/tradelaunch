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
}

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            TradeLaunch
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {user?.emailAddresses[0]?.emailAddress}
            </span>
            <SignOutButton>
              <button className="text-gray-500 hover:text-gray-700">
                Sign out
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your Sites</h1>
          <Link
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create New Site
          </Link>
        </div>

        {sites.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">
              You haven&apos;t created any sites yet.
            </p>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first site →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sites.map((site) => (
              <div
                key={site.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
              >
                <h2 className="font-semibold text-lg text-gray-900 mb-2">
                  {site.name}
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  {site.subdomain}.localhost:3000
                </p>
                <div className="flex gap-4">
                  <Link
                    href={`/editor/${site.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <a
                    href={`http://${site.subdomain}.localhost:3000`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                  >
                    View →
                  </a>
                </div>
                <p className="text-gray-400 text-xs mt-4">
                  Created {new Date(site.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
