import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Location.css";

/* ─────────────────────────────────────────
   ⚠️  PASTE YOUR GOOGLE MAPS API KEY HERE
   ───────────────────────────────────────── */
const GOOGLE_MAPS_API_KEY = "AIzaSyAmqqeyLn9MRdkQjL69V35Up3uZFZecPrM";

/* ── Mock vehicle fleet ── */
const INITIAL_VEHICLES = [
  {
    id: "BUS-01",
    label: "UP15CK3020",
    type: "bus",
    driver: "Ramesh Kumar",
    phone: "+91 98765 43210",
    route: "Route A — Sector 14 → School",
    stops: ["Sector 14", "MG Road", "Civil Lines", "School Gate"],
    capacity: 52,
    students: 44,
    status: "on-route",
    speed: 38,
    fuel: 72,
    eta: "8 min",
    color: "#4F7CFF",
    lat: 28.6139,
    lng: 77.209,
  },
  {
    id: "BUS-02",
    label: "UP86AK8154",
    type: "bus",
    driver: "Suresh Yadav",
    phone: "+91 98765 11223",
    route: "Route B — Vaishali → School",
    stops: ["Vaishali Sec-4", "Kaushambi", "Anand Vihar", "School Gate"],
    capacity: 52,
    students: 38,
    status: "on-route",
    speed: 32,
    fuel: 55,
    eta: "14 min",
    color: "#F97316",
    lat: 28.638,
    lng: 77.3375,
  },
  {
    id: "VAN-01",
    label: "UP81BB1554",
    type: "van",
    driver: "Ajay Singh",
    phone: "+91 87654 32109",
    route: "Route C — Indirapuram → School",
    stops: ["Indirapuram", "Vasundhara", "Crossing Republik", "School Gate"],
    capacity: 12,
    students: 9,
    status: "on-route",
    speed: 45,
    fuel: 88,
    eta: "6 min",
    color: "#22C55E",
    lat: 28.658,
    lng: 77.365,
  },
  {
    id: "VAN-02",
    label: "UP14CK8184",
    type: "van",
    driver: "Pradeep Tiwari",
    phone: "+91 76543 21098",
    route: "Route D — Noida Sec-62 → School",
    stops: ["Sec-62", "Sec-18", "DND Flyway", "School Gate"],
    capacity: 12,
    students: 11,
    status: "idle",
    speed: 0,
    fuel: 30,
    eta: "—",
    color: "#A855F7",
    lat: 28.627,
    lng: 77.363,
  },
  {
    id: "BUS-03",
    label: "UP14L8989",
    type: "bus",
    driver: "Mohan Lal",
    phone: "+91 65432 10987",
    route: "Route E — Dwarka → School",
    stops: ["Dwarka Sec-10", "Dwarka Mor", "Uttam Nagar", "School Gate"],
    capacity: 52,
    students: 0,
    status: "maintenance",
    speed: 0,
    fuel: 90,
    eta: "—",
    color: "#F43F5E",
    lat: 28.589,
    lng: 77.046,
  },
];

const SCHOOL_LAT = 28.6304;
const SCHOOL_LNG = 77.2177;

const STATUS_CONFIG = {
  "on-route":    { label: "On Route",    bg: "#DCFCE7", color: "#16A34A", dot: "#22C55E" },
  "idle":        { label: "Idle",        bg: "#FEF9C3", color: "#A16207", dot: "#EAB308" },
  "maintenance": { label: "Maintenance", bg: "#FEE2E2", color: "#B91C1C", dot: "#F43F5E" },
};

/* ── Inline SVG icons ── */
const BusIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="22" height="14" rx="2" />
    <path d="M1 9h22M8 3v14M16 3v14" />
    <circle cx="6" cy="19" r="2" /><circle cx="18" cy="19" r="2" />
    <path d="M4 17v2M20 17v2" />
  </svg>
);

const VanIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9h-2" />
    <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
    <path d="M14 3v5h5" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
  </svg>
);

const RouteIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const SpeedIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 2a10 10 0 1010 10" /><path d="M12 12l4.35-4.35M22 12h-2" />
  </svg>
);

const FuelIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 22V6a2 2 0 012-2h8a2 2 0 012 2v16M3 22h12M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
    <path d="M7 10h4M7 14h4" />
  </svg>
);

const StudentIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const PinIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);

/* ── Stat pill ── */
function StatPill({ icon, label, value }) {
  return (
    <div className="loc-stat-pill">
      <span className="loc-stat-icon">{icon}</span>
      <div>
        <div className="loc-stat-value">{value}</div>
        <div className="loc-stat-label">{label}</div>
      </div>
    </div>
  );
}

/* ── Fuel bar ── */
function FuelBar({ pct }) {
  const color = pct > 50 ? "#22C55E" : pct > 25 ? "#F97316" : "#F43F5E";
  return (
    <div className="loc-fuel-bar-wrap">
      <div className="loc-fuel-bar-track">
        <div className="loc-fuel-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="loc-fuel-pct" style={{ color }}>{pct}%</span>
    </div>
  );
}

/* ── Stop timeline ── */
function StopTimeline({ stops, activeIdx = 2 }) {
  return (
    <div className="loc-stops">
      {stops.map((stop, i) => (
        <div key={stop} className={`loc-stop${i <= activeIdx ? " passed" : ""}${i === activeIdx ? " current" : ""}`}>
          <div className="loc-stop-dot" />
          {i < stops.length - 1 && <div className="loc-stop-line" />}
          <span className="loc-stop-label">{stop}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Google Maps embed ── */
function MapView({ vehicles, selectedId, onSelectVehicle, apiKey }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const infoWindowRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [mapZoom, setMapZoom] = useState(12);

  const getMarkerIcon = useCallback((vehicle, scale, zoom = mapZoom) => {
    if (vehicle.type === "bus") {
      const zoomFactor = Math.max(0.75, Math.min(1.8, 1 + (zoom - 12) * 0.12));
      const size = Math.round(scale * 3.2 * zoomFactor);

      return {
        url: "/images/bus.svg",
        scaledSize: new window.google.maps.Size(size, size),
        anchor: new window.google.maps.Point(size / 2, size / 2),
      };
    }

    if (vehicle.type === "van") {
      const zoomFactor = Math.max(0.75, Math.min(1.8, 1 + (zoom - 12) * 0.12));
      const size = Math.round(scale * 3.1 * zoomFactor);

      return {
        url: "/images/car.png",
        scaledSize: new window.google.maps.Size(size, size),
        anchor: new window.google.maps.Point(size / 2, size / 2),
      };
    }

    return {
      path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale,
      fillColor: vehicle.color,
      fillOpacity: 1,
      strokeColor: "#fff",
      strokeWeight: 2,
      rotation: 45,
    };
  }, [mapZoom]);

  /* Load the Maps script once */
  useEffect(() => {
    if (window.google?.maps) { setMapLoaded(true); return; }
    if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY") { setMapError(true); return; }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => setMapError(true);
    document.head.appendChild(script);
    return () => { try { document.head.removeChild(script); } catch (_) {} };
  }, [apiKey]);

  /* Init map */
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: SCHOOL_LAT, lng: SCHOOL_LNG },
      zoom: 12,
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#f8f9fa" }] },
        { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#dbeafe" }] },
        { featureType: "landscape", stylers: [{ color: "#f1f5f9" }] },
      ],
    });

    setMapZoom(12);

    const zoomListener = mapInstanceRef.current.addListener("zoom_changed", () => {
      const nextZoom = mapInstanceRef.current.getZoom() || 12;
      setMapZoom(nextZoom);
    });

    /* School marker */
    new window.google.maps.Marker({
      position: { lat: SCHOOL_LAT, lng: SCHOOL_LNG },
      map: mapInstanceRef.current,
      title: "School",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 14,
        fillColor: "#4F46E5",
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 3,
      },
    });

    infoWindowRef.current = new window.google.maps.InfoWindow();
    return () => {
      window.google.maps.event.removeListener(zoomListener);
    };
  }, [mapLoaded]);

  /* Update / create vehicle markers */
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return;

    vehicles.forEach((v) => {
      const pos = { lat: v.lat, lng: v.lng };
      if (markersRef.current[v.id]) {
        markersRef.current[v.id].setPosition(pos);
      } else {
        const marker = new window.google.maps.Marker({
          position: pos,
          map: mapInstanceRef.current,
          title: v.label,
          icon: getMarkerIcon(v, 7, mapZoom),
        });
        marker.addListener("click", () => {
          onSelectVehicle(v.id);
          infoWindowRef.current.setContent(
            `<div style="font-family:inherit;padding:4px 6px">
              <b style="color:#101828">${v.label}</b><br/>
              <span style="color:#667085;font-size:12px">${v.driver}</span><br/>
              <span style="color:#667085;font-size:12px">ETA: ${v.eta}</span>
            </div>`
          );
          infoWindowRef.current.open(mapInstanceRef.current, marker);
        });
        markersRef.current[v.id] = marker;
      }

      /* Highlight selected */
      const scale = v.id === selectedId ? 10 : 7;
      markersRef.current[v.id].setIcon(getMarkerIcon(v, scale, mapZoom));
    });
  }, [vehicles, selectedId, onSelectVehicle, getMarkerIcon, mapZoom]);

  /* Pan to selected */
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const v = vehicles.find((x) => x.id === selectedId);
    if (v) mapInstanceRef.current.panTo({ lat: v.lat, lng: v.lng });
  }, [selectedId, vehicles]);

  if (mapError) {
    return (
      <div className="loc-map-placeholder">
        <div className="loc-map-mock">
          <MockMap vehicles={vehicles} selectedId={selectedId} onSelect={onSelectVehicle} />
        </div>
        <div className="loc-map-key-notice">
          <span className="loc-key-badge">⚠</span>
          Add your Google Maps API key in <code>Location.js</code> (line 12) to enable live maps.
          Demo mode showing simulated positions.
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="loc-google-map" />;
}

/* ── Mock map (no API key fallback) ── */
function MockMap({ vehicles, selectedId, onSelect }) {
  /* Simple SVG-based pseudo-map */
  const W = 800, H = 520;
  const latMin = 28.57, latMax = 28.68, lngMin = 77.0, lngMax = 77.42;
  const toX = (lng) => ((lng - lngMin) / (lngMax - lngMin)) * W;
  const toY = (lat) => ((latMax - lat) / (latMax - latMin)) * H;
  const schoolX = toX(SCHOOL_LNG), schoolY = toY(SCHOOL_LAT);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="loc-mock-svg">
      {/* Grid */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`v${i}`} x1={i * (W / 11)} y1={0} x2={i * (W / 11)} y2={H} stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i * (H / 7)} x2={W} y2={i * (H / 7)} stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {/* Roads */}
      <path d={`M 0 ${H * 0.5} Q ${W * 0.3} ${H * 0.45} ${W * 0.55} ${H * 0.42} Q ${W * 0.75} ${H * 0.38} ${W} ${H * 0.35}`} fill="none" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
      <path d={`M ${W * 0.1} 0 Q ${W * 0.3} ${H * 0.3} ${W * 0.55} ${H * 0.42}`} fill="none" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
      <path d={`M ${W * 0.55} ${H * 0.42} Q ${W * 0.55} ${H * 0.7} ${W * 0.6} ${H}`} fill="none" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
      <path d={`M 0 ${H * 0.7} Q ${W * 0.4} ${H * 0.65} ${W * 0.55} ${H * 0.42}`} fill="none" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
      <path d={`M ${W * 0.55} ${H * 0.42} Q ${W * 0.8} ${H * 0.3} ${W} ${H * 0.2}`} fill="none" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />

      {/* Route lines to school */}
      {vehicles.filter(v => v.status === "on-route").map(v => (
        <line key={v.id + "-route"} x1={toX(v.lng)} y1={toY(v.lat)} x2={schoolX} y2={schoolY}
          stroke={v.color} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
      ))}

      {/* School pin */}
      <g transform={`translate(${schoolX}, ${schoolY})`}>
        <circle r="16" fill="#4F46E5" opacity="0.15" />
        <circle r="10" fill="#4F46E5" stroke="#fff" strokeWidth="2.5" />
        <text textAnchor="middle" y="4" fill="#fff" fontSize="10" fontWeight="700">S</text>
        <text y="-22" textAnchor="middle" fill="#4F46E5" fontSize="10" fontWeight="700">School</text>
      </g>

      {/* Vehicle markers */}
      {vehicles.map(v => {
        const x = toX(v.lng), y = toY(v.lat);
        const isSel = v.id === selectedId;
        return (
          <g key={v.id} transform={`translate(${x}, ${y})`} style={{ cursor: "pointer" }} onClick={() => onSelect(v.id)}>
            {isSel && <circle r="22" fill={v.color} opacity="0.18" className="loc-marker-pulse" />}
            <circle r={isSel ? 14 : 11} fill={v.color} stroke="#fff" strokeWidth={isSel ? 3 : 2} />
            <text textAnchor="middle" y="4" fill="#fff" fontSize={isSel ? "9" : "8"} fontWeight="700">
              {v.type === "bus" ? "B" : "V"}
            </text>
            {isSel && (
              <g transform="translate(0, -28)">
                <rect x="-28" y="-14" width="56" height="18" rx="5" fill="#101828" />
                <text textAnchor="middle" y="-2" fill="#fff" fontSize="9" fontWeight="600">{v.label}</text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function Location() {
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
  const [selectedId, setSelectedId] = useState("BUS-01");
  const [filter, setFilter] = useState("all"); // all | bus | van
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveToggle, setLiveToggle] = useState(true);
  const vehiclesRef = useRef(INITIAL_VEHICLES);
  const movementTimerRef = useRef(null);

  const selected = vehicles.find((v) => v.id === selectedId);

  useEffect(() => {
    vehiclesRef.current = vehicles;
  }, [vehicles]);

  /* Simulate live GPS movement */
  useEffect(() => {
    if (!liveToggle) return;
    const steps = 20;
    const stepDelay = 50;

    const animateMovement = () => {
      const currentVehicles = vehiclesRef.current;
      const movingVehicles = currentVehicles
        .filter((v) => v.status === "on-route")
        .map((v) => {
          const dLat = (SCHOOL_LAT - v.lat) * 0.04 + (Math.random() - 0.5) * 0.0004;
          const dLng = (SCHOOL_LNG - v.lng) * 0.04 + (Math.random() - 0.5) * 0.0004;
          const newEtaMin = Math.max(1, parseInt(v.eta, 10) - 0.08 + Math.random() * 0.04);
          const heading = (Math.atan2(dLng, dLat) * 180) / Math.PI;

          return {
            id: v.id,
            startLat: v.lat,
            startLng: v.lng,
            endLat: v.lat + dLat,
            endLng: v.lng + dLng,
            heading,
            speed: Math.round(30 + Math.random() * 20),
            eta: `${Math.round(newEtaMin)} min`,
          };
        });

      if (movingVehicles.length === 0) {
        setLastUpdated(new Date());
        return;
      }

      let currentStep = 0;

      if (movementTimerRef.current) {
        clearInterval(movementTimerRef.current);
      }

      movementTimerRef.current = setInterval(() => {
        currentStep += 1;

        setVehicles((prev) =>
          prev.map((v) => {
            const moving = movingVehicles.find((item) => item.id === v.id);
            if (!moving) return v;

            const progress = Math.min(currentStep / steps, 1);

            return {
              ...v,
              lat: moving.startLat + (moving.endLat - moving.startLat) * progress,
              lng: moving.startLng + (moving.endLng - moving.startLng) * progress,
              heading: moving.heading,
              speed: progress >= 1 ? moving.speed : v.speed,
              eta: progress >= 1 ? moving.eta : v.eta,
            };
          })
        );

        if (currentStep >= steps) {
          clearInterval(movementTimerRef.current);
          movementTimerRef.current = null;
          setLastUpdated(new Date());
        }
      }, stepDelay);
    };

    animateMovement();
    const interval = setInterval(animateMovement, 3000);

    return () => {
      clearInterval(interval);
      if (movementTimerRef.current) {
        clearInterval(movementTimerRef.current);
        movementTimerRef.current = null;
      }
    };
  }, [liveToggle]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => { setIsRefreshing(false); setLastUpdated(new Date()); }, 900);
  };

  const filteredVehicles = filter === "all" ? vehicles : vehicles.filter((v) => v.type === filter);

  const totalBuses = vehicles.filter((v) => v.type === "bus").length;
  const totalVans = vehicles.filter((v) => v.type === "van").length;
  const onRoute = vehicles.filter((v) => v.status === "on-route").length;
  const totalStudents = vehicles.reduce((s, v) => s + v.students, 0);

  const handleSelectVehicle = useCallback((id) => setSelectedId(id), []);

  return (
    <div className="loc-root">
      {/* ── Top Summary Bar ── */}
      <div className="loc-topbar">
        <div className="loc-topbar-left">
          <h2 className="loc-page-title">Live Vehicle Tracking</h2>
          <div className="loc-live-badge">
            <span className={`loc-live-dot${liveToggle ? " active" : ""}`} />
            {liveToggle ? "Live" : "Paused"}
          </div>
        </div>
        <div className="loc-topbar-right">
          <div className="loc-summary-pills">
            <StatPill icon={<BusIcon size={14} />} label="Buses" value={totalBuses} />
            <StatPill icon={<VanIcon size={14} />} label="Vans" value={totalVans} />
            <StatPill icon={<span style={{ fontSize: 13 }}>🟢</span>} label="On Route" value={onRoute} />
            <StatPill icon={<StudentIcon />} label="Students" value={totalStudents} />
          </div>
          <button
            className={`loc-live-toggle${liveToggle ? " on" : ""}`}
            onClick={() => setLiveToggle((v) => !v)}
          >
            {liveToggle ? "Pause" : "Resume"}
          </button>
          <button
            className={`loc-refresh-btn${isRefreshing ? " spinning" : ""}`}
            onClick={handleRefresh}
            title="Refresh"
          >
            <RefreshIcon />
          </button>
          <span className="loc-updated">
            Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
      </div>

      {/* ── Main Body ── */}
      <div className="loc-body">
        {/* ── Left: Vehicle List ── */}
        <div className="loc-vehicle-panel">
          <div className="loc-panel-head">
            <span className="loc-panel-title">Fleet</span>
            <div className="loc-filter-tabs">
              {["all", "bus", "van"].map((f) => (
                <button
                  key={f}
                  className={`loc-filter-tab${filter === f ? " active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1) + "s"}
                </button>
              ))}
            </div>
          </div>

          <div className="loc-vehicle-list">
            {filteredVehicles.map((v) => {
              const st = STATUS_CONFIG[v.status];
              const isSel = v.id === selectedId;
              return (
                <button
                  key={v.id}
                  className={`loc-vehicle-card${isSel ? " selected" : ""}`}
                  onClick={() => setSelectedId(v.id)}
                  style={isSel ? { borderColor: v.color } : {}}
                >
                  <div className="loc-vc-top">
                    <div className="loc-vc-icon" style={{ background: v.color + "18", color: v.color }}>
                      {v.type === "bus" ? <BusIcon size={16} color={v.color} /> : <VanIcon size={16} color={v.color} />}
                    </div>
                    <div className="loc-vc-info">
                      <div className="loc-vc-label">{v.label}</div>
                      <div className="loc-vc-driver">{v.driver}</div>
                    </div>
                    <div className="loc-vc-status-wrap">
                      <span className="loc-vc-status-dot" style={{ background: st.dot }} />
                      <span className="loc-vc-status-text" style={{ color: st.color }}>{st.label}</span>
                    </div>
                  </div>
                  <div className="loc-vc-bottom">
                    <span className="loc-vc-meta">
                      <StudentIcon />{v.students}/{v.capacity}
                    </span>
                    <span className="loc-vc-meta">
                      <SpeedIcon />{v.speed} km/h
                    </span>
                    <span className="loc-vc-meta loc-eta" style={{ color: v.status === "on-route" ? "#16A34A" : "#98A2B3" }}>
                      ETA: {v.eta}
                    </span>
                  </div>
                  {isSel && <div className="loc-vc-selected-bar" style={{ background: v.color }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Center: Map ── */}
        <div className="loc-map-panel">
          <MapView
            vehicles={vehicles}
            selectedId={selectedId}
            onSelectVehicle={handleSelectVehicle}
            apiKey={GOOGLE_MAPS_API_KEY}
          />
          {/* Map overlay legend */}
          <div className="loc-map-legend">
            <div className="loc-legend-item"><span className="loc-legend-dot" style={{ background: "#4F46E5" }} />School</div>
            <div className="loc-legend-item"><span className="loc-legend-dot" style={{ background: "#22C55E" }} />On Route</div>
            <div className="loc-legend-item"><span className="loc-legend-dot" style={{ background: "#EAB308" }} />Idle</div>
            <div className="loc-legend-item"><span className="loc-legend-dot" style={{ background: "#F43F5E" }} />Maintenance</div>
          </div>
        </div>

        {/* ── Right: Detail Panel ── */}
        {selected && (
          <div className="loc-detail-panel">
            {/* Vehicle header */}
            <div className="loc-detail-header" style={{ borderLeftColor: selected.color }}>
              <div className="loc-dh-icon" style={{ background: selected.color + "20", color: selected.color }}>
                {selected.type === "bus" ? <BusIcon size={22} color={selected.color} /> : <VanIcon size={22} color={selected.color} />}
              </div>
              <div className="loc-dh-info">
                <div className="loc-dh-label">{selected.label}</div>
                <div className="loc-dh-id">{selected.id}</div>
              </div>
              <div className="loc-dh-status" style={{ background: STATUS_CONFIG[selected.status].bg, color: STATUS_CONFIG[selected.status].color }}>
                {STATUS_CONFIG[selected.status].label}
              </div>
            </div>

            {/* Driver */}
            <div className="loc-detail-section">
              <div className="loc-ds-title">Driver</div>
              <div className="loc-driver-card">
                <div className="loc-driver-avatar" style={{ background: selected.color + "20", color: selected.color }}>
                  {selected.driver.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="loc-driver-name">{selected.driver}</div>
                  <div className="loc-driver-phone"><PhoneIcon />{selected.phone}</div>
                </div>
              </div>
            </div>

            {/* Live stats */}
            <div className="loc-detail-section">
              <div className="loc-ds-title">Live Stats</div>
              <div className="loc-live-stats">
                <div className="loc-ls-item">
                  <SpeedIcon />
                  <span className="loc-ls-val">{selected.speed} km/h</span>
                  <span className="loc-ls-lbl">Speed</span>
                </div>
                <div className="loc-ls-item">
                  <StudentIcon />
                  <span className="loc-ls-val">{selected.students}/{selected.capacity}</span>
                  <span className="loc-ls-lbl">Students</span>
                </div>
                <div className="loc-ls-item">
                  <RouteIcon />
                  <span className="loc-ls-val" style={{ color: selected.status === "on-route" ? "#16A34A" : "#98A2B3" }}>{selected.eta}</span>
                  <span className="loc-ls-lbl">ETA</span>
                </div>
              </div>
            </div>

            {/* Fuel */}
            <div className="loc-detail-section">
              <div className="loc-ds-title-row">
                <div className="loc-ds-title">Fuel Level</div>
                <span className="loc-ds-hint"><FuelIcon /></span>
              </div>
              <FuelBar pct={selected.fuel} />
            </div>

            {/* Route */}
            <div className="loc-detail-section">
              <div className="loc-ds-title">Route</div>
              <div className="loc-route-label"><PinIcon />{selected.route}</div>
              <StopTimeline stops={selected.stops} activeIdx={selected.status === "on-route" ? 1 : 0} />
            </div>

            {/* Coordinates */}
            <div className="loc-detail-section loc-coords-section">
              <div className="loc-ds-title">GPS Coordinates</div>
              <div className="loc-coords">
                <span>Lat: {selected.lat.toFixed(5)}</span>
                <span>Lng: {selected.lng.toFixed(5)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="loc-detail-actions">
              <button className="loc-action-btn primary" style={{ background: selected.color }}>
                <PhoneIcon /> Call Driver
              </button>
              <button className="loc-action-btn secondary">
                <PinIcon /> Track Route
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}