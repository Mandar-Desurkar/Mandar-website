"use client";

// Clock + calendar widget for the second page of the phone home screen, designed like the native iOS
// Calendar and World Clock widgets in Liquid Glass: weekday in red, a large 12-hour time, the city with
// its offset from the visitor ("5h 30m ahead of you"), and the month with weekends dimmed and today on
// a red disc. The site plays Mandar's phone, so it shows his time in Bangalore (IST), which also tells
// recruiters abroad when he's reachable. Tapping it opens Contact, as a calendar widget opens Calendar.
import { useSyncExternalStore } from "react";
import { useWindow } from "@/context/WindowContext";
import { profile } from "@/data/resume";
import styles from "./ClockWidget.module.css";

const TIME_ZONE = "Asia/Kolkata";
const IST_OFFSET_MIN = 330;
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

// One snapshot per minute: stable between renders, and null on the server so the markup matches
const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
};
const getMinute = () => Math.floor(Date.now() / 60000);
const getServerMinute = () => null;

const parts = (date: Date, options: Intl.DateTimeFormatOptions) =>
  Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, ...options }).formatToParts(date).map((p) => [p.type, p.value]));

// "5h 30m ahead of you" / "9h 30m behind you" / "Same time as you"
const offsetFromVisitor = (date: Date) => {
  const diff = IST_OFFSET_MIN + date.getTimezoneOffset();
  if (diff === 0) return "Same time as you";
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const span = [h && `${h}h`, m && `${m}m`].filter(Boolean).join(" ");
  return `${span} ${diff > 0 ? "ahead of" : "behind"} you`;
};

export default function ClockWidget() {
  const { openSection } = useWindow();
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);
  const city = profile.location.split(",")[0];

  if (minute === null) return <div className={styles.widget} aria-hidden="true" />;

  const now = new Date(minute * 60000);
  const { hour, minute: mm, dayPeriod } = parts(now, { hour: "numeric", minute: "2-digit", hour12: true });
  const { weekday, day, month, year } = parts(now, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const monthIndex = Number(parts(now, { month: "numeric" }).month) - 1;
  const firstWeekday = new Date(Date.UTC(Number(year), monthIndex, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(Number(year), monthIndex + 1, 0)).getUTCDate();
  const today = Number(day);
  const offset = offsetFromVisitor(now);

  return (
    <button
      type="button"
      className={styles.widget}
      aria-label={`${hour}:${mm} ${dayPeriod}, ${weekday} ${month} ${day} in ${city}, ${offset}. Schedule a chat.`}
      onClick={() => openSection("contact", "home_widget")}
    >
      <span className={styles.clock} aria-hidden="true">
        <span className={styles.weekday}>{weekday}</span>
        <span className={styles.time}>
          {hour}:{mm}
          <span className={styles.period}>{dayPeriod}</span>
        </span>
        <span className={styles.city}>{city}</span>
        <span className={styles.offset}>{offset}</span>
      </span>

      <span className={styles.calendar} aria-hidden="true">
        <span className={styles.month}>{month}</span>
        <span className={styles.grid}>
          {WEEKDAYS.map((d, i) => (
            <span key={`w${i}`} className={`${styles.dayName} ${i === 0 || i === 6 ? styles.weekend : ""}`}>
              {d}
            </span>
          ))}
          {Array.from({ length: firstWeekday }, (_, i) => (
            <span key={`e${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const col = (firstWeekday + i) % 7;
            const cls = i + 1 === today ? styles.today : col === 0 || col === 6 ? styles.weekend : undefined;
            return (
              <span key={i} className={cls}>
                {i + 1}
              </span>
            );
          })}
        </span>
      </span>
    </button>
  );
}
