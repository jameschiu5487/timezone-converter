import { useEffect, useState } from "react";

const timezoneRaw = Intl.supportedValuesOf("timeZone");

const TIMEZONE_COUNTRY_MAP = {
  "Asia/Jerusalem": "Israel",
  "Asia/Tokyo": "Japan",
  "Europe/Paris": "France",
  "America/New_York": "United States",
  "Asia/Taipei": "Taiwan",
  "Europe/London": "United Kingdom",
  "Europe/Istanbul": "Turkey",
  "America/Los_Angeles": "United States",
  "America/Chicago": "United States",
  "America/Denver": "United States",
  "America/Phoenix": "United States",
  "America/Anchorage": "United States",
  "America/Honolulu": "United States",
  "America/Detroit": "United States",
  "America/Indianapolis": "United States",
  "America/Louisville": "United States",
  "America/Atlanta": "United States",
  "America/Miami": "United States",
  "America/Boston": "United States",
  "America/Philadelphia": "United States",
  "America/Washington": "United States"
};

function getOffset(tz, date = new Date()) {
  try {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    });
    const parts = dtf.formatToParts(date);
    const offsetPart = parts.find(p => p.type === "timeZoneName");
    return offsetPart?.value.replace("GMT", "UTC") || "UTC";
  } catch {
    return "UTC";
  }
}

const timezoneData = timezoneRaw.map((tz) => {
  const city = tz.split("/").pop();
  let country = TIMEZONE_COUNTRY_MAP[tz];
  if (!country) {
    const region = tz.split("/")[0];
    country = region === "America" ? "United States" : region;
  }
  const label = `${tz.replace(city, country + "/" + city)} (${getOffset(tz)})`;
  return { label, value: tz };
});

function convertToTimezoneTime(year, month, day, hour, minute, baseZone, targetZone) {
  const inputDate = new Date(year, month - 1, day, hour, minute, 0, 0);
  const getTimezoneOffsetMs = (tz, date) => {
    const utc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const target = new Date(date.toLocaleString("en-US", { timeZone: tz }));
    return target.getTime() - utc.getTime();
  };
  const baseOffsetMs = getTimezoneOffsetMs(baseZone, inputDate);
  const targetOffsetMs = getTimezoneOffsetMs(targetZone, inputDate);
  const diffMs = targetOffsetMs - baseOffsetMs;
  const targetTime = new Date(inputDate.getTime() + diffMs);

  const formatDate = (d) =>
    `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}, ` +
    `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;

  return {
    baseLabel: getLabel(baseZone),
    targetLabel: getLabel(targetZone),
    baseTime: formatDate(inputDate),
    targetTime: formatDate(targetTime),
  };
}

function getLabel(value) {
  const match = timezoneData.find((z) => z.value === value);
  return match ? match.label : value;
}

export default function TimezoneConverter() {
  const [zones, setZones] = useState(["Asia/Taipei", "America/New_York", "Europe/London"]);
  const [baseZone, setBaseZone] = useState("");
  const [targetZone, setTargetZone] = useState("");
  const [date, setDate] = useState(new Date());
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [convertedTime, setConvertedTime] = useState(null);
  const [searchBase, setSearchBase] = useState("");
  const [searchTarget, setSearchTarget] = useState("");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const convertTime = () => {
    const result = convertToTimezoneTime(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      parseInt(hour),
      parseInt(minute),
      baseZone,
      targetZone
    );
    setConvertedTime(result);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">🌍 世界時區轉換器</h1>

      <div className="flex gap-2">
        <input
          list="timezones"
          className="flex-grow border px-3 py-2 rounded"
          placeholder="輸入國家/城市加入時區"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const match = timezoneData.find(z => z.label === e.currentTarget.value);
              if (match && !zones.includes(match.value)) {
                setZones([...zones, match.value]);
              }
              e.currentTarget.value = "";
            }
          }}
        />
        <datalist id="timezones">
          {timezoneData.map((z) => (
            <option key={z.value} value={z.label} />
          ))}
        </datalist>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {zones.map((zone) => {
          const localTime = new Intl.DateTimeFormat("en-US", {
            timeZone: zone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }).format(now);
          return (
            <div key={zone} className="border rounded shadow p-4">
              <div className="text-sm font-medium text-gray-600">{zone}</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{localTime}</div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">⏱️ 時間轉換工具</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            list="timezones"
            className="border px-3 py-2 rounded w-full"
            placeholder="現在時區"
            value={searchBase}
            onChange={(e) => {
              const input = e.target.value;
              setSearchBase(input);
              const match = timezoneData.find((z) => z.label === input);
              if (match) setBaseZone(match.value);
            }}
          />
          <input
            list="timezones"
            className="border px-3 py-2 rounded w-full"
            placeholder="想轉換的時區"
            value={searchTarget}
            onChange={(e) => {
              const input = e.target.value;
              setSearchTarget(input);
              const match = timezoneData.find((z) => z.label === input);
              if (match) setTargetZone(match.value);
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            className="border px-3 py-2 rounded w-full"
            value={date.toISOString().split("T")[0]}
            onChange={(e) => {
              const parts = e.target.value.split("-");
              setDate(new Date(parts[0], parts[1] - 1, parts[2]));
            }}
          />
          <div className="flex gap-2">
            <select
              className="border px-2 py-2 rounded"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
            >
              {[...Array(24).keys()].map((h) => (
                <option key={h} value={String(h).padStart(2, "0")}>{String(h).padStart(2, "0")}</option>
              ))}
            </select>
            <select
              className="border px-2 py-2 rounded"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
            >
              {[...Array(60).keys()].map((m) => (
                <option key={m} value={String(m).padStart(2, "0")}>{String(m).padStart(2, "0")}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-center">
          <button onClick={convertTime} className="bg-blue-600 text-white font-semibold px-8 py-2 rounded shadow">
            轉換
          </button>
        </div>

        {convertedTime && (
          <div className="bg-gray-100 rounded p-4 text-center font-medium space-y-1">
            <div>從 <strong>{convertedTime.baseLabel}</strong> 到 <strong>{convertedTime.targetLabel}</strong></div>
            <div>{convertedTime.baseLabel.split(" ")[0]} 時間：{convertedTime.baseTime}</div>
            <div>{convertedTime.targetLabel.split(" ")[0]} 時間：{convertedTime.targetTime}</div>
          </div>
        )}
      </div>
    </div>
  );
}
