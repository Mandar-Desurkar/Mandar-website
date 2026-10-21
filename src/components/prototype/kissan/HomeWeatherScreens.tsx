/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Kissan Sampurna Home + Weather report, recreated from the `dev` branch of kissansampurna-app:
// code/screens/home/home-new.jsx (+ WeatherCard, QuickActions, MandiPriceCard, FarmMonitorCTA) and
// code/screens/weather/weather-forecast-v2-screen.jsx. Weather values are illustrative; the real
// screen is themed per condition by the backend, shown here in its Heavy Rain (dark slate) theme.
import { useState, type ComponentType, type ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BriefcaseMedical,
  Camera,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  Clock,
  ImageIcon,
  MapPin,
  Pill,
  Plus,
  Square,
  TrendingUp,
} from "lucide-react";
import s from "./kissanHome.module.css";
import type { ScreenProps } from "./KissanScreens";
import { BulbIcon, LocateIcon, LocationPinIcon, PlotIcon, SatelliteIcon, SpeakerIcon } from "./KissanIcons";
import { KissanTabBar } from "./KissanShared";

const img = (file: string) => `/prototypes/kissan-sampurna/${file}`;

// Weather glyphs: the app loads weatherapi.com icons, falling back to orange Ionicons
function RainCloud({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M14 30a9 9 0 0 1 1.6-17.9A12 12 0 0 1 38.5 16 7 7 0 0 1 37 30z" fill="#e2e8f0" />
      <path d="M16 35l-2 5M24 35l-2 5M32 35l-2 5" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function StormCloud({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M14 28a9 9 0 0 1 1.6-17.9A12 12 0 0 1 38.5 14 7 7 0 0 1 37 28z" fill="#ff9500" />
      <path d="M17 33l-2 6M25 33l-2 6M33 33l-2 6" stroke="#ff9500" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ---------- 1. Home (home-new.jsx) ----------

const MY_CROPS = [
  ["Wheat", "crop-wheat.webp"],
  ["Rice", "crop-rice.webp"],
  ["Maize", "crop-maize.webp"],
  ["Cotton", "crop-cotton.webp"],
];

function Section({ title, action, children, className }: { title: string; action?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`${s.section} ${className ?? ""}`}>
      <div className={s.sectionHeader}>
        <h3 className={s.sectionTitle}>{title}</h3>
        {action && (
          <span className={s.viewAll}>
            {action} <ChevronRight size={16} />
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function Home({ next, goToFlow }: ScreenProps) {
  return (
    <div className={s.screen}>
      <div className={s.scroll}>
        {/* WeatherCard.jsx */}
        <div className={s.wxHero} style={{ backgroundImage: `url(${img("weather-bg.webp")})` }}>
          <div className={s.wxHeroContent}>
            <div className={s.wxHeaderRow}>
              <span className={s.wxLocation}>
                <MapPin size={16} color="#196EED" />
                <span>Hebbal, Bengaluru</span>
                <ChevronDown size={16} />
              </span>
              <span className={s.wxHeaderRight}>
                <span className={s.wxTempRow}>
                  <RainCloud />
                  24°C
                </span>
                <span className={s.wxCondition}>currently light rain</span>
              </span>
            </div>
            <p className={s.wxHeadline}>Heavy rain likely on Thursday</p>
            <span className={s.wxDivider} />
            <div className={s.wxAdvisories}>
              <span className={s.wxAdvisory}>
                <span className={s.wxAdvisoryIcon} style={{ background: "#F1E263" }}>
                  <BulbIcon size={14} color="#000" />
                </span>
                Finish spraying by Wednesday evening.
              </span>
              <span className={s.wxAdvisory}>
                <span className={s.wxAdvisoryIcon} style={{ background: "#FF0000" }}>
                  <AlertTriangle size={14} color="#fff" />
                </span>
                Clear field drains to avoid waterlogging.
              </span>
            </div>
            <span className={s.wxDivider} />
            <button type="button" className={`${s.btnReset} ${s.wxForecastBtn} ${s.hotspot}`} onClick={next}>
              View forecast <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* QuickActions.jsx */}
        <div className={s.quick}>
          <p className={s.greeting}>Hey Ramesh,</p>
          <p className={s.quickHeading}>What do you need help with today?</p>
          <div className={s.quickGrid}>
            {[
              { label: "Crop\nGuide", icon: "qa-crop-guide.webp", flow: "crop-guide" },
              { label: "Farm\nMonitoring", icon: "qa-farm-monitoring.webp", flow: "farm-monitoring" },
              { label: "Crop\nDoctor", icon: "qa-crop-doctor.webp", flow: "crop-doctor" },
              { label: "Mandi\nPrice", icon: "qa-mandi.webp" },
            ].map((a) => (
              <button
                key={a.label}
                type="button"
                className={`${s.btnReset} ${s.quickCard}`}
                onClick={a.flow ? () => goToFlow(a.flow) : undefined}
              >
                {a.label}
                <img src={img(a.icon)} alt="" />
              </button>
            ))}
          </div>
          <div className={s.seasonBanner}>
            <span className={s.newBadge}>NEW</span>
            <p className={s.seasonTitle}>Season Guide</p>
            <p className={s.seasonDesc}>
              Know your nearby water reservoir level, rainfall forecast and crop planning for the season.
            </p>
            <span className={s.seasonBtn}>View Now &gt;</span>
            <img className={s.seasonImg} src={img("season-guide.webp")} alt="" />
          </div>
        </div>

        {/* My Crops */}
        <section className={s.section}>
          <h3 className={s.sectionTitle}>My Crops</h3>
          <div className={s.cropsRow}>
            <span className={s.cropItem}>
              <span className={s.addCrop}>
                <Plus size={24} />
              </span>
              Add
            </span>
            {MY_CROPS.map(([name, file]) => (
              <span key={name} className={s.cropItem}>
                <span className={s.cropCircle}>
                  <img src={img(file)} alt="" />
                </span>
                {name}
              </span>
            ))}
          </div>
        </section>

        {/* renderDiagnosisSection + renderRecentScansSection */}
        <div className={s.diagnosisCard}>
          <p className={s.diagnosisTitle}>Diagnosis</p>
          <div className={s.diagnosisSteps}>
            {[
              [Activity, "Snap a Picture"],
              [BriefcaseMedical, "See Diagnosis"],
              [Pill, "Get Treatment"],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Activity;
              return (
                <span key={label as string} className={s.diagnosisStep}>
                  <span className={s.stepIcon}>
                    <I size={20} />
                  </span>
                  {label as string}
                </span>
              );
            })}
          </div>
          <button type="button" className={`${s.btnReset} ${s.primaryPill}`} onClick={() => goToFlow("crop-doctor", "select-crop")}>
            <Camera size={20} /> Take a Picture
          </button>
        </div>
        <Section title="Recent Scans" action="View All">
          <div className={s.hScroll}>
            {[
              { image: "prog-3-early-spread.webp", sev: "High", crop: "Rice", date: "Oct 18", issue: "Brown Spot" },
              { image: "prog-2-early-spot.webp", sev: "Medium", crop: "Wheat", date: "Oct 12", issue: "Leaf Rust (early)" },
            ].map((scan) => (
              <div key={scan.issue} className={s.scanCard}>
                <img src={img(scan.image)} alt="" />
                <span
                  className={s.riskBadge}
                  style={
                    scan.sev === "High"
                      ? { background: "#FFEBEE", color: "#EF4444" }
                      : { background: "#FFF3E0", color: "#FF9500" }
                  }
                >
                  <AlertTriangle size={12} /> {scan.sev}
                </span>
                <div className={s.scanInfo}>
                  <div className={s.scanRow}>
                    <b>{scan.crop}</b>
                    {scan.date}
                  </div>
                  <p className={s.scanIssue}>{scan.issue}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* renderMandiPricesSection + MandiPriceCard.jsx */}
        <Section title="Mandi Prices" action="Manage Crops" className={s.mandiSection}>
          <div className={s.chipsRow}>
            {["Wheat", "Tomato", "Onion"].map((c, i) => (
              <span key={c} className={`${s.chip} ${i === 0 ? s.chipActive : ""}`}>
                {c}
              </span>
            ))}
          </div>
          <div className={s.hScroll}>
            {[
              { mandi: "Yeshwanthpur APMC", sub: "Lokwan • FAQ", price: "₹2,640", change: "+2.1%", min: "₹2,450", max: "₹2,780" },
              { mandi: "Tumakuru APMC", sub: "Sharbati • FAQ", price: "₹2,590", change: "-0.8%", min: "₹2,400", max: "₹2,700" },
            ].map((m) => (
              <div key={m.mandi} className={s.mandiCard}>
                <div className={s.mandiHead}>
                  <span className={s.mandiImg}>
                    <img src={img("crop-wheat.webp")} alt="" />
                  </span>
                  <span>
                    <p className={s.mandiName}>{m.mandi}</p>
                    <p className={s.mandiSub}>{m.sub}</p>
                  </span>
                </div>
                <div className={s.mandiPriceRow}>
                  <span className={s.mandiPrice}>
                    {m.price}
                    <small> /quintal</small>
                  </span>
                  <span className={m.change.startsWith("+") ? s.up : s.down}>
                    {m.change.startsWith("+") ? "▲" : "▼"} {m.change}
                  </span>
                </div>
                <div className={s.mandiMinMax}>
                  <span>Min: {m.min}</span>
                  <span>Max: {m.max}</span>
                </div>
                <div className={s.thinDivider} />
                <div className={s.mandiFooter}>
                  <span className={s.intel}>
                    <TrendingUp size={18} /> 64-Day Intelligence
                  </span>
                  <span className={s.outlinePill}>
                    View Forecast <ChevronRight size={18} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* renderCropRecommendationsSection */}
        <section className={s.section}>
          <div className={s.soilCard}>
            <p className={s.soilHeader}>Are you confused?</p>
            {[
              [ImageIcon, "Capture Soil Condition", "Analyze soil for better yield"],
              [ClipboardList, "Expert Questionnaire", "Answer questions for expert advice"],
              [BarChart3, "Unlock Custom Crop Plan", "Get a personalized crop plan"],
            ].map(([Icon, title, desc], i) => {
              const I = Icon as typeof Activity;
              return (
                <div key={title as string} className={s.soilStep}>
                  <span className={s.soilIconCol}>
                    <span className={s.soilIcon}>
                      <I size={24} />
                    </span>
                    {i < 2 && <span className={s.soilLine} />}
                  </span>
                  <span className={s.soilText}>
                    <b>{title as string}</b>
                    <span>{desc as string}</span>
                  </span>
                </div>
              );
            })}
            <button type="button" className={`${s.btnReset} ${s.analysisBtn}`} onClick={() => goToFlow("crop-guide")}>
              Start Analysis <ArrowRight size={20} />
            </button>
          </div>
          <div className={s.sectionHeader}>
            <h3 className={s.sectionTitle}>Crop Recommendations</h3>
            <span className={s.viewAll}>
              View All <ChevronRight size={16} />
            </span>
          </div>
          <div className={s.hScroll}>
            {[
              ["Wheat", "crop-wheat.webp", "Oct 14"],
              ["Maize", "crop-maize.webp", "Oct 14"],
              ["Cotton", "crop-cotton.webp", "Oct 14"],
            ].map(([name, file, date]) => (
              <div key={name} className={s.recoCard}>
                <img src={img(file)} alt="" />
                <div className={s.recoInfo}>
                  <b>{name}</b>
                  <span>{date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FarmMonitorCTA.jsx + renderMyFarmSection */}
        <div className={s.fmCta}>
          <p className={s.fmHeading}>{"Monitor your farm from space in\n3 simple steps"}</p>
          <div className={s.fmSteps}>
            {[
              [LocateIcon, "Locate", "Search your farm\nlocation"],
              [PlotIcon, "Map", "Mark farm\nboundaries"],
              [SatelliteIcon, "Track", "Get real-time\nsatellite insights"],
            ].map(([Icon, title, desc], i) => {
              const I = Icon as typeof LocateIcon;
              return (
                <span key={title as string} style={{ display: "contents" }}>
                  {i > 0 && <span className={s.fmConnector} />}
                  <span className={s.fmStep}>
                    <span className={s.fmStepIcon}>
                      <I size={22} />
                    </span>
                    <b>{title as string}</b>
                    <span>{desc as string}</span>
                  </span>
                </span>
              );
            })}
          </div>
          <button type="button" className={`${s.btnReset} ${s.limePill}`} onClick={() => goToFlow("farm-monitoring", "fm-q-grow")}>
            <MapPin size={20} fill="currentColor" color="#d3d800" /> Add New Farm
          </button>
        </div>
        <Section title="My Farm" action="View All">
          <div className={s.hScroll}>
            <button type="button" className={`${s.btnReset} ${s.farmCard}`} onClick={() => goToFlow("farm-report")}>
              <div className={s.farmImgWrap}>
                <img src={img("fm-farm-illustration.webp")} alt="" style={{ objectPosition: "84% 50%" }} />
                <span className={s.satBadge}>Satellite View</span>
              </div>
              <div className={s.farmContent}>
                <div className={s.farmTitleRow}>
                  <span className={s.farmName}>Lakshmi Farm</span>
                  <span className={s.statusBadge} style={{ background: "#FFF3E0", color: "#E65100" }}>
                    <i className={s.statusDot} /> Needs attention
                  </span>
                </div>
                <div className={s.farmMeta}>
                  <span>
                    <MapPin size={14} /> Tumakuru, Karnataka
                  </span>
                  <span>Wheat • 2.40 Acres</span>
                </div>
                <div className={s.farmAlert}>
                  <AlertTriangle size={16} color="#EF4444" />
                  <span style={{ flex: 1 }}>
                    <b>Needs attention</b>
                    <span>Low water in the north-east patch</span>
                  </span>
                  <ChevronRight size={20} color="#6B7280" />
                </div>
              </div>
            </button>
          </div>
        </Section>
        <div style={{ height: 24 }} />
      </div>
      <KissanTabBar active="home" goToFlow={goToFlow} />
    </div>
  );
}

// ---------- 2. Weather report (weather-forecast-v2-screen.jsx) ----------

type Row = { label: string; temp: number; cond: string; action: string };

const FORECAST: Record<"today" | "tomorrow" | "this_week", Row[]> = {
  today: [
    { label: "6 AM", temp: 22, cond: "Light rain", action: "Skip spraying; leaves are wet" },
    { label: "9 AM", temp: 24, cond: "Cloudy", action: "Good window to apply fertiliser" },
    { label: "12 PM", temp: 26, cond: "Cloudy", action: "Clear field drains before the rain" },
    { label: "3 PM", temp: 25, cond: "Moderate rain", action: "Keep harvested grain covered" },
    { label: "6 PM", temp: 23, cond: "Heavy rain", action: "Move livestock to shelter" },
    { label: "9 PM", temp: 22, cond: "Heavy rain", action: "Check bunds for overflow" },
  ],
  tomorrow: [
    { label: "6 AM", temp: 21, cond: "Heavy rain", action: "Do not irrigate today" },
    { label: "9 AM", temp: 22, cond: "Heavy rain", action: "Avoid field work" },
    { label: "12 PM", temp: 23, cond: "Moderate rain", action: "Watch low patches for pooling" },
    { label: "3 PM", temp: 24, cond: "Light rain", action: "Check stems for lodging" },
    { label: "6 PM", temp: 22, cond: "Cloudy", action: "Open drains if water stands" },
  ],
  this_week: [
    { label: "Wed", temp: 26, cond: "Cloudy", action: "Last spray window this week" },
    { label: "Thu", temp: 22, cond: "Heavy rain", action: "No spraying or irrigation" },
    { label: "Fri", temp: 23, cond: "Moderate rain", action: "Drain standing water" },
    { label: "Sat", temp: 25, cond: "Light rain", action: "Scout for fungal spots" },
    { label: "Sun", temp: 27, cond: "Partly cloudy", action: "Resume normal field work" },
    { label: "Mon", temp: 28, cond: "Sunny", action: "Good day to spray" },
    { label: "Tue", temp: 28, cond: "Sunny", action: "Irrigate if topsoil is dry" },
  ],
};

const FORECAST_TABS = [
  ["today", "Today"],
  ["tomorrow", "Tomorrow"],
  ["this_week", "This Week"],
] as const;

// more_details tiles: same order, tints and category colours (dark-card variant) as DETAIL_TILES
const DETAILS = [
  { key: "humidity", label: "Humidity", icon: "wx-humidity.webp", tint: "#3B82F6", value: "88%", category: "Very High", badge: "#FCA5A5" },
  { key: "wind", label: "Wind", icon: "wx-wind.webp", tint: "#0EA5E9", value: "18 km/h", category: "Moderate", badge: "#F59E0B" },
  { key: "rainfall", label: "Rainfall", icon: "wx-rainfall.webp", tint: "#6366F1", value: "24 mm", category: "Heavy", badge: "#FCA5A5" },
  { key: "moisture", label: "Moisture", icon: "wx-moisture.webp", tint: "#8B5CF6", value: "42%", category: "Normal", badge: "#86EFAC" },
];

const COLLAPSED_ROWS = 4;

function Weather({ back, goToFlow }: ScreenProps) {
  const [tab, setTab] = useState<(typeof FORECAST_TABS)[number][0]>("today");
  const [expanded, setExpanded] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const isWeekly = tab === "this_week";
  const rows = FORECAST[tab];
  const visible = expanded ? rows : rows.slice(0, COLLAPSED_ROWS);
  const cols = isWeekly ? [s.colDay, s.colConditionWeek, s.colActionWeek] : [s.colTime, s.colCondition, s.colAction];

  return (
    <div className={`${s.screen} ${s.wx}`} style={{ backgroundImage: `url(${img("weather-bg.webp")})` }}>
      <div className={s.wxTopBar}>
        <button type="button" className={s.btnReset} onClick={back} aria-label="Back">
          <ArrowLeft size={28} />
        </button>
        <span className={s.wxTitle}>Weather Report</span>
        <button
          type="button"
          className={`${s.btnReset} ${s.speakHalo}`}
          onClick={() => setSpeaking((v) => !v)}
          aria-label={speaking ? "Stop" : "Listen"}
        >
          <span className={s.speakBtn}>{speaking ? <Square size={12} fill="#fff" /> : <SpeakerIcon size={16} color="#fff" />}</span>
        </button>
      </div>

      <div className={s.scroll}>
        <div className={s.wxScroll}>
          {/* LocationRow */}
          <div className={s.locRow}>
            <div className={s.locContent}>
              <span className={s.locPin}>
                <LocationPinIcon size={17} />
              </span>
              <span className={s.locName}>Hebbal, Bengaluru, Karnataka</span>
              <span className={s.changeLink}>
                Change <ChevronRight size={13} />
              </span>
            </div>
            <div className={s.todayRow}>
              <b>Today&apos;s</b>
              <span className={s.todayInfo}>
                <RainCloud />
                <span className={s.todayTemp}>24°C</span>
                <span className={s.todayCond}>Light rain</span>
              </span>
            </div>
          </div>

          {/* TopEventCard */}
          <div className={s.wxCard}>
            <p className={s.wxSectionTitle}>This week&apos;s major event</p>
            <div className={s.wxLine} />
            <div className={s.eventRow}>
              <span className={s.eventTile}>
                <StormCloud />
              </span>
              <span className={s.eventText}>
                <p className={s.eventHeadline}>HEAVY RAIN ON THURSDAY</p>
                <span className={s.eventBadge}>High alert</span>
                <span className={s.eventTime}>
                  <Clock size={18} color="#8396d3" /> Thu, 23 Oct • 2 PM – 9 PM
                </span>
              </span>
            </div>
            <div className={s.adviceBox}>
              <span className={s.adviceIcon}>
                <BulbIcon size={14} color="#fff" />
              </span>
              <p className={s.adviceText}>
                Up to 60 mm of rain is expected. Finish spraying and fertiliser by Wednesday, and open field drains so
                water does not stand around the roots.
              </p>
            </div>
          </div>

          {/* ActionCtaBanner */}
          <button
            type="button"
            className={`${s.btnReset} ${s.actionCta}`}
            style={{ backgroundImage: `url(${img("crop-check-hero.webp")})` }}
            onClick={() => goToFlow("crop-doctor", "select-crop")}
          >
            <span className={s.actionCtaBtn}>
              Check crop for disease
              <span className={s.actionCtaPlus}>
                <Plus size={12} strokeWidth={3} />
              </span>
            </span>
          </button>

          {/* HourlyForecastCard */}
          <div className={s.wxCard}>
            <p className={s.wxSectionTitle}>Forecast and Actions</p>
            <div className={s.tabStrip} role="tablist">
              {FORECAST_TABS.map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={key === tab}
                  className={`${s.btnReset} ${s.tabItem} ${key === tab ? s.tabItemActive : ""}`}
                  onClick={() => {
                    setTab(key);
                    setExpanded(false);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className={s.table}>
              <div className={s.tableHead}>
                <span className={cols[0]}>{isWeekly ? "Day" : "Time"}</span>
                <span className={cols[1]}>Condition</span>
                <span className={cols[2]} style={{ color: "inherit" }}>
                  Action
                </span>
              </div>
              {visible.map((r) => (
                <div key={r.label} className={s.tableRow}>
                  <span className={cols[0]}>{r.label}</span>
                  <span className={`${cols[1]} ${s.condCell}`}>
                    <span>{r.temp} °C</span>
                    <span>{r.cond}</span>
                  </span>
                  <span className={cols[2]}>{r.action}</span>
                </div>
              ))}
            </div>
            {rows.length > COLLAPSED_ROWS && (
              <button type="button" className={`${s.btnReset} ${s.expandBtn}`} onClick={() => setExpanded((v) => !v)}>
                {expanded ? "Show less" : "Show more"}
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
            {!isWeekly && (
              <>
                <div className={s.wxLine} />
                <p className={s.wxSectionTitle}>More weather details</p>
                <div className={s.detailGrid}>
                  {DETAILS.map((d) => (
                    <div key={d.key} className={s.detailTile}>
                      <span className={s.detailIcon} style={{ background: `${d.tint}1a` }}>
                        <img src={img(d.icon)} alt="" />
                      </span>
                      <span className={s.detailCol}>
                        <span className={s.detailLabel}>{d.label}</span>
                        <div className={s.detailValue} style={{ color: d.tint }}>
                          {d.value}
                        </div>
                        <div className={s.detailBadge} style={{ background: d.badge }}>
                          {d.category}
                        </div>
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* MoreForFarmSection */}
          <div className={s.moreFarm}>
            <p className={s.moreFarmTitle}>More for your Farm</p>
            <div className={s.moreFarmRow}>
              <button
                type="button"
                className={`${s.btnReset} ${s.moreFarmTile}`}
                style={{ backgroundImage: `url(${img("fm-farm-illustration.webp")})`, backgroundPosition: "84% 50%" }}
                onClick={() => goToFlow("farm-monitoring", "fm-q-grow")}
              >
                <span className={s.moreFarmLabel}>
                  Add my farm <ChevronRight size={18} />
                </span>
              </button>
              <button
                type="button"
                className={`${s.btnReset} ${s.moreFarmTile}`}
                style={{ backgroundImage: `url(${img("cg-report-hero.webp")})` }}
                onClick={() => goToFlow("crop-guide")}
              >
                <span className={s.moreFarmLabel}>
                  Add your Crop <ChevronRight size={18} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const homeWeatherScreens: Record<string, ComponentType<ScreenProps>> = {
  "k-home": Home,
  "k-weather": Weather,
};
