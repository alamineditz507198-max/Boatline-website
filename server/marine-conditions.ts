import { Router, type IRouter } from "express";

const router: IRouter = Router();

const USER_AGENT =
  process.env["MARINE_DATA_USER_AGENT"] ??
  "Lyman Marine live marine conditions (NOAA/NWS data)";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org";
const NWS_URL = "https://api.weather.gov";
const NOAA_TIDES_URL = "https://api.tidesandcurrents.noaa.gov";
const CACHE_TTL_MS = 30 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 12_000;

type JsonRecord = Record<string, any>;
type LocationResult = {
  name: string;
  label: string;
  state?: string;
  latitude: number;
  longitude: number;
};
type TideStation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

let tideStationsCache: { expiresAt: number; stations: TideStation[] } | null =
  null;

function jsonHeaders(extra: Record<string, string> = {}) {
  return {
    Accept: "application/json",
    "User-Agent": USER_AGENT,
    ...extra,
  };
}

async function fetchJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  const signal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const response = await fetch(url, {
    ...init,
    signal,
    headers: {
      ...jsonHeaders(),
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Upstream returned ${response.status} for ${url}`);
  }

  return (await response.json()) as T;
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function textOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function milesBetween(lat1: number, lon1: number, lat2: number, lon2: number) {
  const radius = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function normalizeLocation(item: JsonRecord): LocationResult | null {
  const latitude = Number(item.lat);
  const longitude = Number(item.lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  const address = item.address ?? {};
  const name =
    textOrNull(address.city) ??
    textOrNull(address.town) ??
    textOrNull(address.village) ??
    textOrNull(address.municipality) ??
    textOrNull(item.name) ??
    "Selected location";
  const state = textOrNull(address.state) ?? undefined;
  const label =
    state && !name.toLowerCase().includes(state.toLowerCase())
      ? `${name}, ${state}`
      : name;

  return { name, label, state, latitude, longitude };
}

async function geocode(query: string): Promise<LocationResult | null> {
  const params = new URLSearchParams({
    format: "jsonv2",
    addressdetails: "1",
    countrycodes: "us",
    limit: "5",
    q: query,
  });
  const results = await fetchJson<JsonRecord[]>(
    `${NOMINATIM_URL}/search?${params.toString()}`,
  );
  return results.map(normalizeLocation).find(Boolean) ?? null;
}

async function geocodeMany(query: string): Promise<LocationResult[]> {
  const params = new URLSearchParams({
    format: "jsonv2",
    addressdetails: "1",
    countrycodes: "us",
    limit: "6",
    q: query,
  });
  const results = await fetchJson<JsonRecord[]>(
    `${NOMINATIM_URL}/search?${params.toString()}`,
  );
  return results
    .map(normalizeLocation)
    .filter((item): item is LocationResult => item !== null);
}

async function getTideStations(): Promise<TideStation[]> {
  if (tideStationsCache && tideStationsCache.expiresAt > Date.now()) {
    return tideStationsCache.stations;
  }

  const data = await fetchJson<JsonRecord>(
    `${NOAA_TIDES_URL}/mdapi/prod/webapi/stations.json?type=waterlevels&units=english`,
  );
  const stations = (data.stations ?? [])
    .map((station: JsonRecord) => ({
      id: textOrNull(station.id),
      name: textOrNull(station.name),
      lat: Number(station.lat),
      lng: Number(station.lng),
    }))
    .filter(
      (station: TideStation): station is TideStation =>
        Boolean(station.id && station.name) &&
        Number.isFinite(station.lat) &&
        Number.isFinite(station.lng),
    );
  tideStationsCache = { expiresAt: Date.now() + CACHE_TTL_MS, stations };
  return stations;
}

function nearestStation(
  stations: TideStation[],
  latitude: number,
  longitude: number,
) {
  return stations
    .map((station) => ({
      station,
      distance: milesBetween(latitude, longitude, station.lat, station.lng),
    }))
    .sort((a, b) => a.distance - b.distance)[0];
}

function dateStamp(date: Date) {
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");
  return `${year}${month}${day}`;
}

function toFahrenheit(value: unknown, unit: unknown) {
  const number = numberOrNull(value);
  if (number === null) return null;
  return unit === "C" ? (number * 9) / 5 + 32 : number;
}

function toMph(value: unknown, unit: unknown) {
  const number = numberOrNull(value);
  if (number === null) return null;
  if (unit === "km_h-1") return number * 0.621371;
  if (unit === "m_s-1") return number * 2.23694;
  if (unit === "kn") return number * 1.15078;
  return number;
}

function toFeet(value: unknown, unit: unknown) {
  const number = numberOrNull(value);
  if (number === null) return null;
  if (unit === "m") return number * 3.28084;
  return number;
}

function parseWindSpeed(value: unknown) {
  const text = textOrNull(value);
  if (!text) return null;
  const match = text.match(/([\d.]+)\s*(?:to\s*([\d.]+))?\s*([a-z/]+)/i);
  if (!match) return null;
  const first = Number(match[1]);
  const second = match[2] ? Number(match[2]) : null;
  const unit = match[3].toLowerCase();
  const convert = (number: number) =>
    unit.startsWith("km") ? number * 0.621371 : unit.startsWith("knot") ? number * 1.15078 : number;
  const low = convert(first);
  const high = second === null ? null : convert(second);
  return {
    value: Math.round((high ?? low) * 10) / 10,
    range: high === null ? null : `${Math.round(low)}–${Math.round(high)}`,
    unit: "mph",
  };
}

function parseIsoInterval(value: string) {
  const [start, duration] = value.split("/");
  const startTime = Date.parse(start);
  if (!Number.isFinite(startTime)) return null;
  const durationMatch = duration?.match(
    /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?)?$/,
  );
  if (!durationMatch) return { start: startTime, end: Number.POSITIVE_INFINITY };
  const milliseconds =
    (Number(durationMatch[1] ?? 0) * 24 * 60 * 60 +
      Number(durationMatch[2] ?? 0) * 60 * 60 +
      Number(durationMatch[3] ?? 0) * 60 +
      Number(durationMatch[4] ?? 0)) *
    1000;
  return { start: startTime, end: startTime + milliseconds };
}

function currentGridValue(grid: JsonRecord | undefined) {
  const values = Array.isArray(grid?.values) ? grid.values : [];
  const now = Date.now();
  const active = values.find((item: JsonRecord) => {
    const interval = parseIsoInterval(String(item.validTime ?? ""));
    return interval && now >= interval.start && now <= interval.end;
  });
  return active ?? values[0] ?? null;
}

function formatDirection(degrees: unknown) {
  const value = numberOrNull(degrees);
  if (value === null) return null;
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(value / 45) % 8];
}

function firstNumber(value: unknown) {
  return numberOrNull(value) ?? null;
}

async function getTideData(
  latitude: number,
  longitude: number,
): Promise<JsonRecord | null> {
  try {
    const stations = await getTideStations();
    const match = nearestStation(stations, latitude, longitude);
    if (!match || match.distance > 180) return null;

    const today = new Date();
    const tomorrow = new Date(today.getTime() + 48 * 60 * 60 * 1000);
    const params = new URLSearchParams({
      product: "predictions",
      application: "lyman_marine",
      begin_date: dateStamp(today),
      end_date: dateStamp(tomorrow),
      datum: "MLLW",
      station: match.station.id,
      time_zone: "lst_ldt",
      units: "english",
      interval: "hilo",
      format: "json",
    });
    const [tides, waterTemperature] = await Promise.all([
      fetchJson<JsonRecord>(
        `${NOAA_TIDES_URL}/api/prod/datagetter?${params.toString()}`,
      ).catch(() => null),
      fetchJson<JsonRecord>(
        `${NOAA_TIDES_URL}/api/prod/datagetter?${new URLSearchParams({
          product: "water_temperature",
          application: "lyman_marine",
          date: "latest",
          station: match.station.id,
          time_zone: "lst_ldt",
          units: "english",
          format: "json",
        }).toString()}`,
      ).catch(() => null),
    ]);

    const predictions = (tides?.predictions ?? [])
      .map((item: JsonRecord) => ({
        type: textOrNull(item.type),
        time: textOrNull(item.t),
        heightFt: firstNumber(item.v),
      }))
      .filter((item: JsonRecord) => item.time && item.type);
    const now = Date.now();
    const nextHigh =
      predictions.find(
        (item: JsonRecord) => item.type === "H" && Date.parse(item.time) > now,
      ) ?? null;
    const nextLow =
      predictions.find(
        (item: JsonRecord) => item.type === "L" && Date.parse(item.time) > now,
      ) ?? null;
    const phase =
      nextHigh && nextLow
        ? Date.parse(nextHigh.time) < Date.parse(nextLow.time)
          ? "Rising toward high"
          : "Falling toward low"
        : null;
    const tempReading = waterTemperature?.data?.find(
      (item: JsonRecord) => item.v !== null && item.v !== "",
    );

    return {
      stationName: match.station.name,
      distanceMiles: Math.round(match.distance),
      phase,
      nextHigh,
      nextLow,
      waterTemperatureF: toFahrenheit(tempReading?.v, "F"),
      source: "NOAA CO-OPS",
    };
  } catch {
    return null;
  }
}

function ratingFor(data: {
  windMph: number | null;
  waveHeightFt: number | null;
  precipitationChance: number | null;
  alerts: JsonRecord[];
}) {
  const reasons: string[] = [];
  const hasSevereAlert = data.alerts.some((alert) => {
    const text = `${alert.event ?? ""} ${alert.severity ?? ""}`.toLowerCase();
    return /warning|hurricane|tropical storm|gale|storm surge|severe/.test(text);
  });
  if (hasSevereAlert) reasons.push("Active NWS hazard alert");
  if ((data.windMph ?? 0) >= 25) reasons.push("Strong wind");
  if ((data.waveHeightFt ?? 0) >= 6) reasons.push("High waves");
  if ((data.precipitationChance ?? 0) >= 75) reasons.push("High rain chance");
  if (hasSevereAlert || (data.windMph ?? 0) >= 25 || (data.waveHeightFt ?? 0) >= 6) {
    return { label: "Poor", tone: "poor", reasons };
  }
  if (
    (data.windMph ?? 0) >= 15 ||
    (data.waveHeightFt ?? 0) >= 3 ||
    (data.precipitationChance ?? 0) >= 40 ||
    data.alerts.length
  ) {
    if (data.windMph !== null && data.windMph >= 15) reasons.push("Building wind");
    if (data.waveHeightFt !== null && data.waveHeightFt >= 3) reasons.push("Choppy water");
    if (data.precipitationChance !== null && data.precipitationChance >= 40) {
      reasons.push("Rain possible");
    }
    if (!reasons.length) reasons.push("Check local advisories");
    return { label: "Caution", tone: "caution", reasons };
  }
  return { label: "Good", tone: "good", reasons: ["No major hazards detected"] };
}

function sourceList() {
  return [
    {
      name: "National Weather Service",
      url: "https://www.weather.gov/",
      note: "Weather, wind, forecast, hazards, and wave grids",
    },
    {
      name: "NOAA CO-OPS",
      url: "https://tidesandcurrents.noaa.gov/",
      note: "Tide predictions and water temperature",
    },
    {
      name: "OpenStreetMap Nominatim",
      url: "https://nominatim.openstreetmap.org/",
      note: "U.S. location search",
    },
  ];
}

router.get("/marine-conditions/search", async (req, res) => {
  const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (query.length < 2) {
    res.status(400).json({ message: "Search for at least two characters." });
    return;
  }
  try {
    res.json({ locations: await geocodeMany(query) });
  } catch {
    res.status(502).json({ message: "Location search is temporarily unavailable." });
  }
});

router.get("/marine-conditions", async (req, res) => {
  const query = typeof req.query.query === "string" ? req.query.query.trim() : "";
  if (!query) {
    res.status(400).json({ message: "A U.S. boating location is required." });
    return;
  }

  try {
    const location = await geocode(query);
    if (!location) {
      res.status(404).json({ message: "We could not find that U.S. location." });
      return;
    }

    const point = await fetchJson<JsonRecord>(
      `${NWS_URL}/points/${location.latitude},${location.longitude}`,
    );
    const properties = point.properties ?? {};
    const [hourly, daily, grid, alerts, tide] = await Promise.all([
      fetchJson<JsonRecord>(properties.forecastHourly).catch(() => null),
      fetchJson<JsonRecord>(properties.forecast).catch(() => null),
      fetchJson<JsonRecord>(properties.forecastGridData).catch(() => null),
      fetchJson<JsonRecord>(
        `${NWS_URL}/alerts/active?point=${location.latitude},${location.longitude}`,
      ).catch(() => null),
      getTideData(location.latitude, location.longitude),
    ]);

    const current = hourly?.properties?.periods?.[0] ?? null;
    const forecastPeriods = Array.isArray(daily?.properties?.periods)
      ? daily.properties.periods
      : [];
    const forecast = forecastPeriods
      .filter((period: JsonRecord) => period.isDaytime)
      .slice(0, 7)
      .map((period: JsonRecord) => ({
        date: period.startTime,
        name: textOrNull(period.name),
        temperatureF: toFahrenheit(period.temperature, period.temperatureUnit),
        shortForecast: textOrNull(period.shortForecast),
        windSpeed: parseWindSpeed(period.windSpeed),
        windDirection: textOrNull(period.windDirection),
        precipitationChance: numberOrNull(
          period.probabilityOfPrecipitation?.value,
        ),
      }));
    const waveHeightReading = currentGridValue(grid?.properties?.waveHeight);
    const wavePeriodReading = currentGridValue(grid?.properties?.wavePeriod);
    const waveHeightFt = toFeet(
      waveHeightReading?.value,
      grid?.properties?.waveHeight?.uom?.replace("wmoUnit:", ""),
    );
    const alertsList = (alerts?.features ?? [])
      .slice(0, 6)
      .map((feature: JsonRecord) => feature.properties ?? {});
    const windMph = parseWindSpeed(current?.windSpeed)?.value ?? null;
    const precipitationChance = numberOrNull(
      current?.probabilityOfPrecipitation?.value,
    );

    res.json({
      location,
      fetchedAt: new Date().toISOString(),
      current: {
        temperatureF: toFahrenheit(
          current?.temperature,
          current?.temperatureUnit,
        ),
        description: textOrNull(current?.shortForecast),
        windMph,
        windRange: parseWindSpeed(current?.windSpeed)?.range ?? null,
        windDirection: textOrNull(current?.windDirection),
        humidity: numberOrNull(current?.relativeHumidity?.value),
        precipitationChance,
      },
      waves: {
        heightFt: waveHeightFt,
        periodSeconds: numberOrNull(wavePeriodReading?.value),
        conditions:
          waveHeightFt === null
            ? null
            : waveHeightFt < 1
              ? "Light"
              : waveHeightFt < 3
                ? "Moderate"
                : "Choppy",
        source: waveHeightFt === null ? null : "National Weather Service",
      },
      water: {
        temperatureF: tide?.waterTemperatureF ?? null,
        source: tide?.waterTemperatureF === null ? null : "NOAA CO-OPS",
      },
      tide,
      alerts: alertsList.map((alert: JsonRecord) => ({
        event: textOrNull(alert.event),
        headline: textOrNull(alert.headline),
        severity: textOrNull(alert.severity),
        expires: textOrNull(alert.expires),
      })),
      forecast,
      rating: ratingFor({
        windMph,
        waveHeightFt,
        precipitationChance,
        alerts: alertsList,
      }),
      sources: sourceList(),
    });
  } catch (error) {
    res.status(502).json({
      message: "Live marine data is temporarily unavailable. Please try again.",
      detail: error instanceof Error ? error.message : "Unknown upstream error",
    });
  }
});

export default router;