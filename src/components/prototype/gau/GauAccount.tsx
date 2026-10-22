/* eslint-disable @next/next/no-img-element -- fixed-size mock screens inside a phone frame */
"use client";

// Gau Sampurna Account, recreated from the `prod` branch: account/account-screen.jsx (profile header
// with plan tag, quick actions, Shop & Activity, Support & Legal, App update row, log out),
// profile-screen.jsx, home/notifications/notification-screen.jsx, account/language-screen.jsx
// (helpers/languages.js), address/address-screen.jsx, account/about-screen.jsx and contact-screen.jsx.
import { useState, type ComponentType, type ReactNode } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Box,
  Camera,
  ChevronRight,
  Crown,
  Eye,
  Gavel,
  Headphones,
  Home,
  Info,
  Languages,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Shield,
  Trash2,
  User,
  Zap,
  HeartHandshake,
  Download,
} from "lucide-react";
import a from "./gauAccount.module.css";
import { GauAlert, gimg, u, useToast } from "./GauShared";
import { ADDRESSES } from "./GauShop";
import type { ScreenProps } from "../kissan/KissanScreens";

function Header({ title, onBack, right }: { title: string; onBack: () => void; right?: ReactNode }) {
  return (
    <div className={a.header}>
      <button type="button" className={`${u.btnReset} ${a.icon}`} onClick={onBack} aria-label="Back">
        <ArrowLeft size={22} />
      </button>
      <b>{title}</b>
      <span className={a.icon}>{right}</span>
    </div>
  );
}

function MenuItem({ icon, bg, label, onClick, last }: { icon: ReactNode; bg: string; label: string; onClick: () => void; last?: boolean }) {
  return (
    <button type="button" className={`${u.btnReset} ${a.menuItem} ${last ? a.last : ""}`} onClick={onClick}>
      <i style={{ background: bg }}>{icon}</i>
      <span>{label}</span>
      <ChevronRight size={18} color="#94A3B8" />
    </button>
  );
}

// ---------- Account (account-screen.jsx) ----------

function Account({ go, goToFlow }: ScreenProps) {
  const [logout, setLogout] = useState(false);
  const toast = useToast();
  return (
    <div className={`${u.screen} ${a.grey} ${a.poppins}`}>
      <div className={a.profileHeader}>
        <span className={a.refreshRow}>
          <button type="button" className={`${u.btnReset} ${a.icon}`} onClick={() => toast.show("Cows and subscription updated.")} aria-label="Refresh">
            <RefreshCw size={20} color="#64748B" />
          </button>
        </span>
        <div className={a.profileRow}>
          <button type="button" className={`${u.btnReset} ${a.avatar}`} onClick={() => go("gs-profile")} aria-label="Edit profile">
            <span>MD</span>
            <i>
              <Pencil size={11} color="#fff" />
            </i>
          </button>
          <span className={a.details}>
            <b>Mandar D</b>
            <small>+91 98XXXXXX21</small>
            <span className={a.meta}>
              <span>
                <Home size={14} /> No Farm
              </span>
              <i />
              <span className={a.metaOn}>🐄 3 Cows</span>
            </span>
            <button type="button" className={`${u.btnReset} ${a.planTag}`} onClick={() => goToFlow("gs-pratham")}>
              <BadgeCheck size={12} /> FREE PLAN
            </button>
          </span>
        </div>
      </div>
      <div className={`${u.scroll} ${a.body}`}>
        <div className={a.quick}>
          {[
            [<User key="u" size={18} color="#004691" />, "#E8F5E9", "Edit Profile", "gs-profile"],
            [<Languages key="l" size={18} color="#1E88E5" />, "#E3F2FD", "English", "gs-language"],
            [<MapPin key="m" size={18} color="#FB8C00" />, "#FFF3E0", "Address", "gs-addresses"],
          ].map(([icon, bg, label, screen]) => (
            <button key={label as string} type="button" className={`${u.btnReset} ${a.quickCard}`} onClick={() => go(screen as string)}>
              <i style={{ background: bg as string }}>{icon}</i>
              {label as string}
            </button>
          ))}
        </div>
        <span className={a.sectionTitle}>Shop &amp; Activity</span>
        <div className={a.section}>
          <MenuItem icon={<Box size={18} color="#475569" />} bg="#F3F4F6" label="My Orders" onClick={() => goToFlow("gs-shop", "gs-orders")} />
          <MenuItem icon={<Crown size={18} color="#F59E0B" />} bg="#FFFBEB" label="Subscriptions" onClick={() => goToFlow("gs-pratham")} last />
        </div>
        <span className={a.sectionTitle}>Support &amp; Legal</span>
        <div className={a.section}>
          <MenuItem icon={<Headphones size={16} color="#3B82F6" />} bg="#EFF6FF" label="Help & Support" onClick={() => go("gs-contact")} />
          <MenuItem icon={<Info size={18} color="#475569" />} bg="#F3F4F6" label="About Us" onClick={() => go("gs-about")} />
          <MenuItem icon={<Gavel size={18} color="#94A3B8" />} bg="#F3F4F6" label="Terms and Conditions" onClick={() => toast.show("Opens gausampurna.com/terms")} />
          <MenuItem icon={<Shield size={18} color="#94A3B8" />} bg="#F3F4F6" label="Privacy Policy" onClick={() => toast.show("Opens gausampurna.com/privacy")} last />
        </div>
        <span className={a.sectionTitle}>App</span>
        <div className={a.section}>
          <div className={a.updateRow}>
            <i style={{ background: "#ECFDF5" }}>
              <Download size={18} color="#16A34A" />
            </i>
            <span>
              <b>App update available</b>
              <small>Get the latest features and fixes</small>
            </span>
            <button type="button" className={`${u.btnReset} ${a.updateBtn}`} onClick={() => toast.show("Opens the Play Store")}>
              Update
            </button>
          </div>
        </div>
        <button type="button" className={`${u.btnReset} ${a.logout}`} onClick={() => setLogout(true)}>
          <LogOut size={18} /> Log Out
        </button>
        <small className={a.version}>Gau Sampurna · v12.3.0</small>
      </div>
      {logout && (
        <GauAlert
          title="Log Out"
          message="Are you sure you want to log out?"
          actions={[
            { label: "Cancel", onPress: () => setLogout(false) },
            { label: "Log Out", onPress: () => goToFlow("gs-welcome", "gs-login"), primary: true },
          ]}
        />
      )}
      {toast.node}
    </div>
  );
}

