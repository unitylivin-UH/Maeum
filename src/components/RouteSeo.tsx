import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MAEUM_SITE_ORIGIN } from "@/lib/site";

const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.trim().replace(/\/$/, "") || MAEUM_SITE_ORIGIN;

const ROUTES: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Maeum Skincare",
    description: "Maeum skincare and lipcare landing page.",
  },
  "/explainer": {
    title: "Maeum Skincare | Explainer",
    description: "Maeum skincare and lipcare explainer page.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Maeum Skincare",
    description: "Privacy Policy for Maeum skincare and lipcare.",
  },
  "/terms-of-use": {
    title: "Terms of Use | Maeum Skincare",
    description: "Terms of Use for Maeum skincare and lipcare.",
  },
};

function normalizePathname(pathname: string): string {
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

function setOrCreateMeta(name: string, attr: "name" | "property", value: string) {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

const RouteSeo = () => {
  const location = useLocation();
  const normalized = normalizePathname(location.pathname);
  const known = normalized in ROUTES;
  const meta = known
    ? ROUTES[normalized]
    : {
        title: "Page not found | Maeum Skincare",
        description: "The page you requested could not be found.",
      };

  useEffect(() => {
    document.title = meta.title;

    setOrCreateMeta("description", "name", meta.description);
    setOrCreateMeta("og:title", "property", meta.title);
    setOrCreateMeta("og:description", "property", meta.description);
    setOrCreateMeta("twitter:title", "name", meta.title);
    setOrCreateMeta("twitter:description", "name", meta.description);

    if (known) {
      const robots = document.querySelector('meta[name="robots"]');
      robots?.remove();
    } else {
      setOrCreateMeta("robots", "name", "noindex, nofollow");
    }

    const canonicalHref = `${SITE_URL}${location.pathname}${location.search}`;

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonicalHref;

    setOrCreateMeta("og:url", "property", canonicalHref);
  }, [known, location.pathname, location.search, meta.description, meta.title]);

  return null;
};

export default RouteSeo;
