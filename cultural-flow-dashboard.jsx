import { useState, useEffect, useRef, useMemo } from "react";
import Globe from "react-globe.gl";

// 15 Major World Cultural Hubs
const CITIES = [
  { id: "nyc", lat: 40.7128, lng: -74.0060, name: "New York City", country: "United States", currency: "USD", index: "S+ / 4.8M" },
  { id: "lon", lat: 51.5074, lng: -0.1278, name: "London", country: "United Kingdom", currency: "GBP", index: "S / 3.9M" },
  { id: "tok", lat: 35.6762, lng: 139.6503, name: "Tokyo", country: "Japan", currency: "JPY", index: "A+ / 3.1M" },
  { id: "lag", lat: 6.5244, lng: 3.3792, name: "Lagos", country: "Nigeria", currency: "NGN", index: "B+ / 1.2M" },
  { id: "mum", lat: 19.0760, lng: 72.8777, name: "Mumbai", country: "India", currency: "INR", index: "A / 1.8M" },
  { id: "sao", lat: -23.5505, lng: -46.6333, name: "São Paulo", country: "Brazil", currency: "BRL", index: "B / 1.5M" },
  { id: "par", lat: 48.8566, lng: 2.3522, name: "Paris", country: "France", currency: "EUR", index: "S / 2.9M" },
  { id: "seo", lat: 37.5665, lng: 126.9780, name: "Seoul", country: "South Korea", currency: "KRW", index: "A+ / 2.4M" },
  { id: "syd", lat: -33.8688, lng: 151.2093, name: "Sydney", country: "Australia", currency: "AUD", index: "B+ / 0.9M" },
  { id: "cai", lat: 30.0444, lng: 31.2357, name: "Cairo", country: "Egypt", currency: "EGP", index: "C / 0.7M" },
  { id: "ber", lat: 52.5200, lng: 13.4050, name: "Berlin", country: "Germany", currency: "EUR", index: "A / 1.9M" },
  { id: "la", lat: 34.0522, lng: -118.2437, name: "Los Angeles", country: "United States", currency: "USD", index: "S / 4.1M" },
  { id: "sin", lat: 1.3521, lng: 103.8198, name: "Singapore", country: "Singapore", currency: "SGD", index: "A+ / 2.2M" },
  { id: "dub", lat: 25.2048, lng: 55.2708, name: "Dubai", country: "UAE", currency: "AED", index: "A / 1.5M" },
  { id: "mex", lat: 19.4326, lng: -99.1332, name: "Mexico City", country: "Mexico", currency: "MXN", index: "B / 1.1M" }
];

// Structural Vector Connections (Cultural Intercept Paths)
const PATHS_DATA = [
  { start: "nyc", end: "lon", type: "TECH" }, { start: "lon", end: "par", type: "FASHION" },
  { start: "par", end: "tok", type: "ART" }, { start: "tok", end: "seo", type: "TECH" },
  { start: "nyc", end: "la", type: "MUSIC" }, { start: "la", end: "tok", type: "MUSIC" },
  { start: "lon", end: "lag", type: "MUSIC" }, { start: "lag", end: "mum", type: "ART" },
  { start: "mum", end: "sin", type: "TECH" }, { start: "sin", end: "syd", type: "TECH" },
  { start: "nyc", end: "sao", type: "ART" }, { start: "sao", end: "par", type: "FASHION" },
  { start: "dub", end: "lon", type: "TECH" }, { start: "mex", end: "la", type: "ART" },
  { start: "ber", end: "lon", type: "MUSIC" }, { start: "cai", end: "dub", type: "ART" }
];

const BREAKPOINT_COLORS = {
  MUSIC: "#ff00ff",   // Magenta
  ART: "#00e5ff",     // Cyan
  FASHION: "#ffcc00", // Gold
  TECH: "#ff6600"     // Orange
};