// ---------- Profile (profile-screen.jsx) ----------

function Profile({ back }: ScreenProps) {
  const toast = useToast();
  return (
    <div className={`${u.screen} ${a.grey} ${a.poppins}`}>
      <Header title="Edit Profile" onBack={back} />
      <div className={`${u.scroll} ${a.formBody}`}>
        <div className={a.photo}>
          <span className={a.bigAvatar}>
            MD
            <i>
              <Camera size={14} color="#fff" />
            </i>
          </span>
          <small>Tap to change photo</small>
        </div>
        <div className={a.formCard}>
          <label>
            Full Name
            <input defaultValue="Mandar D" />
          </label>
          <label>
            Phone Number
            <input defaultValue="+91 98XXXXXX21" disabled />
            <small>
              To change your number, <b>Contact Support</b>
            </small>
          </label>
          <label>
            Email
            <input defaultValue="" placeholder="you@example.com" type="email" />
          </label>
        </div>
      </div>
      <div className={u.footer}>
        <button type="button" className={`${u.btnReset} ${u.primary} ${u.hotspot} ${a.saveBtn}`} onClick={() => toast.show("Profile updated")}>
          Save Changes
        </button>
      </div>
      {toast.node}
    </div>
  );
}

// ---------- Notifications (notification-screen.jsx) ----------

const NOTES = [
  { title: "Gowri's report is ready", body: "1 condition needs a vet. Tap to see what to do next.", time: "2h ago", read: false, image: "gowri-avatar.jpg", flow: "disease-check", screen: "gs-diagnosis" },
  { title: "Your order is confirmed", body: "Dairy Fortune 10 kg arrives by Sunday.", time: "5h ago", read: false, image: "prod-dairy-fortune.webp", flow: "gs-shop", screen: "gs-order-details" },
  { title: "Weekly dung scan due", body: "A weekly dung scan catches feed problems before milk drops.", time: "1d ago", read: true, image: "dung-sample.webp", flow: "dung-scan", screen: "gs-hub-dung" },
  { title: "New buyer interest", body: "2 farmers viewed your HF Crossbreed listing.", time: "3d ago", read: true, image: "trade-cow1.webp", flow: "gs-trading", screen: "gs-cattle-details" },
];

