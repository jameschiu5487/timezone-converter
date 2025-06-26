import { useEffect, useState } from "react";

const timezoneRaw = Intl.supportedValuesOf("timeZone");

// LocalStorage keys
const STORAGE_KEYS = {
  WORLD_CLOCK_ZONES: 'timezone-converter-world-zones',
  CONVERSION_SOURCE: 'timezone-converter-source',
  CONVERSION_TARGETS: 'timezone-converter-targets',
  CONVERSION_SEARCHES: 'timezone-converter-searches',
  LAST_DATE: 'timezone-converter-date',
  LAST_TIME: 'timezone-converter-time'
};

// LocalStorage helper functions
const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

const loadFromStorage = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

// Function to get current UTC offset for a timezone
function getCurrentUTCOffset(timezone, date = new Date()) {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(date);
    const offsetPart = parts.find(p => p.type === "timeZoneName");
    return offsetPart?.value.replace("GMT", "UTC") || "UTC+0";
  } catch {
    return "UTC+0";
  }
}

// Timezone to country/region mapping with dynamic UTC offset
const TIMEZONE_COUNTRY_MAP = {
  // Asia
  "Asia/Tokyo": "Asia/Japan/Tokyo",
  "Asia/Seoul": "Asia/South Korea/Seoul",
  "Asia/Shanghai": "Asia/China/Shanghai",
  "Asia/Hong_Kong": "Asia/Hong Kong/Hong Kong",
  "Asia/Taipei": "Asia/Taiwan/Taipei",
  "Asia/Singapore": "Asia/Singapore/Singapore",
  "Asia/Bangkok": "Asia/Thailand/Bangkok",
  "Asia/Jakarta": "Asia/Indonesia/Jakarta",
  "Asia/Manila": "Asia/Philippines/Manila",
  "Asia/Kuala_Lumpur": "Asia/Malaysia/Kuala Lumpur",
  "Asia/Kolkata": "Asia/India/Kolkata",
  "Asia/Karachi": "Asia/Pakistan/Karachi",
  "Asia/Dubai": "Asia/UAE/Dubai",
  "Asia/Tehran": "Asia/Iran/Tehran",
  "Asia/Jerusalem": "Asia/Israel/Jerusalem",
  "Asia/Istanbul": "Asia/Turkey/Istanbul",
  "Asia/Riyadh": "Asia/Saudi Arabia/Riyadh",
  "Asia/Yerevan": "Asia/Armenia/Yerevan",
  "Asia/Baku": "Asia/Azerbaijan/Baku",
  "Asia/Tbilisi": "Asia/Georgia/Tbilisi",
  "Asia/Almaty": "Asia/Kazakhstan/Almaty",
  "Asia/Tashkent": "Asia/Uzbekistan/Tashkent",
  "Asia/Bishkek": "Asia/Kyrgyzstan/Bishkek",
  "Asia/Dushanbe": "Asia/Tajikistan/Dushanbe",
  "Asia/Kabul": "Asia/Afghanistan/Kabul",
  "Asia/Dhaka": "Asia/Bangladesh/Dhaka",
  "Asia/Kathmandu": "Asia/Nepal/Kathmandu",
  "Asia/Colombo": "Asia/Sri Lanka/Colombo",
  "Asia/Yangon": "Asia/Myanmar/Yangon",
  "Asia/Phnom_Penh": "Asia/Cambodia/Phnom Penh",
  "Asia/Vientiane": "Asia/Laos/Vientiane",
  "Asia/Ho_Chi_Minh": "Asia/Vietnam/Ho Chi Minh",
  "Asia/Ulaanbaatar": "Asia/Mongolia/Ulaanbaatar",

  // Europe
  "Europe/London": "Europe/United Kingdom/London",
  "Europe/Paris": "Europe/France/Paris",
  "Europe/Berlin": "Europe/Germany/Berlin",
  "Europe/Rome": "Europe/Italy/Rome",
  "Europe/Madrid": "Europe/Spain/Madrid",
  "Europe/Amsterdam": "Europe/Netherlands/Amsterdam",
  "Europe/Brussels": "Europe/Belgium/Brussels",
  "Europe/Vienna": "Europe/Austria/Vienna",
  "Europe/Zurich": "Europe/Switzerland/Zurich",
  "Europe/Prague": "Europe/Czech Republic/Prague",
  "Europe/Budapest": "Europe/Hungary/Budapest",
  "Europe/Warsaw": "Europe/Poland/Warsaw",
  "Europe/Stockholm": "Europe/Sweden/Stockholm",
  "Europe/Oslo": "Europe/Norway/Oslo",
  "Europe/Copenhagen": "Europe/Denmark/Copenhagen",
  "Europe/Helsinki": "Europe/Finland/Helsinki",
  "Europe/Athens": "Europe/Greece/Athens",
  "Europe/Bucharest": "Europe/Romania/Bucharest",
  "Europe/Sofia": "Europe/Bulgaria/Sofia",
  "Europe/Kiev": "Europe/Ukraine/Kiev",
  "Europe/Minsk": "Europe/Belarus/Minsk",
  "Europe/Moscow": "Europe/Russia/Moscow",
  "Europe/Dublin": "Europe/Ireland/Dublin",
  "Europe/Lisbon": "Europe/Portugal/Lisbon",
  "Europe/Reykjavik": "Europe/Iceland/Reykjavik",

  // Americas
  "America/New_York": "America/United States/New York",
  "America/Chicago": "America/United States/Chicago",
  "America/Denver": "America/United States/Denver",
  "America/Los_Angeles": "America/United States/Los Angeles",
  "America/Phoenix": "America/United States/Phoenix",
  "America/Anchorage": "America/United States/Anchorage",
  "America/Honolulu": "America/United States/Honolulu",
  "America/Toronto": "America/Canada/Toronto",
  "America/Vancouver": "America/Canada/Vancouver",
  "America/Montreal": "America/Canada/Montreal",
  "America/Winnipeg": "America/Canada/Winnipeg",
  "America/Edmonton": "America/Canada/Edmonton",
  "America/Halifax": "America/Canada/Halifax",
  "America/St_Johns": "America/Canada/St Johns",
  "America/Mexico_City": "America/Mexico/Mexico City",
  "America/Tijuana": "America/Mexico/Tijuana",
  "America/Sao_Paulo": "America/Brazil/Sao Paulo",
  "America/Buenos_Aires": "America/Argentina/Buenos Aires",
  "America/Santiago": "America/Chile/Santiago",
  "America/Lima": "America/Peru/Lima",
  "America/Bogota": "America/Colombia/Bogota",
  "America/Caracas": "America/Venezuela/Caracas",
  "America/La_Paz": "America/Bolivia/La Paz",
  "America/Montevideo": "America/Uruguay/Montevideo",
  "America/Asuncion": "America/Paraguay/Asuncion",
  "America/Guyana": "America/Guyana/Georgetown",
  "America/Suriname": "America/Suriname/Paramaribo",
  "America/Cayenne": "America/French Guiana/Cayenne",

  // Africa
  "Africa/Cairo": "Africa/Egypt/Cairo",
  "Africa/Lagos": "Africa/Nigeria/Lagos",
  "Africa/Johannesburg": "Africa/South Africa/Johannesburg",
  "Africa/Nairobi": "Africa/Kenya/Nairobi",
  "Africa/Casablanca": "Africa/Morocco/Casablanca",
  "Africa/Algiers": "Africa/Algeria/Algiers",
  "Africa/Tunis": "Africa/Tunisia/Tunis",
  "Africa/Addis_Ababa": "Africa/Ethiopia/Addis Ababa",
  "Africa/Accra": "Africa/Ghana/Accra",
  "Africa/Kinshasa": "Africa/Congo/Kinshasa",

  // Oceania
  "Australia/Sydney": "Oceania/Australia/Sydney",
  "Australia/Melbourne": "Oceania/Australia/Melbourne",
  "Australia/Brisbane": "Oceania/Australia/Brisbane",
  "Australia/Perth": "Oceania/Australia/Perth",
  "Australia/Adelaide": "Oceania/Australia/Adelaide",
  "Australia/Darwin": "Oceania/Australia/Darwin",
  "Pacific/Auckland": "Oceania/New Zealand/Auckland",
  "Pacific/Fiji": "Oceania/Fiji/Suva",
  "Pacific/Honolulu": "Oceania/Hawaii/Honolulu",
  "Pacific/Guam": "Oceania/Guam/Hagatna",
  "Pacific/Port_Moresby": "Oceania/Papua New Guinea/Port Moresby",
  "Pacific/Noumea": "Oceania/New Caledonia/Noumea",
  "Pacific/Tahiti": "Oceania/French Polynesia/Tahiti",
};

