"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Project, ProjectMapProps } from "@/types/prototype";

type LeafletNamespace = typeof import("leaflet");
type LeafletMarker = import("leaflet").Marker;
type LeafletMap = import("leaflet").Map;

type MarkerRecord = {
  marker: LeafletMarker;
  project: Project;
};

function getLeafletModule(mod: LeafletNamespace | { default: LeafletNamespace }) {
  return "default" in mod ? mod.default : mod;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getPinSize(zoom: number, mode: "mini" | "full") {
  const base = mode === "full" ? 42 : 36;

  if (zoom <= 3) return Math.round(base * 0.72);
  if (zoom === 4) return Math.round(base * 0.82);
  if (zoom === 5) return Math.round(base * 0.94);
  if (zoom === 6) return base;
  if (zoom === 7) return Math.round(base * 0.96);
  if (zoom === 8) return Math.round(base * 0.9);
  if (zoom === 9) return Math.round(base * 0.84);

  return Math.round(base * 0.78);
}

function getPinSvg({
  fill,
  stroke,
  innerFill,
  shadowOpacity,
}: {
  fill: string;
  stroke: string;
  innerFill: string;
  shadowOpacity: number;
}) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <defs>
        <filter id="pinShadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.2" flood-color="#000000" flood-opacity="${shadowOpacity}" />
        </filter>
      </defs>
      <g filter="url(#pinShadow)">
        <path
          d="M32 59.5c-1.6 0-3.1-.7-4.2-2C20.6 49.8 9.5 37.5 9.5 25.7 9.5 12.8 19.6 3 32 3s22.5 9.8 22.5 22.7c0 11.8-11.1 24.1-18.3 31.8-1.1 1.3-2.6 2-4.2 2Z"
          fill="${fill}"
          stroke="${stroke}"
          stroke-width="3.5"
          stroke-linejoin="round"
        />
        <circle cx="32" cy="24" r="11.75" fill="${innerFill}" stroke="${stroke}" stroke-width="3.5" />
      </g>
    </svg>
  `;
}

function buildMarkerIcon(
  L: LeafletNamespace,
  options: {
    active: boolean;
    size: number;
    highlighted: boolean;
  }
) {
  const fill = options.active ? "#2563eb" : "#ff1d1d";
  const stroke = options.active ? "#0f172a" : "#000000";
  const innerFill = "#ffffff";
  const shadowOpacity = options.highlighted || options.active ? 0.35 : 0.22;

  const svg = getPinSvg({ fill, stroke, innerFill, shadowOpacity });
  const iconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  const markerSize = options.size + (options.active ? 8 : options.highlighted ? 3 : 0);
  const width = clamp(markerSize, 20, 60);
  const height = Math.round(width * 1.18);

  return L.icon({
    iconUrl,
    iconRetinaUrl: iconUrl,
    iconSize: [width, height],
    iconAnchor: [Math.round(width / 2), height - 2],
    popupAnchor: [0, -height + 10],
    className: "bg-transparent border-0",
  });
}

export function ProjectMap({
  projects,
  highlightedIds,
  activeProjectId,
  onSelectProject,
  mode,
}: ProjectMapProps) {
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const LRef = useRef<LeafletNamespace | null>(null);
  const markersRef = useRef<Map<number, MarkerRecord>>(new Map());
  const lastBoundsSignatureRef = useRef<string>("");
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const projectsSignature = useMemo(
    () => projects.map((project) => `${project.id}:${project.lat}:${project.lng}`).join("|"),
    [projects]
  );

  useEffect(() => {
    let cancelled = false;
    let onWindowResize: (() => void) | null = null;
    let onZoomEnd: (() => void) | null = null;

    async function boot() {
      if (!mapElRef.current || mapRef.current || typeof window === "undefined") return;

      const leafletModule = await import("leaflet");
      if (cancelled || !mapElRef.current) return;

      const L = getLeafletModule(leafletModule);
      LRef.current = L;

      const map = L.map(mapElRef.current, {
        zoomControl: true,
        attributionControl: true,
        preferCanvas: false,
      });

      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        crossOrigin: true,
      }).addTo(map);

      map.setView([39.5, -98.35], mode === "mini" ? 3 : 4);

      const invalidate = () => {
        mapRef.current?.invalidateSize(false);
      };

      onWindowResize = () => invalidate();
      window.addEventListener("resize", onWindowResize);

      onZoomEnd = () => {
        redrawMarkerIcons();
      };
      map.on("zoomend", onZoomEnd);

      requestAnimationFrame(invalidate);
      setTimeout(invalidate, 120);
      setTimeout(invalidate, 320);

      if (typeof ResizeObserver !== "undefined") {
        resizeObserverRef.current = new ResizeObserver(() => invalidate());
        resizeObserverRef.current.observe(mapElRef.current);
      }

      setMapReady(true);
    }

    setMapReady(false);
    void boot();

    return () => {
      cancelled = true;
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;

      if (mapRef.current && onZoomEnd) {
        mapRef.current.off("zoomend", onZoomEnd);
      }

      if (onWindowResize) {
        window.removeEventListener("resize", onWindowResize);
      }

      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current.clear();
      mapRef.current?.remove();
      mapRef.current = null;
      LRef.current = null;
      lastBoundsSignatureRef.current = "";
      setMapReady(false);
    };
  }, [mode]);

  function redrawMarkerIcons() {
    const map = mapRef.current;
    const L = LRef.current;
    if (!map || !L) return;

    const zoom = map.getZoom();

    markersRef.current.forEach(({ marker, project }) => {
      const isActive = activeProjectId === project.id;
      const isHighlighted = highlightedIds.includes(project.id);
      marker.setIcon(
        buildMarkerIcon(L, {
          active: isActive,
          highlighted: isHighlighted,
          size: getPinSize(zoom, mode),
        })
      );
      marker.setZIndexOffset(isActive ? 1000 : isHighlighted ? 500 : 0);
    });
  }

  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!mapReady || !map || !L) return;

    const currentIds = new Set(projects.map((project) => project.id));

    markersRef.current.forEach(({ marker }, projectId) => {
      if (!currentIds.has(projectId)) {
        marker.remove();
        markersRef.current.delete(projectId);
      }
    });

    const zoom = map.getZoom();

    projects.forEach((project) => {
      const existing = markersRef.current.get(project.id);
      const isActive = activeProjectId === project.id;
      const isHighlighted = highlightedIds.includes(project.id);
      const icon = buildMarkerIcon(L, {
        active: isActive,
        highlighted: isHighlighted,
        size: getPinSize(zoom, mode),
      });

      if (existing) {
        existing.project = project;
        existing.marker.setLatLng([project.lat, project.lng]);
        existing.marker.setIcon(icon);
        existing.marker.setZIndexOffset(isActive ? 1000 : isHighlighted ? 500 : 0);
        return;
      }

      const marker = L.marker([project.lat, project.lng], {
        icon,
        keyboard: true,
        riseOnHover: true,
        title: project.title,
      });

      marker.on("click", () => {
        onSelectProject?.(project);
      });

      marker.addTo(map);
      marker.setZIndexOffset(isActive ? 1000 : isHighlighted ? 500 : 0);

      markersRef.current.set(project.id, {
        marker,
        project,
      });
    });

    const markerZoom = map.getZoom();
    markersRef.current.forEach(({ marker, project }) => {
      const isActive = activeProjectId === project.id;
      const isHighlighted = highlightedIds.includes(project.id);
      marker.setIcon(
        buildMarkerIcon(L, {
          active: isActive,
          highlighted: isHighlighted,
          size: getPinSize(markerZoom, mode),
        })
      );
      marker.setZIndexOffset(isActive ? 1000 : isHighlighted ? 500 : 0);
    });
  }, [mapReady, projects, highlightedIds, activeProjectId, onSelectProject, mode]);

  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!mapReady || !map || !L) return;

    if (projects.length === 0) {
      map.setView([39.5, -98.35], mode === "mini" ? 3 : 4);
      return;
    }

    const signature = `${mode}::${projectsSignature}`;
    if (lastBoundsSignatureRef.current === signature) return;
    lastBoundsSignatureRef.current = signature;

    const bounds = L.latLngBounds(projects.map((project) => [project.lat, project.lng] as [number, number]));

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: mode === "full" ? [60, 60] : [28, 28],
        maxZoom: mode === "mini" ? 6 : 7,
      });
    } else {
      map.setView([39.5, -98.35], mode === "mini" ? 3 : 4);
    }

    requestAnimationFrame(() => map.invalidateSize(false));
    setTimeout(() => map.invalidateSize(false), 100);
  }, [mapReady, projectsSignature, projects, mode]);

  return <div ref={mapElRef} className="h-full w-full rounded-3xl" />;
}
