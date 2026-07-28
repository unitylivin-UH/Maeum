import { Link, useLocation } from "react-router-dom";

const VersionToggle = () => {
  const { pathname } = useLocation();
  const isV2 = pathname === "/version-2" || pathname.startsWith("/version-2/");

  return (
    <div className="absolute right-4 top-4 z-20 md:right-6 md:top-6">
      <div
        className="inline-flex items-center rounded-full border border-white/40 bg-black/25 p-0.5 backdrop-blur-sm"
        role="group"
        aria-label="Page version"
      >
        <Link
          to="/"
          className={`font-myungjo uppercase tracking-[0.08em] rounded-full px-2.5 py-1.5 text-[11px] md:px-3.5 md:py-1.5 md:text-[13px] transition-colors ${
            !isV2 ? "bg-white text-black" : "text-white/80 hover:text-white"
          }`}
          aria-current={!isV2 ? "page" : undefined}
        >
          <span className="md:hidden">v1</span>
          <span className="hidden md:inline">Version 1</span>
        </Link>
        <Link
          to="/version-2"
          className={`font-myungjo uppercase tracking-[0.08em] rounded-full px-2.5 py-1.5 text-[11px] md:px-3.5 md:py-1.5 md:text-[13px] transition-colors ${
            isV2 ? "bg-white text-black" : "text-white/80 hover:text-white"
          }`}
          aria-current={isV2 ? "page" : undefined}
        >
          <span className="md:hidden">v2</span>
          <span className="hidden md:inline">Version 2</span>
        </Link>
      </div>
    </div>
  );
};

export default VersionToggle;