// Comprehensive Regional News Database Layer
const RAW_NEWS_DATABASE = {
  "United States": [
    { id: "us1", headline: "Silicon Valley Unveils Quantum Mesh Neural Array Architecture", summary: "Tech consortium states new hardware scales compute efficiency by 400%, disrupting existing infrastructure stocks.", asset: "S&P 500 (Equities)", direction: "LONG", horizon: "POSITION (1M+)", rationale: "Structural acceleration in domestic enterprise valuations.", basePop: 94 },
    { id: "us2", headline: "Federal Reserve Adjusts Liquidity Window Access Controls", summary: "Surprise banking sector adjustments tighten secondary market access overnight, spiking immediate treasury velocity.", asset: "US 10Y Treasury (Bonds)", direction: "SHORT", horizon: "INTRADAY (1H-4H)", rationale: "Immediate yield compression expected on repo changes.", basePop: 82 }
  ],
  "United Kingdom": [
    { id: "uk1", headline: "London Tech Outflows Surge Following Creative Sector Injections", summary: "Venture capital matching grants trigger multi-billion pound liquidity flow directly into localized fintech hubs.", asset: "GBP/USD (Forex)", direction: "LONG", horizon: "SWING (1D-1W)", rationale: "Heavy cross-border asset demand stabilizes Sterling trading bounds.", basePop: 96 },
    { id: "uk2", headline: "Supply Constrictions Node Detected Across North Sea Pipelines", summary: "Unscheduled maintenance logistics trigger temporary pipeline shutdowns, reducing immediate regional inventory indices.", asset: "Brent Crude (Futures)", direction: "LONG", horizon: "SCALP (5M-15M)", rationale: "Immediate supply bottleneck triggers algorithmic buying spikes.", basePop: 71 }
  ],
  "Japan": [
    { id: "jp1", headline: "Bank of Japan Intervenes on Yield Curve Management Bounds", summary: "Monetary policy committee executes unannounced bond purchase blocks to cap local sovereign rate expansion profiles.", asset: "USD/JPY (Forex)", direction: "LONG", horizon: "INTRADAY (1H-4H)", rationale: "Artificially suppressed yields diminish Yen attractiveness versus Dollar.", basePop: 91 }
  ],
  "Nigeria": [
    { id: "ng1", headline: "Lagos Tech Hub Secures Comprehensive Regional Telecomm Monopolies", summary: "Sovereign policy declarations cement localized fiber backbones, creating high-barrier technology zones.", asset: "EIMI (Emerging Markets Index)", direction: "LONG", horizon: "POSITION (1M+)", rationale: "Long term infrastructural optimization improves regional macro profiles.", basePop: 85 }
  ]
};