// Generate timezone data with dynamic UTC offsets
const timezoneData = timezoneRaw.map((tz) => {
  const currentOffset = getCurrentUTCOffset(tz);
  
  // Use our improved display mapping if available
  if (TIMEZONE_COUNTRY_MAP[tz]) {
    return { 
      label: `${TIMEZONE_COUNTRY_MAP[tz]}(${currentOffset})`, 
      value: tz 
    };
  }
  
  // Fallback to original logic for unmapped timezones
  const city = tz.split("/").pop();
  const region = tz.split("/")[0];
  let country = region === "America" ? "United States" : region;
  
  const label = `${region}/${country}/${city}(${currentOffset})`;
  return { label, value: tz };
});

// Function to parse custom timezone input format
function parseTimezoneInput(input) {
  // Check if input matches our display format: Region/Country/City(UTC+X)
  const match = input.match(/^(.+?)\/(.+?)\/(.+?)\(UTC([+-]\d+(?::\d+)?)\)$/);
  if (match) {
    const [, region, country, city, offset] = match;
    
    // Try to find exact match in our timezone data
    const exactMatch = timezoneData.find(tz => tz.label === input);
    if (exactMatch) {
      return exactMatch.value;
    }
    
    // Try to find by searching for the city in the timezone identifiers
    const cityMatch = timezoneRaw.find(tz => {
      const tzCity = tz.split("/").pop().replace(/_/g, " ");
      const inputCity = city.replace(/_/g, " ");
      return tzCity.toLowerCase() === inputCity.toLowerCase() && tz.includes(region);
    });
    
    if (cityMatch) {
      return cityMatch;
    }
  }
  
  // Fallback: try to find partial matches
  const partialMatch = timezoneData.find(tz => 
    tz.label.toLowerCase().includes(input.toLowerCase()) ||
    tz.value.toLowerCase().includes(input.toLowerCase())
  );
  
  return partialMatch ? partialMatch.value : null;
}

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
  // Load saved settings from localStorage or use defaults
  const [zones, setZones] = useState(() => 
    loadFromStorage(STORAGE_KEYS.WORLD_CLOCK_ZONES, ["Asia/Taipei", "America/New_York", "Europe/London"])
  );
  const [sourceZone, setSourceZone] = useState(() => 
    loadFromStorage(STORAGE_KEYS.CONVERSION_SOURCE, "")
  );
  const [targetZones, setTargetZones] = useState(() => 
    loadFromStorage(STORAGE_KEYS.CONVERSION_TARGETS, [""])
  );
  const [searchSource, setSearchSource] = useState("");
  const [targetSearches, setTargetSearches] = useState(() => 
    loadFromStorage(STORAGE_KEYS.CONVERSION_SEARCHES, [""])
  );
  const [date, setDate] = useState(() => {
    const savedDate = loadFromStorage(STORAGE_KEYS.LAST_DATE, null);
    if (savedDate) return savedDate;
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  });
  const [hour, setHour] = useState(() => 
    loadFromStorage(STORAGE_KEYS.LAST_TIME, { hour: "12", minute: "00" }).hour
  );
  const [minute, setMinute] = useState(() => 
    loadFromStorage(STORAGE_KEYS.LAST_TIME, { hour: "12", minute: "00" }).minute
  );
  const [convertedTimes, setConvertedTimes] = useState([]);
  const [now, setNow] = useState(new Date());

  // Auto-save to localStorage when settings change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.WORLD_CLOCK_ZONES, zones);
  }, [zones]);

  useEffect(() => {
    if (sourceZone) {
      saveToStorage(STORAGE_KEYS.CONVERSION_SOURCE, sourceZone);
    }
  }, [sourceZone]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CONVERSION_TARGETS, targetZones);
  }, [targetZones]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CONVERSION_SEARCHES, targetSearches);
  }, [targetSearches]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.LAST_DATE, date);
  }, [date]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.LAST_TIME, { hour, minute });
  }, [hour, minute]);

  // Initialize search text from saved data
  useEffect(() => {
    if (sourceZone) {
      const sourceLabel = getLabel(sourceZone);
      setSearchSource(sourceLabel);
    }
  }, [sourceZone]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Clear all saved data function
  const clearAllSavedData = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    // Reset to defaults
    setZones(["Asia/Taipei", "America/New_York", "Europe/London"]);
    setSourceZone("");
    setTargetZones([""]);
    setSearchSource("");
    setTargetSearches([""]);
    const today = new Date();
    setDate(today.toISOString().split('T')[0]);
    setHour("12");
    setMinute("00");
    setConvertedTimes([]);
  };

  const addTargetZone = () => {
    if (targetZones.length < 5) {
      setTargetZones([...targetZones, ""]);
      setTargetSearches([...targetSearches, ""]);
    }
  };

  const removeTargetZone = (index) => {
    if (targetZones.length > 1) {
      const newTargetZones = targetZones.filter((_, i) => i !== index);
      const newTargetSearches = targetSearches.filter((_, i) => i !== index);
      setTargetZones(newTargetZones);
      setTargetSearches(newTargetSearches);
    }
  };

  const updateSourceZone = (value) => {
    setSearchSource(value);
    // Try to find exact match first
    const exactMatch = timezoneData.find((z) => z.label === value);
    if (exactMatch) {
      setSourceZone(exactMatch.value);
    } else {
      // Try to parse custom input format
      const parsedZone = parseTimezoneInput(value);
      if (parsedZone) {
        setSourceZone(parsedZone);
      }
    }
  };

  const updateTargetZone = (index, value) => {
    const newTargetSearches = [...targetSearches];
    newTargetSearches[index] = value;
    setTargetSearches(newTargetSearches);

    // Try to find exact match first
    const exactMatch = timezoneData.find((z) => z.label === value);
    if (exactMatch) {
      const newTargetZones = [...targetZones];
      newTargetZones[index] = exactMatch.value;
      setTargetZones(newTargetZones);
    } else {
      // Try to parse custom input format
      const parsedZone = parseTimezoneInput(value);
      if (parsedZone) {
        const newTargetZones = [...targetZones];
        newTargetZones[index] = parsedZone;
        setTargetZones(newTargetZones);
      }
    }
  };

  const convertTime = () => {
    if (!sourceZone) return;
    
    const dateObj = new Date(date + 'T00:00:00'); // Parse as local date
    const results = targetZones
      .filter(zone => zone) // Only process non-empty target zones
      .map(targetZone => {
        return convertToTimezoneTime(
          dateObj.getFullYear(),
          dateObj.getMonth() + 1,
          dateObj.getDate(),
          parseInt(hour),
          parseInt(minute),
          sourceZone,
          targetZone
        );
      });
    
    setConvertedTimes(results);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-center flex-grow">🌍 World Timezone Converter</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-green-600">💾 Auto-saved</span>
          <button 
            onClick={clearAllSavedData}
            className="bg-gray-500 text-white text-sm px-3 py-1 rounded hover:bg-gray-600"
            title="Clear all saved preferences"
          >
            🗑️ Clear Memory
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          list="timezones"
          className="flex-grow border px-3 py-2 rounded"
          placeholder="Enter timezone (e.g., Asia/Taiwan/Taipei(UTC+8))"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const input = e.currentTarget.value;
              let match = timezoneData.find(z => z.label === input);
              
              if (!match) {
                const parsedZone = parseTimezoneInput(input);
                if (parsedZone) {
                  match = { value: parsedZone, label: getLabel(parsedZone) };
                }
              }
              
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
          
          const displayName = getLabel(zone);
          const shortName = displayName.split('(')[0]; // Get part before (UTC+X)
          
          return (
            <div key={zone} className="border rounded shadow p-4 relative">
              <button 
                onClick={() => setZones(zones.filter(z => z !== zone))}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm"
              >
                ✕
              </button>
              <div className="text-sm font-medium text-gray-600 pr-6">{shortName}</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{localTime}</div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border rounded shadow space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">⏱️ Time Conversion Tool</h2>
          {targetZones.length < 5 && (
            <button 
              onClick={addTargetZone}
              className="bg-green-600 text-white font-semibold px-4 py-1 rounded text-sm hover:bg-green-700"
            >
              + Add Target Zone
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Source Timezone */}
          <div className="border rounded p-4 bg-blue-50">
            <h3 className="font-medium mb-3 text-blue-800">Source Timezone</h3>
            <input
              list="timezones"
              className="border px-3 py-2 rounded w-full"
              placeholder="From timezone (e.g., Asia/Taiwan/Taipei(UTC+8))"
              value={searchSource}
              onChange={(e) => updateSourceZone(e.target.value)}
            />
          </div>

          {/* Target Timezones */}
          <div className="border rounded p-4 bg-green-50">
            <h3 className="font-medium mb-3 text-green-800">Target Timezones</h3>
            <div className="space-y-3">
              {targetZones.map((targetZone, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    list="timezones"
                    className="border px-3 py-2 rounded flex-grow"
                    placeholder={`To timezone ${index + 1} (e.g., America/United States/New York(UTC-5))`}
                    value={targetSearches[index]}
                    onChange={(e) => updateTargetZone(index, e.target.value)}
                  />
                  {targetZones.length > 1 && (
                    <button 
                      onClick={() => removeTargetZone(index)}
                      className="text-red-500 hover:text-red-700 px-2 py-1 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            className="border px-3 py-2 rounded w-full"
            value={date}
            onChange={handleDateChange}
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
          <button 
            onClick={convertTime} 
            className="bg-blue-600 text-white font-semibold px-8 py-2 rounded shadow hover:bg-blue-700"
            disabled={!sourceZone}
          >
            Convert Time
          </button>
        </div>

        {convertedTimes.length > 0 && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-center mb-4">
              Converting from <span className="text-blue-600">{getLabel(sourceZone).split('(')[0]}</span>
            </div>
            {convertedTimes.map((result, index) => (
              <div key={index} className="bg-gray-100 rounded p-4 text-center font-medium space-y-1">
                <div className="text-green-600 font-semibold">Target {index + 1}: {result.targetLabel.split('(')[0]}</div>
                <div className="text-blue-600">Source Time: {result.baseTime}</div>
                <div className="text-green-600">Target Time: {result.targetTime}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
