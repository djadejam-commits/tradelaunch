"use client";

import { useUser } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SiteContent {
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
  };
  services: Array<{
    title: string;
    desc: string;
  }>;
  about: {
    heading: string;
    body: string;
  };
  theme: "blue" | "red" | "green";
}

interface SiteData {
  name: string;
  subdomain: string;
  content: SiteContent;
  userId: string | null;
}

const themeColors = {
  blue: "bg-blue-600",
  red: "bg-red-600",
  green: "bg-green-600",
} as const;

interface PageProps {
  params: Promise<{ siteId: string }>;
}

export default function EditorPage({ params }: PageProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [siteId, setSiteId] = useState<string | null>(null);
  const [site, setSite] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Form state
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [cta, setCta] = useState("");
  const [services, setServices] = useState<Array<{ title: string; desc: string }>>([]);
  const [aboutHeading, setAboutHeading] = useState("");
  const [aboutBody, setAboutBody] = useState("");
  const [theme, setTheme] = useState<"blue" | "red" | "green">("blue");

  // Unwrap params
  useEffect(() => {
    params.then((p) => setSiteId(p.siteId));
  }, [params]);

  // Redirect if not logged in
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  // Real-time Firestore listener
  useEffect(() => {
    if (!siteId || !user) return;

    const unsubscribe = onSnapshot(
      doc(db, "sites", siteId),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as SiteData;

          // Check ownership
          if (data.userId !== user.id) {
            setUnauthorized(true);
            setLoading(false);
            return;
          }

          setSite(data);

          // Initialize form with existing data ONLY on first load
          if (data.content && !initialized) {
            setHeadline(data.content.hero.headline);
            setSubheadline(data.content.hero.subheadline);
            setCta(data.content.hero.cta);
            setServices([...data.content.services]);
            setAboutHeading(data.content.about.heading);
            setAboutBody(data.content.about.body);
            setTheme(data.content.theme);
            setInitialized(true);
          }
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching site:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [siteId, user, initialized]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!siteId) {
      console.error("No siteId available");
      return;
    }

    console.log("Saving to document:", siteId);
    setSaving(true);
    try {
      const docRef = doc(db, "sites", siteId);
      await updateDoc(docRef, {
        content: {
          hero: { headline, subheadline, cta },
          services,
          about: { heading: aboutHeading, body: aboutBody },
          theme,
        },
      });
      console.log("Successfully updated document:", siteId);
      showToast("Saved!");
    } catch (error) {
      console.error("Error saving to document:", siteId, error);
      showToast("Error saving changes");
    }
    setSaving(false);
  };

  const updateService = (index: number, field: "title" | "desc", value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized</h1>
        <p className="text-gray-600 mb-4">You don&apos;t have permission to edit this site.</p>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Site Not Found</h1>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const bgColor = themeColors[theme];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          {toast}
        </div>
      )}

      {/* Top Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
              ← Back
            </Link>
            <span className="text-lg font-semibold text-gray-800">
              Editing: {site.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`http://${site.subdomain}.localhost:3000`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              View Live Site →
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar - Editor Form */}
        <aside className="w-96 bg-white shadow-lg h-[calc(100vh-57px)] overflow-y-auto p-6">
          <h2 className="text-lg font-semibold mb-6 text-gray-800">Edit Content</h2>

          {/* Hero Section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Hero Section
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subheadline
                </label>
                <textarea
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Services
            </h3>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service {index + 1} Title
                  </label>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => updateService(index, "title", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={service.desc}
                    onChange={(e) => updateService(index, "desc", e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* About Section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              About Section
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heading
                </label>
                <input
                  type="text"
                  value={aboutHeading}
                  onChange={(e) => setAboutHeading(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Body
                </label>
                <textarea
                  value={aboutBody}
                  onChange={(e) => setAboutBody(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Theme Color
            </h3>
            <div className="flex gap-3">
              {(["blue", "red", "green"] as const).map((color) => (
                <button
                  key={color}
                  onClick={() => setTheme(color)}
                  className={`w-10 h-10 rounded-full ${themeColors[color]} ${
                    theme === color ? "ring-4 ring-offset-2 ring-gray-400" : ""
                  }`}
                  title={color}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Right Side - Live Preview */}
        <main className="flex-1 h-[calc(100vh-57px)] overflow-y-auto">
          <div className="bg-white m-4 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-200 px-4 py-2 text-sm text-gray-500">
              Live Preview
            </div>

            {/* Preview Content */}
            <div className="min-h-[600px]">
              {/* Hero Section */}
              <section className={`${bgColor} text-white py-16 px-4`}>
                <div className="max-w-4xl mx-auto text-center">
                  <h1 className="text-4xl font-bold mb-4">{headline || "Your Headline"}</h1>
                  <p className="text-lg mb-6 opacity-90">{subheadline || "Your subheadline"}</p>
                  <button className="bg-white text-gray-900 font-semibold px-6 py-2 rounded-lg">
                    {cta || "Call to Action"}
                  </button>
                </div>
              </section>

              {/* Services Section */}
              <section className="py-12 px-4">
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
                    Our Services
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 shadow-sm"
                      >
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">
                          {service.title || `Service ${index + 1}`}
                        </h3>
                        <p className="text-gray-600 text-sm">{service.desc || "Description"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* About Section */}
              <section className="bg-gray-100 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    {aboutHeading || "About Us"}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {aboutBody || "Your about section content"}
                  </p>
                </div>
              </section>

              {/* Footer */}
              <footer className={`${bgColor} text-white py-6 px-4`}>
                <div className="max-w-4xl mx-auto text-center">
                  <p className="opacity-90 text-sm">
                    © {new Date().getFullYear()} {site.name}. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