function Notifications({ back, goToFlow }: ScreenProps) {
  const [notes, setNotes] = useState(NOTES);
  const unread = notes.some((n) => !n.read);
  return (
    <div className={`${u.screen} ${a.grey}`}>
      <Header title="Notifications" onBack={back} />
      {unread && (
        <button type="button" className={`${u.btnReset} ${a.markAll}`} onClick={() => setNotes((ns) => ns.map((n) => ({ ...n, read: true })))}>
          Mark all read
        </button>
      )}
      <div className={`${u.scroll} ${a.noteList}`}>
        {notes.map((n, i) => (
          <button
            key={n.title}
            type="button"
            className={`${u.btnReset} ${a.note} ${n.read ? "" : a.unread} ${i === 0 ? u.hotspot : ""}`}
            onClick={() => goToFlow(n.flow, n.screen)}
          >
            <img src={gimg(n.image)} alt="" />
            <span>
              <b>{n.title}</b>
              <small>{n.body}</small>
              <em>{n.time}</em>
            </span>
            {!n.read && <i className={a.unreadDot} />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Language (language-screen.jsx) ----------

export const LANGUAGES: [string, string][] = [
  ["English", "English"],
  ["हिन्दी", "Hindi"],
  ["ಕನ್ನಡ", "Kannada"],
  ["தமிழ்", "Tamil"],
  ["తెలుగు", "Telugu"],
  ["मराठी", "Marathi"],
  ["മലയാളം", "Malayalam"],
  ["ગુજરાતી", "Gujarati"],
  ["বাংলা", "Bengali"],
  ["ଓଡ଼ିଆ", "Odia"],
  ["ਪੰਜਾਬੀ", "Punjabi"],
];

export function LanguageList({ onContinue, onBack }: { onContinue: () => void; onBack?: () => void }) {
  const [sel, setSel] = useState("English");
  return (
    <div className={u.screen}>
      <div className={a.header}>
        {onBack ? (
          <button type="button" className={`${u.btnReset} ${a.icon}`} onClick={onBack} aria-label="Back">
            <ArrowLeft size={22} />
          </button>
        ) : (
          <span className={a.icon} />
        )}
      </div>
      <div className={a.langHead}>
        <b>Choose your language</b>
        <small>You can change this anytime in settings.</small>
      </div>
      <div className={`${u.scroll} ${a.langList}`}>
        {LANGUAGES.map(([name, native]) => (
          <button key={native} type="button" className={`${u.btnReset} ${a.langRow} ${sel === native ? a.langOn : ""}`} onClick={() => setSel(native)}>
            <span>
              <b>{name}</b>
              <small>{native}</small>
            </span>
            <i className={a.radio}>{sel === native && <i />}</i>
          </button>
        ))}
      </div>
      <div className={u.footer}>
        <button type="button" className={`${u.btnReset} ${u.primary} ${u.hotspot}`} onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}

function Language({ back }: ScreenProps) {
  return <LanguageList onBack={back} onContinue={back} />;
}

// ---------- Saved addresses (address-screen.jsx) ----------

function Addresses({ back, goToFlow }: ScreenProps) {
  const [list, setList] = useState(ADDRESSES);
  const [del, setDel] = useState<string | null>(null);
  const toast = useToast();
  return (
    <div className={`${u.screen} ${a.grey}`}>
      <Header title="Saved Addresses" onBack={back} />
      <div className={`${u.scroll} ${a.addrList}`}>
        <small className={a.count}>{list.length} saved</small>
        {list.map((ad) => (
          <div key={ad.id} className={a.addrCard}>
            <span className={a.addrTop}>
              <b>
                <MapPin size={16} color="#004691" /> {ad.tag}
              </b>
              {ad.isDefault && <em>Default</em>}
            </span>
            <small>
              {ad.name} · {ad.phone}
            </small>
            <small>
              {ad.line}, {ad.place}
            </small>
            <span className={a.addrActions}>
              <button type="button" className={u.btnReset} onClick={() => goToFlow("gs-shop", "gs-address-add")}>
                <Pencil size={14} /> Edit
              </button>
              <button type="button" className={`${u.btnReset} ${a.delete}`} onClick={() => setDel(ad.id)}>
                <Trash2 size={14} /> Delete
              </button>
            </span>
          </div>
        ))}
      </div>
      <div className={u.footer}>
        <button type="button" className={`${u.btnReset} ${u.primary}`} onClick={() => goToFlow("gs-shop", "gs-address-map")}>
          <Plus size={18} /> Add Address
        </button>
      </div>
      {del && (
        <GauAlert
          title="Delete Address"
          message="Are you sure you want to delete this address?"
          actions={[
            { label: "Cancel", onPress: () => setDel(null) },
            {
              label: "Delete",
              primary: true,
              onPress: () => {
                setList((l) => l.filter((x) => x.id !== del));
                setDel(null);
                toast.show("Address deleted successfully");
              },
            },
          ]}
        />
      )}
      {toast.node}
    </div>
  );
}

// ---------- About (about-screen.jsx) ----------

function About({ back }: ScreenProps) {
  return (
    <div className={u.screen}>
      <Header title="About Us" onBack={back} />
      <div className={`${u.scroll} ${a.about}`}>
        <img src={gimg("about-us.webp")} alt="" className={a.aboutHero} />
        <section>
          <h3>About Us</h3>
          <p>Gau Sampurna is dedicated to empowering dairy farmers with technology-driven solutions for better cattle health and farm productivity.</p>
        </section>
        <section className={a.vision}>
          <span className={a.visionHead}>
            <i>
              <Eye size={18} color="#004691" />
            </i>
            <b>Our Vision</b>
          </span>
          <p>To become the most trusted partner for dairy farmers by combining traditional wisdom with modern technology.</p>
        </section>
        <section>
          <h3>Products &amp; Solutions</h3>
          <b className={a.subLabel}>Our Brands</b>
          <p>We offer a range of products and digital tools designed to improve cattle nutrition, health monitoring, and farm management.</p>
        </section>
        <section>
          <h3>Why Choose Us</h3>
          {[
            [Zap, "Innovation: ", "AI-powered diagnostics and smart farm tools."],
            [HeartHandshake, "Practical Impact: ", "Real results for real farmers, every day."],
            [Headphones, "Customer Support: ", "Dedicated help in your language, when you need it."],
          ].map(([Icon, label, text]) => {
            const I = Icon as typeof Zap;
            return (
              <p key={label as string} className={a.feature}>
                <I size={16} color="#004691" />
                <span>
                  <b>{label as string}</b>
                  {text as string}
                </span>
              </p>
            );
          })}
        </section>
        <section>
          <h3>Founder&apos;s Note</h3>
          <p>At Silo Fortune India Pvt Ltd, we are committed to bringing innovation and sustainability to dairy farming across India.</p>
          <b className={a.tagline}>Join us on this journey.</b>
        </section>
        <img src={gimg("full-logo.webp")} alt="Gau Sampurna" className={a.footerLogo} />
      </div>
    </div>
  );
}

// ---------- Help & Support (contact-screen.jsx) ----------

function Contact({ back }: ScreenProps) {
  const toast = useToast();
  return (
    <div className={`${u.screen} ${a.grey}`}>
      <Header title="Help & Support" onBack={back} />
      <div className={`${u.scroll} ${a.contact}`}>
        <div className={a.supportHero}>
          <Headphones size={34} color="#004691" />
          <b>Customer Support</b>
          <small>Available Mon–Sat, 9 AM – 6 PM</small>
        </div>
        {[
          [Phone, "#004691", "Toll-free number", "Call us", "Opens the dialler"],
          [Mail, "#EA580C", "Email us", "Write to support", "Opens your email app"],
          [MessageCircle, "#25D366", "WhatsApp", "Chat with us", "Opens WhatsApp"],
        ].map(([Icon, color, label, sub, msg], i) => {
          const I = Icon as typeof Phone;
          return (
            <button key={label as string} type="button" className={`${u.btnReset} ${a.contactRow} ${i === 0 ? u.hotspot : ""}`} onClick={() => toast.show(msg as string)}>
              <i style={{ background: `${color}18` }}>
                <I size={20} color={color as string} />
              </i>
              <span>
                <b>{label as string}</b>
                <small>{sub as string}</small>
              </span>
              <ChevronRight size={18} color="#94A3B8" />
            </button>
          );
        })}
        <p className={a.helpText}>For urgent issues, please call our toll-free number. For general queries, email or WhatsApp us and we&apos;ll get back to you.</p>
      </div>
      {toast.node}
    </div>
  );
}

export const gauAccountScreens: Record<string, ComponentType<ScreenProps>> = {
  "gs-account": Account,
  "gs-profile": Profile,
  "gs-notifications": Notifications,
  "gs-language": Language,
  "gs-addresses": Addresses,
  "gs-about": About,
  "gs-contact": Contact,
};
