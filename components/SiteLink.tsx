"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";

interface SiteLinkProps {
  subdomain: string;
}

export function SiteLink({ subdomain }: SiteLinkProps) {
  // Start with production URL (same on server and client for SSR)
  const [siteUrl, setSiteUrl] = useState(`https://${subdomain}.quickprosite.com`);

  // Update to localhost URL after mount (client-side only)
  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost' ||
                       window.location.hostname.startsWith('127.0.0.1');

    if (isLocalhost) {
      setSiteUrl(`/site/${subdomain}`);
    }
  }, [subdomain]);

  return (
    <a
      href={siteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1"
    >
      <Button variant="ghost" size="sm" fullWidth>
        View
      </Button>
    </a>
  );
}