export default function CulturalFlowDashboard() {
  const globeRef = useRef();
  const [selectedCity, setSelectedCity] = useState(CITIES[0]); // Default to NYC
  const [activeFilters, setActiveFilters] = useState({ MUSIC: true, ART: true, FASHION: true, TECH: true });
  const [autoRotate, setAutoRotate] = useState(true);
  const [newsCache, setNewsCache] = useState([]);
  const [lastSync, setLastSync] = useState(new Date());

  // Parse active connection links based on visibility filters
  const visibleArcs = useMemo(() => {
    return PATHS_DATA.filter(path => activeFilters[path.type]).map(path => {
      const startCity = CITIES.find(c => c.id === path.start);
      const endCity = CITIES.find(c => c.id === path.end);
      return {
        startLat: startCity.lat, startLng: startCity.lng,
        endLat: endCity.lat, endLng: endCity.lng,
        color: BREAKPOINT_COLORS[path.type]
      };
    });
  }, [activeFilters]);

  // Handle Dynamic Real-Time News Re-sorting Engine
  useEffect(() => {
    const buildNewsFeed = () => {
      const countryData = RAW_NEWS_DATABASE[selectedCity.country] || [
        { id: "gen1", headline: `Systemic Intelligence Active Over Region: ${selectedCity.name}`, summary: "Macro telemetry vectors streaming cleanly. No immediate anomalous volatility triggers discovered.", asset: `${selectedCity.currency}/USD (Forex)`, direction: "LONG", horizon: "SWING (1D-1W)", rationale: "Standard risk profiles indicate stable regional tracking.", basePop: 50 }
      ];

      // Inject 30s volatility randomization weight
      const randomizedFeed = countryData.map(item => ({
        ...item,
        currentPop: Math.min(100, Math.max(10, item.basePop + Math.floor((Math.random() - 0.5) * 15)))
      })).sort((a, b) => b.currentPop - a.currentPop);

      setNewsCache(randomizedFeed);
      setLastSync(new Date());
    };

    buildNewsFeed();
    const refreshTimer = setInterval(buildNewsFeed, 30000); // 30s loop
    return () => clearInterval(refreshTimer);
  }, [selectedCity]);

  // Adjust global auto-rotation state context loop
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = autoRotate;
      globeRef.current.controls().autoRotateSpeed = 0.6;
    }
  }, [autoRotate]);

  const handleCityClick = (city) => {
    setSelectedCity(city);
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: city.lat, lng: city.lng, altitude: 1.2 }, 1200);
    }
  };

  return (
    <div style={{ fontFamily: "monospace", background: "#01060a", color: "#00ff88", minHeight: "100vh", padding: "12px", boxSizing: "border-box" }}>
      
      {/* Upper Navigation HUD Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #00ff8833", paddingBottom: "8px", marginBottom: "12px" }}>
        <div>
          <span style={{ fontSize: "16px", fontWeight: "bold", letterSpacing: "3px" }}>📊 GLOBAL CULTURAL FLOW INTERCEPT</span>
          <span style={{ marginLeft: "14px", color: "#00e5ff", fontSize: "10px" }}>v4.0 // PRODUCTION_ENGINE</span>
        </div>
        <div style={{ fontSize: "11px", color: "#ffffff44" }}>
          SYS_SYNC: <span style={{ color: "#ffcc00" }}>{lastSync.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Tri-Panel Grid Panel Configuration */}
      <div style={{ display: "flex", gap: "12px", height: "calc(100vh - 65px)" }}>
        
        {/* LEFT COMPONENT PANEL: TRACKING FILTERS & CAM SYSTEM CONTROLS */}
        <div style={{ width: "240px", display: "flex", flexDirection: "column", gap: "10px" }}>
          
          {/* Globe Controls Card */}
          <div style={{ border: "1px solid #00ff8833", background: "#010a0f", padding: "10px" }}>
            <div style={{ fontSize: "11px", borderBottom: "1px solid #00ff8822", paddingBottom: "4px", marginBottom: "8px", color: "#ffffff88" }}>🛰️ GLOBE CAM CONTROLS</div>
            <button onClick={() => setAutoRotate(!autoRotate)} style={{ width: "100%", background: autoRotate ? "rgba(0,255,136,0.15)" : "transparent", border: "1px solid #00ff88", color: "#00ff88", padding: "5px", cursor: "pointer", fontFamily: "monospace", marginBottom: "6px" }}>
              {autoRotate ? "■ HALT AUTOROTATE" : "▶ ENGAGE AUTOROTATE"}
            </button>
            <div style={{ display: "flex", gap: "4px" }}>
              <button onClick={() => globeRef.current.pointOfView({ altitude: 0.6 }, 600)} style={{ flex: 1, background: "transparent", border: "1px solid #00e5ff33", color: "#00e5ff", padding: "4px", cursor: "pointer", fontFamily: "monospace", fontSize: "10px" }}>ZOOM IN</button>
              <button onClick={() => globeRef.current.pointOfView({ altitude: 2.2 }, 600)} style={{ flex: 1, background: "transparent", border: "1px solid #00e5ff33", color: "#00e5ff", padding: "4px", cursor: "pointer", fontFamily: "monospace", fontSize: "10px" }}>ZOOM OUT</button>
            </div>
          </div>

          {/* Cultural Breakpoints Selection Matrix */}
          <div style={{ border: "1px solid #00ff8833", background: "#010a0f", padding: "10px", flex: 1 }}>
            <div style={{ fontSize: "11px", borderBottom: "1px solid #00ff8822", paddingBottom: "4px", marginBottom: "8px", color: "#ffffff88" }}>⛓️ CULTURAL BREAKPOINTS</div>
            {Object.keys(BREAKPOINT_COLORS).map(type => (
              <label key={type} style={{ display: "flex", alignItems: "center", gap: "8px", margin: "10px 0", cursor: "pointer", fontSize: "11px" }}>
                <input type="checkbox" checked={activeFilters[type]} onChange={() => setActiveFilters(prev => ({ ...prev, [type]: !prev[type] }))} style={{ cursor: "pointer" }} />
                <span style={{ color: BREAKPOINT_COLORS[type], fontWeight: "bold" }}>■ {type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* CENTER COMPONENT PANEL: THE 3D WEBGL EARTH IMAGE MESH LAYER */}
        <div style={{ flex: 1, background: "#000", border: "1px solid #00e5ff22", position: "relative" }}>
          <Globe
            ref={globeRef}
            width={window.innerWidth * 0.48}
            height={window.innerHeight - 100}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            backgroundColor="#000000"
            atmosphereColor="#00e5ff"
            atmosphereThickness={0.15}
            
            // Render Global Vectors
            arcsData={visibleArcs}
            arcColor="color"
            arcAltitude={() => Math.random() * 0.3 + 0.1}
            arcStroke={() => 0.6}
            arcDashLength={0.4}
            arcDashGap={0.2}
            arcDashAnimateTime={2000}

            // Render City Point Array
            pointsData={CITIES}
            pointLat="lat"
            pointLng="lng"
            pointColor={(d) => d.id === selectedCity.id ? "#00e5ff" : "#00ff88"}
            pointRadius={(d) => d.id === selectedCity.id ? 0.6 : 0.35}
            onPointClick={(node) => handleCityClick(node)}
          />
        </div>

        {/* RIGHT COMPONENT PANEL: LIVE NEWS SUMMARY FEED & LLM TRADING SYSTEMS */}
        <div style={{ width: "340px", display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto" }}>
          
          {/* Target Region Header Telemetry */}
          <div style={{ border: "1px solid #ffcc0033", background: "#050300", padding: "10px" }}>
            <div style={{ fontSize: "10px", color: "#ffcc0088" }}>📍 LOC LOCKED TARGET MATRIX</div>
            <div style={{ fontSize: "14px", fontWeight: "bold", color: "#fff", marginTop: "4px" }}>{selectedCity.name.toUpperCase()} // {selectedCity.country.toUpperCase()}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#ffffff44", marginTop: "6px" }}>
              <span>CURRENCY: {selectedCity.currency}</span>
              <span>INDEX CAPITALIZATION: {selectedCity.index}</span>
            </div>
          </div>

          {/* Real-time News Intercept Stream Module */}
          <div style={{ border: "1px solid #00e5ff33", background: "#000a10", padding: "10px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "11px", borderBottom: "1px solid #00e5ff22", paddingBottom: "4px", color: "#00e5ff" }}>▶ LIVE REGIONAL NEWS INTERCEPT</div>
            {newsCache.map(news => (
              <div key={news.id} style={{ background: "rgba(0,0,0,0.4)", borderLeft: "2px solid #00e5ff", padding: "6px", fontSize: "11px" }}>
                <div style={{ color: "#ff0055", fontSize: "9px", fontWeight: "bold" }}>[LIVE REPORT] • POPULARITY: {news.currentPop}%</div>
                <div style={{ color: "#fff", fontWeight: "bold", margin: "2px 0" }}>{news.headline}</div>
                <div style={{ color: "#ffffff66", fontSize: "10px", lineHeight: "1.3" }}>{news.summary}</div>
              </div>
            ))}
          </div>

          {/* Quantitative Alchemic Alpha Trading Router Terminal */}
          <div style={{ border: "1px solid #ff00ff33", background: "#0c010c", padding: "10px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "11px", borderBottom: "1px solid #ff00ff22", paddingBottom: "4px", color: "#ff00ff" }}>🤖 LLM ALGORITHMIC TRADING INTEL // QUANT ALPHA</div>
            {newsCache.map(news => (
              <div key={`trade-${news.id}`} style={{ background: "rgba(0,0,0,0.5)", border: "1px dashed #ff00ff22", padding: "6px", fontSize: "11px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#fff", fontWeight: "bold" }}>{news.asset}</span>
                  <span style={{ background: news.direction === "LONG" ? "#00ff8822" : "#ff005522", color: news.direction === "LONG" ? "#00ff88" : "#ff0055", padding: "1px 4px", fontSize: "9px", fontWeight: "bold" }}>
                    {news.direction === "LONG" ? "🟩 BUY / LONG" : "🟥 SELL / SHORT"}
                  </span>
                </div>
                <div style={{ fontSize: "10px", color: "#ffffff44" }}>TIMEFRAME HORIZON: <span style={{ color: "#fff" }}>{news.horizon}</span></div>
                <div style={{ marginTop: "4px", color: "#ff00ff99", fontStyle: "italic", fontSize: "10px", lineHeight: "1.2" }}>{news.rationale}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
