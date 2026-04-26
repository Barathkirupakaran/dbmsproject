"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent
} from "react";

import type { ColumnDefinition, EntityDefinition } from "@/lib/types";

type GenericRow = Record<string, unknown>;

type UiLang = "en" | "ta" | "hi" | "te" | "ml";
type ThemeName = "sunrise" | "forest" | "classic";
type FontScale = "small" | "normal" | "large";

interface MetaResponse {
  entities: EntityDefinition[];
}

interface AnalyticsResponse {
  kpis: {
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    pendingPayments: number;
    totalRevenue: number;
  };
  topProducts: Array<{
    productId: number;
    productName: string;
    totalQty: number;
    totalSales: number;
  }>;
  orderStatus: Array<{ status: string; total: number }>;
  paymentMethods: Array<{ method: string; total: number }>;
  lowStock: Array<{
    productName: string;
    stockQuantity: number;
    reorderLevel: number;
  }>;
  salesTrend: Array<{ month: string; sales: number }>;
}

interface VoiceRecognitionResult {
  transcript: string;
}

interface VoiceRecognitionResultListLike extends ArrayLike<VoiceRecognitionResult> {
  isFinal: boolean;
}

interface VoiceRecognitionEventLike {
  results: ArrayLike<VoiceRecognitionResultListLike>;
}

interface VoiceRecognitionErrorEventLike {
  error?: string;
  message?: string;
}

interface VoiceRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: VoiceRecognitionEventLike) => void) | null;
  onerror: ((event: VoiceRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface VoiceRecognitionConstructor {
  new (): VoiceRecognitionLike;
}

declare global {
  interface Window {
    SpeechRecognition?: VoiceRecognitionConstructor;
    webkitSpeechRecognition?: VoiceRecognitionConstructor;
  }
}

const EMPTY_CELL = "-";

const COLORS = ["#0f766e", "#d97706", "#b91c1c", "#065f46", "#7c3aed", "#155e75", "#4d7c0f"];

const APP_LANG_OPTIONS: Array<{ code: UiLang; label: string; speechLang: string }> = [
  { code: "en", label: "English", speechLang: "en-IN" },
  { code: "ta", label: "Tamil", speechLang: "ta-IN" },
  { code: "hi", label: "Hindi", speechLang: "hi-IN" },
  { code: "te", label: "Telugu", speechLang: "te-IN" },
  { code: "ml", label: "Malayalam", speechLang: "ml-IN" }
];

const THEME_OPTIONS: Array<{ code: ThemeName; label: string }> = [
  { code: "sunrise", label: "Sunrise" },
  { code: "forest", label: "Forest" },
  { code: "classic", label: "Classic" }
];

const FONT_SCALE_OPTIONS: Array<{ code: FontScale; label: string }> = [
  { code: "small", label: "Small" },
  { code: "normal", label: "Normal" },
  { code: "large", label: "Large" }
];

const TRANSLATIONS: Record<
  UiLang,
  {
    appName: string;
    appSubtitle: string;
    quickSteps: string;
    stepOne: string;
    stepTwo: string;
    stepThree: string;
    voiceAssistant: string;
    voiceHint: string;
    startVoice: string;
    stopVoice: string;
    voiceExamples: string;
    runCommand: string;
    typedPlaceholder: string;
    searchPlaceholder: string;
    addRecord: string;
    rows: string;
    loading: string;
    hiddenRows: string;
    statsTitle: string;
    topSelling: string;
    orderStatus: string;
    paymentMethods: string;
    lowStock: string;
    monthlySales: string;
    noData: string;
    totalOrders: string;
    totalProducts: string;
    totalCustomers: string;
    pendingPayments: string;
    totalRevenue: string;
  }
> = {
  en: {
    appName: "Vyapari Mitra",
    appSubtitle: "Simple business manager for small vendors. Tap or speak to work quickly.",
    quickSteps: "Quick Steps",
    stepOne: "1. Choose category from left",
    stepTwo: "2. Press Add Record or use Voice",
    stepThree: "3. Edit or Delete from table",
    voiceAssistant: "Voice Assistant",
    voiceHint: "Tip: If mic fails, type command below and press Run.",
    startVoice: "Start Voice Input",
    stopVoice: "Stop Listening",
    voiceExamples: "Voice Examples",
    runCommand: "Run Command",
    typedPlaceholder: "Type command (example: Add customer name Ravi phone 9001111111)",
    searchPlaceholder: "Search this table...",
    addRecord: "Add Record",
    rows: "row(s)",
    loading: "Loading...",
    hiddenRows: "empty row(s) hidden",
    statsTitle: "Business Insights",
    topSelling: "Top Selling Products",
    orderStatus: "Order Status",
    paymentMethods: "Payment Methods",
    lowStock: "Low Stock Alert",
    monthlySales: "Monthly Sales",
    noData: "No data found.",
    totalOrders: "Total Orders",
    totalProducts: "Products",
    totalCustomers: "Customers",
    pendingPayments: "Pending Payments",
    totalRevenue: "Total Revenue"
  },
  ta: {
    appName: "வியாபாரி நண்பன்",
    appSubtitle: "சிறு விற்பனையாளர்களுக்கான எளிய மேலாண்மை.",
    quickSteps: "விரைவு படிகள்",
    stepOne: "1. இடதுபுறத்தில் வகையை தேர்வு செய்க",
    stepTwo: "2. Add Record அழுத்தவும் அல்லது குரல் பயன்படுத்தவும்",
    stepThree: "3. அட்டவணையில் Edit/Delete செய்யவும்",
    voiceAssistant: "குரல் உதவி",
    voiceHint: "குறிப்பு: மைக் வேலை செய்யவில்லை என்றால் கீழே கட்டளை টাইப் செய்யவும்.",
    startVoice: "குரல் தொடங்கு",
    stopVoice: "கேட்க நிறுத்து",
    voiceExamples: "உதாரணங்கள்",
    runCommand: "கட்டளை இயக்கவும்",
    typedPlaceholder: "கட்டளை எழுதவும்",
    searchPlaceholder: "இந்த அட்டவணையில் தேடு...",
    addRecord: "பதிவு சேர்க்க",
    rows: "வரிகள்",
    loading: "ஏற்றுகிறது...",
    hiddenRows: "காலி வரிகள் மறைக்கப்பட்டன",
    statsTitle: "வணிக தகவல்கள்",
    topSelling: "அதிகம் விற்கும் பொருட்கள்",
    orderStatus: "ஆர்டர் நிலை",
    paymentMethods: "கட்டணம் முறைகள்",
    lowStock: "குறைந்த இருப்பு",
    monthlySales: "மாத விற்பனை",
    noData: "தரவு இல்லை.",
    totalOrders: "மொத்த ஆர்டர்கள்",
    totalProducts: "பொருட்கள்",
    totalCustomers: "வாடிக்கையாளர்கள்",
    pendingPayments: "நிலுவை கட்டணங்கள்",
    totalRevenue: "மொத்த வருமானம்"
  },
  hi: {
    appName: "व्यापारी मित्र",
    appSubtitle: "छोटे विक्रेताओं के लिए सरल प्रबंधन ऐप।",
    quickSteps: "त्वरित चरण",
    stepOne: "1. बाएँ से कैटेगरी चुनें",
    stepTwo: "2. Add Record दबाएँ या Voice उपयोग करें",
    stepThree: "3. टेबल में Edit/Delete करें",
    voiceAssistant: "वॉइस असिस्टेंट",
    voiceHint: "अगर माइक काम न करे तो नीचे कमांड टाइप करें।",
    startVoice: "वॉइस शुरू करें",
    stopVoice: "सुनना बंद करें",
    voiceExamples: "उदाहरण",
    runCommand: "कमांड चलाएँ",
    typedPlaceholder: "कमांड लिखें",
    searchPlaceholder: "इस टेबल में खोजें...",
    addRecord: "रिकॉर्ड जोड़ें",
    rows: "पंक्तियाँ",
    loading: "लोड हो रहा है...",
    hiddenRows: "खाली पंक्तियाँ छिपाई गईं",
    statsTitle: "बिज़नेस इनसाइट्स",
    topSelling: "सबसे ज़्यादा बिकने वाले उत्पाद",
    orderStatus: "ऑर्डर स्थिति",
    paymentMethods: "भुगतान तरीके",
    lowStock: "कम स्टॉक चेतावनी",
    monthlySales: "मासिक बिक्री",
    noData: "डेटा नहीं मिला।",
    totalOrders: "कुल ऑर्डर",
    totalProducts: "उत्पाद",
    totalCustomers: "ग्राहक",
    pendingPayments: "लंबित भुगतान",
    totalRevenue: "कुल राजस्व"
  },
  te: {
    appName: "వ్యాపారి మిత్ర",
    appSubtitle: "చిన్న వ్యాపారుల కోసం సులభమైన యాప్.",
    quickSteps: "త్వరిత దశలు",
    stepOne: "1. ఎడమవైపు కేటగిరీ ఎంచుకోండి",
    stepTwo: "2. Add Record లేదా Voice ఉపయోగించండి",
    stepThree: "3. పట్టికలో Edit/Delete చేయండి",
    voiceAssistant: "వాయిస్ సహాయకుడు",
    voiceHint: "మైక్ పనిచేయకపోతే క్రింద కమాండ్ టైప్ చేయండి.",
    startVoice: "వాయిస్ ప్రారంభించండి",
    stopVoice: "వినడం ఆపు",
    voiceExamples: "ఉదాహరణలు",
    runCommand: "కమాండ్ అమలు",
    typedPlaceholder: "కమాండ్ టైప్ చేయండి",
    searchPlaceholder: "ఈ పట్టికలో వెతకండి...",
    addRecord: "రికార్డు జోడించు",
    rows: "వరుసలు",
    loading: "లోడ్ అవుతోంది...",
    hiddenRows: "ఖాళీ వరుసలు దాచబడ్డాయి",
    statsTitle: "బిజినెస్ వివరాలు",
    topSelling: "ఎక్కువగా అమ్మిన ఉత్పత్తులు",
    orderStatus: "ఆర్డర్ స్థితి",
    paymentMethods: "చెల్లింపు విధానాలు",
    lowStock: "తక్కువ స్టాక్ హెచ్చరిక",
    monthlySales: "మాసిక అమ్మకాలు",
    noData: "డేటా లేదు.",
    totalOrders: "మొత్తం ఆర్డర్లు",
    totalProducts: "ఉత్పత్తులు",
    totalCustomers: "గ్రాహకులు",
    pendingPayments: "పెండింగ్ చెల్లింపులు",
    totalRevenue: "మొత్తం ఆదాయం"
  },
  ml: {
    appName: "വ്യാപാരി മിത്ര",
    appSubtitle: "ചെറുകിട വ്യാപാരികൾക്കായുള്ള ലളിതമായ ആപ്പ്.",
    quickSteps: "വേഗത്തിലുള്ള ഘട്ടങ്ങൾ",
    stepOne: "1. ഇടത് ഭാഗത്ത് നിന്ന് വിഭാഗം തിരഞ്ഞെടുക്കുക",
    stepTwo: "2. Add Record അമർത്തുക അല്ലെങ്കിൽ Voice ഉപയോഗിക്കുക",
    stepThree: "3. പട്ടികയിൽ Edit/Delete ചെയ്യുക",
    voiceAssistant: "വോയ്സ് അസിസ്റ്റന്റ്",
    voiceHint: "മൈക്ക് പ്രവർത്തിക്കില്ലെങ്കിൽ താഴെ കമാൻഡ് ടൈപ്പ് ചെയ്യുക.",
    startVoice: "വോയ്സ് ആരംഭിക്കുക",
    stopVoice: "കേൾക്കുന്നത് നിർത്തുക",
    voiceExamples: "ഉദാഹരണങ്ങൾ",
    runCommand: "കമാൻഡ് പ്രവർത്തിപ്പിക്കുക",
    typedPlaceholder: "കമാൻഡ് ടൈപ്പ് ചെയ്യുക",
    searchPlaceholder: "ഈ പട്ടികയിൽ തിരയുക...",
    addRecord: "റെക്കോർഡ് ചേർക്കുക",
    rows: "നിരകൾ",
    loading: "ലോഡ് ചെയ്യുന്നു...",
    hiddenRows: "ശൂന്യ നിരകൾ മറച്ചു",
    statsTitle: "ബിസിനസ് വിവരങ്ങൾ",
    topSelling: "ഏറ്റവും കൂടുതൽ വിറ്റ ഉൽപ്പന്നങ്ങൾ",
    orderStatus: "ഓർഡർ നില",
    paymentMethods: "പേയ്മെന്റ് മാർഗങ്ങൾ",
    lowStock: "കുറഞ്ഞ സ്റ്റോക്ക് മുന്നറിയിപ്പ്",
    monthlySales: "മാസ വിൽപ്പന",
    noData: "ഡാറ്റയില്ല.",
    totalOrders: "ആകെ ഓർഡറുകൾ",
    totalProducts: "ഉൽപ്പന്നങ്ങൾ",
    totalCustomers: "ഉപഭോക്താക്കൾ",
    pendingPayments: "ബാക്കി പേയ്മെന്റുകൾ",
    totalRevenue: "ആകെ വരുമാനം"
  }
};

const COMMON_COLUMN_ALIASES: Record<string, string[]> = {
  name: ["name", "பெயர்", "नाम", "పేరు", "പേര്"],
  customer_name: ["customer name", "client name", "வாடிக்கையாளர் பெயர்", "ग्राहक नाम", "కస్టమర్ పేరు", "കസ്റ്റമർ പേര്"],
  supplier_name: ["supplier name", "விநியோகஸ்தர் பெயர்", "सप्लायर नाम", "సప్లయర్ పేరు", "സപ്ലയർ പേര്"],
  phone_no: ["phone", "mobile", "number", "தொலைபேசி", "फ़ोन", "ఫోన్", "ഫോൺ"],
  address: ["address", "location", "முகவரி", "पता", "చిరునామా", "വിലാസം"],
  email: ["email", "mail", "மின்னஞ்சல்", "ईमेल", "ఇమెయిల్", "ഇമെയിൽ"],
  quantity: ["quantity", "qty", "எண்ணிக்கை", "मात्रा", "పరిమాణం", "അളവ്"],
  unit_price: ["unit price", "price", "rate", "விலை", "कीमत", "ధర", "വില"],
  cost_price: ["cost price", "purchase price", "கொள்முதல் விலை", "क्रय मूल्य", "కొనుగోలు ధర", "വാങ്ങൽ വില"],
  order_status: ["status", "order status", "நிலை", "स्थिति", "స్థితి", "സ്ഥിതി"],
  payment_status: ["payment status", "paid status", "கட்டண நிலை", "भुगतान स्थिति", "చెల్లింపు స్థితి", "പേയ്മെന്റ് നില"],
  product_name: ["product", "product name", "item", "பொருள்", "उत्पाद", "ఉత్పత్తి", "ഉൽപ്പന്നം"],
  language_name: ["language", "மொழி", "भाषा", "భాష", "ഭാഷ"],
  script: ["script", "எழுத்து", "लिपि", "లిపి", "ലിപി"],
  created_time: ["created time", "time", "நேரம்", "समय", "సమయం", "സമയം"]
};

const ACTION_KEYWORDS = {
  open: ["open", "switch", "go to", "திற", "खोलो", "తెరువు", "തുറക്കുക"],
  search: ["search", "find", "தேடு", "खोज", "వెతుకు", "തിരയുക"],
  add: ["add", "create", "insert", "new", "சேர்", "जोड़", "చేర్చు", "ചേർക്കുക"],
  update: ["update", "edit", "change", "புதுப்பி", "अपडेट", "నవీకరించు", "അപ്ഡേറ്റ്"],
  remove: ["delete", "remove", "நீக்கு", "हटाओ", "తొలగించు", "നീക്കുക"]
};

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return EMPTY_CELL;
  }
  if (typeof value === "string") {
    const cleaned = value.trim();
    return cleaned.length ? cleaned : EMPTY_CELL;
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
};

const inputTypeByColumn = (columnType: ColumnDefinition["type"]): string => {
  if (columnType === "number" || columnType === "decimal") {
    return "number";
  }
  if (columnType === "date") {
    return "date";
  }
  if (columnType === "datetime") {
    return "datetime-local";
  }
  if (columnType === "email") {
    return "email";
  }
  if (columnType === "password") {
    return "password";
  }
  return "text";
};

const toDateInputString = (value: unknown): string => {
  if (!value) {
    return "";
  }
  const plain = String(value);
  if (plain.length >= 10 && plain.includes("-")) {
    return plain.slice(0, 10);
  }
  return "";
};

const toDateTimeInputString = (value: unknown): string => {
  if (!value) {
    return "";
  }
  const asDate = new Date(String(value));
  if (Number.isNaN(asDate.getTime())) {
    return "";
  }
  const pad = (num: number) => String(num).padStart(2, "0");
  return `${asDate.getFullYear()}-${pad(asDate.getMonth() + 1)}-${pad(asDate.getDate())}T${pad(asDate.getHours())}:${pad(asDate.getMinutes())}`;
};

const encodeRowPrimaryKey = (entity: EntityDefinition, row: GenericRow): string =>
  entity.primaryKey.map((column) => encodeURIComponent(String(row[column] ?? ""))).join("~");

const normalizeText = (value: string): string =>
  value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}_\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const splitTokens = (value: string): string[] => normalizeText(value).split(" ").filter(Boolean);

const startsWithKeywords = (normalizedText: string, keywords: string[]): boolean =>
  keywords.some((keyword) => normalizedText === keyword || normalizedText.startsWith(`${keyword} `));

const getColumnAliasEntries = (entity: EntityDefinition) =>
  entity.columns.map((column) => {
    const aliases = new Set<string>();
    const keyAliases = COMMON_COLUMN_ALIASES[column.name] ?? [];
    aliases.add(column.name);
    aliases.add(column.name.replace(/_/g, " "));
    aliases.add(column.label);
    keyAliases.forEach((alias) => aliases.add(alias));
    if (column.name.endsWith("_id")) {
      aliases.add(column.name.replace(/_id$/, " id"));
      aliases.add(`${column.label.replace(/id/i, "").trim()} id`);
    }
    return {
      columnName: column.name,
      tokensList: Array.from(aliases)
        .map((alias) => splitTokens(alias))
        .filter((tokens) => tokens.length > 0)
        .sort((a, b) => b.length - a.length)
    };
  });

const parseFieldsFromCommand = (text: string, entity: EntityDefinition): Record<string, string> => {
  const originalTokens = text.trim().split(/\s+/).filter(Boolean);
  const normalizedTokens = originalTokens.map((token) => normalizeText(token) || token.toLowerCase());
  const aliases = getColumnAliasEntries(entity);

  const output: Record<string, string> = {};
  let activeColumn: string | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (!activeColumn) {
      buffer = [];
      return;
    }
    const value = buffer
      .join(" ")
      .replace(/^(is|to|as|equals|equal)\s+/i, "")
      .trim();
    if (value.length > 0) {
      output[activeColumn] = value;
    }
    buffer = [];
  };

  let index = 0;
  while (index < normalizedTokens.length) {
    let matchedColumn: string | null = null;
    let matchedLength = 0;

    for (const aliasGroup of aliases) {
      for (const aliasTokens of aliasGroup.tokensList) {
        const segment = normalizedTokens.slice(index, index + aliasTokens.length);
        const matched =
          aliasTokens.length > matchedLength &&
          segment.length === aliasTokens.length &&
          aliasTokens.every((token, tokenIndex) => segment[tokenIndex] === token);
        if (matched) {
          matchedColumn = aliasGroup.columnName;
          matchedLength = aliasTokens.length;
        }
      }
    }

    if (matchedColumn) {
      flush();
      activeColumn = matchedColumn;
      index += matchedLength;
      continue;
    }

    if (activeColumn) {
      buffer.push(originalTokens[index]);
    }
    index += 1;
  }

  flush();
  return output;
};

const findMentionedEntity = (text: string, entities: EntityDefinition[]): EntityDefinition | undefined => {
  const normalized = normalizeText(text);
  let bestMatch: EntityDefinition | undefined;
  let bestLength = 0;

  for (const entity of entities) {
    const aliases = [entity.key, entity.key.replace(/_/g, " "), entity.label, entity.label.toLowerCase()];
    for (const alias of aliases) {
      const normalizedAlias = normalizeText(alias);
      if (normalizedAlias && normalized.includes(normalizedAlias) && normalizedAlias.length > bestLength) {
        bestMatch = entity;
        bestLength = normalizedAlias.length;
      }
    }
  }

  return bestMatch;
};

const extractPrimaryKeyValue = (
  text: string,
  entity: EntityDefinition,
  parsedFields: Record<string, string>
): string | null => {
  if (entity.primaryKey.length !== 1) {
    return null;
  }
  const primaryKey = entity.primaryKey[0];
  if (parsedFields[primaryKey]) {
    return parsedFields[primaryKey];
  }
  const normalized = normalizeText(text);
  const candidates = [primaryKey.replace(/_/g, " "), primaryKey.replace(/_id$/, " id"), "id"];
  for (const alias of candidates) {
    const pattern = new RegExp(`${alias}\\s*(?:is|=|to)?\\s*([\\p{L}\\p{N}_-]+)`, "u");
    const match = normalized.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
  const lastNumber = normalized.match(/(\d+)(?!.*\d)/);
  return lastNumber?.[1] ?? null;
};

const hasMeaningfulData = (row: GenericRow, entity: EntityDefinition): boolean =>
  entity.columns.some((column) => {
    const value = row[column.name];
    if (value === null || value === undefined) {
      return false;
    }
    if (typeof value === "string") {
      return value.trim().length > 0;
    }
    return true;
  });

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value || 0);

const MiniBarChart = ({
  data,
  valueKey,
  labelKey,
  title,
  suffix = ""
}: {
  data: Array<Record<string, string | number>>;
  valueKey: string;
  labelKey: string;
  title: string;
  suffix?: string;
}) => {
  const maxValue = Math.max(...data.map((item) => Number(item[valueKey] ?? 0)), 1);
  return (
    <div className="stats-card">
      <h4 className="stats-title">{title}</h4>
      <div className="chart-list">
        {data.length === 0 ? (
          <p className="muted">No data.</p>
        ) : (
          data.map((item, index) => {
            const value = Number(item[valueKey] ?? 0);
            const label = String(item[labelKey] ?? "");
            const width = Math.max((value / maxValue) * 100, 5);
            return (
              <div className="chart-row" key={`${label}-${index}`}>
                <div className="chart-row-top">
                  <span>{label}</span>
                  <span>
                    {value}
                    {suffix}
                  </span>
                </div>
                <div className="chart-bar-bg">
                  <div
                    className="chart-bar-fill"
                    style={{
                      width: `${width}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const MiniPieChart = ({
  data,
  labelKey,
  valueKey,
  title
}: {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  valueKey: string;
  title: string;
}) => {
  const total = data.reduce((sum, item) => sum + Number(item[valueKey] ?? 0), 0);
  let angleCursor = 0;
  const gradientStops = data.map((item, index) => {
    const value = Number(item[valueKey] ?? 0);
    const angle = total > 0 ? (value / total) * 360 : 0;
    const start = angleCursor;
    angleCursor += angle;
    return `${COLORS[index % COLORS.length]} ${start}deg ${angleCursor}deg`;
  });

  return (
    <div className="stats-card">
      <h4 className="stats-title">{title}</h4>
      <div className="pie-wrap">
        <div
          className="pie-chart"
          style={{
            background:
              gradientStops.length > 0 ? `conic-gradient(${gradientStops.join(", ")})` : "rgba(15,118,110,0.15)"
          }}
        />
        <div className="pie-legend">
          {data.length === 0 ? (
            <p className="muted">No data.</p>
          ) : (
            data.map((item, index) => {
              const label = String(item[labelKey] ?? "");
              const value = Number(item[valueKey] ?? 0);
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
              return (
                <div className="pie-item" key={`${label}-${index}`}>
                  <span
                    className="pie-dot"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  />
                  <span className="pie-text">
                    {label} ({percentage}%)
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [entities, setEntities] = useState<EntityDefinition[]>([]);
  const [activeEntityKey, setActiveEntityKey] = useState<string>("");
  const [rows, setRows] = useState<GenericRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [editingRow, setEditingRow] = useState<GenericRow | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uiLang, setUiLang] = useState<UiLang>("en");
  const [theme, setTheme] = useState<ThemeName>("sunrise");
  const [fontScale, setFontScale] = useState<FontScale>("normal");
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [compactMode, setCompactMode] = useState<boolean>(false);
  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState<boolean>(true);
  const [showQuickGuide, setShowQuickGuide] = useState<boolean>(true);
  const [analyticsAutoRefresh, setAnalyticsAutoRefresh] = useState<boolean>(false);
  const [voiceSupported, setVoiceSupported] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [liveVoiceText, setLiveVoiceText] = useState<string>("");
  const [lastVoiceCommand, setLastVoiceCommand] = useState<string>("");
  const [typedCommand, setTypedCommand] = useState<string>("");
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(false);

  const recognitionConstructorRef = useRef<VoiceRecognitionConstructor | null>(null);
  const recognitionRef = useRef<VoiceRecognitionLike | null>(null);

  const tr = TRANSLATIONS[uiLang];

  const activeEntity = useMemo(
    () => entities.find((entity) => entity.key === activeEntityKey),
    [activeEntityKey, entities]
  );

  const cleanRows = useMemo(
    () => (activeEntity ? rows.filter((row) => hasMeaningfulData(row, activeEntity)) : rows),
    [activeEntity, rows]
  );

  const filteredRows = useMemo(() => {
    if (!query.trim()) {
      return cleanRows;
    }
    const lowerQuery = query.toLowerCase();
    return cleanRows.filter((row) =>
      activeEntity?.columns.some((column) => String(row[column.name] ?? "").toLowerCase().includes(lowerQuery))
    );
  }, [activeEntity, cleanRows, query]);

  const hiddenRowCount = Math.max(rows.length - cleanRows.length, 0);

  const speak = useCallback(
    (text: string) => {
      if (!("speechSynthesis" in window)) {
        return;
      }
      const lang = APP_LANG_OPTIONS.find((item) => item.code === uiLang)?.speechLang ?? "en-IN";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    },
    [uiLang]
  );

  const loadEntities = useCallback(async () => {
    const response = await fetch("/api/meta");
    const data = (await response.json()) as MetaResponse;
    setEntities(data.entities);
    setActiveEntityKey((previous) => previous || data.entities[0]?.key || "");
  }, []);

  const loadRows = useCallback(async (entityKey: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/${entityKey}`);
      const data = (await response.json()) as { data?: GenericRow[]; error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load records");
      }
      setRows(data.data ?? []);
    } catch (error) {
      const text = error instanceof Error ? error.message : "Failed to load records";
      setRows([]);
      setMessage({ type: "error", text });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const response = await fetch("/api/analytics");
      const data = (await response.json()) as AnalyticsResponse & { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load analytics");
      }
      setAnalytics(data);
    } catch (error) {
      const text = error instanceof Error ? error.message : "Failed to load analytics";
      setMessage({ type: "error", text });
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEntities();
    void loadAnalytics();
  }, [loadAnalytics, loadEntities]);

  useEffect(() => {
    if (!activeEntityKey) {
      return;
    }
    void loadRows(activeEntityKey);
  }, [activeEntityKey, loadRows]);

  useEffect(() => {
    const stored = window.localStorage.getItem("ui_lang") as UiLang | null;
    if (stored && APP_LANG_OPTIONS.some((item) => item.code === stored)) {
      setUiLang(stored);
    }
    const storedTheme = window.localStorage.getItem("ui_theme") as ThemeName | null;
    if (storedTheme && THEME_OPTIONS.some((item) => item.code === storedTheme)) {
      setTheme(storedTheme);
    }
    const storedFontScale = window.localStorage.getItem("ui_font_scale") as FontScale | null;
    if (storedFontScale && FONT_SCALE_OPTIONS.some((item) => item.code === storedFontScale)) {
      setFontScale(storedFontScale);
    }
    const storedCompact = window.localStorage.getItem("ui_compact");
    if (storedCompact === "true") {
      setCompactMode(true);
    }
    const storedQuickGuide = window.localStorage.getItem("ui_quick_guide");
    if (storedQuickGuide === "false") {
      setShowQuickGuide(false);
    }
    const storedAutoRefresh = window.localStorage.getItem("ui_analytics_auto_refresh");
    if (storedAutoRefresh === "true") {
      setAnalyticsAutoRefresh(true);
    }
    const storedVoiceFeedback = window.localStorage.getItem("ui_voice_feedback");
    if (storedVoiceFeedback === "false") {
      setVoiceFeedbackEnabled(false);
    }
    const ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionConstructorRef.current = ctor ?? null;
    setVoiceSupported(Boolean(ctor));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("ui_lang", uiLang);
  }, [uiLang]);

  useEffect(() => {
    window.localStorage.setItem("ui_theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("ui_font_scale", fontScale);
    document.body.setAttribute("data-font-scale", fontScale);
  }, [fontScale]);

  useEffect(() => {
    window.localStorage.setItem("ui_compact", compactMode ? "true" : "false");
    document.body.setAttribute("data-density", compactMode ? "compact" : "comfortable");
  }, [compactMode]);

  useEffect(() => {
    window.localStorage.setItem("ui_quick_guide", showQuickGuide ? "true" : "false");
  }, [showQuickGuide]);

  useEffect(() => {
    window.localStorage.setItem("ui_analytics_auto_refresh", analyticsAutoRefresh ? "true" : "false");
  }, [analyticsAutoRefresh]);

  useEffect(() => {
    window.localStorage.setItem("ui_voice_feedback", voiceFeedbackEnabled ? "true" : "false");
  }, [voiceFeedbackEnabled]);

  useEffect(() => {
    if (!analyticsAutoRefresh) {
      return;
    }
    const timer = window.setInterval(() => {
      void loadAnalytics();
    }, 60000);
    return () => window.clearInterval(timer);
  }, [analyticsAutoRefresh, loadAnalytics]);

  const reply = useCallback(
    (text: string, type: "success" | "error" = "success") => {
      setMessage({ type, text });
      if (voiceFeedbackEnabled) {
        speak(text);
      }
    },
    [speak, voiceFeedbackEnabled]
  );

  const executeCommand = useCallback(
    async (rawCommand: string) => {
      const command = rawCommand.trim();
      if (!command) {
        return;
      }

      setLastVoiceCommand(command);
      const normalized = normalizeText(command);
      const mentionedEntity = findMentionedEntity(command, entities);
      const targetEntity = mentionedEntity ?? activeEntity;
      const parsedFields = targetEntity ? parseFieldsFromCommand(command, targetEntity) : {};

      if (startsWithKeywords(normalized, ACTION_KEYWORDS.open)) {
        if (!mentionedEntity) {
          reply("I could not find that category. Please say category name clearly.", "error");
          return;
        }
        setActiveEntityKey(mentionedEntity.key);
        setQuery("");
        reply(`Opened ${mentionedEntity.label.trim()} section.`);
        return;
      }

      if (startsWithKeywords(normalized, ACTION_KEYWORDS.search)) {
        const searchText = command.split(/\s+/).slice(1).join(" ").trim();
        setQuery(searchText);
        reply(searchText ? `Searching for ${searchText}.` : "Search cleared.");
        return;
      }

      if (!targetEntity) {
        reply("Please choose a category first and then try command.", "error");
        return;
      }

      if (startsWithKeywords(normalized, ACTION_KEYWORDS.add)) {
        const payload: Record<string, string> = {};
        for (const column of targetEntity.columns) {
          if (column.autoIncrement) {
            continue;
          }
          const value = parsedFields[column.name];
          if (value) {
            payload[column.name] = value.trim();
          }
        }
        if (Object.keys(payload).length === 0) {
          reply(`I could not identify fields. Example: Add customer name Ravi phone 9001111111.`, "error");
          return;
        }
        const response = await fetch(`/api/${targetEntity.key}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = (await response.json()) as { error?: string };
        if (!response.ok) {
          reply(data.error ?? "Unable to add record.", "error");
          return;
        }
        if (targetEntity.key !== activeEntity?.key) {
          setActiveEntityKey(targetEntity.key);
        }
        await Promise.all([loadRows(targetEntity.key), loadAnalytics()]);
        reply(`${targetEntity.label.trim()} record added.`);
        return;
      }

      if (startsWithKeywords(normalized, ACTION_KEYWORDS.update)) {
        if (targetEntity.primaryKey.length !== 1) {
          reply("Voice update currently supports tables with single ID.", "error");
          return;
        }
        const idValue = extractPrimaryKeyValue(command, targetEntity, parsedFields);
        if (!idValue) {
          reply(`Please mention ${targetEntity.primaryKey[0].replace(/_/g, " ")} in command.`, "error");
          return;
        }
        const payload: Record<string, string> = {};
        for (const column of targetEntity.columns) {
          if (targetEntity.primaryKey.includes(column.name)) {
            continue;
          }
          const value = parsedFields[column.name];
          if (value) {
            payload[column.name] = value.trim();
          }
        }
        if (!Object.keys(payload).length) {
          reply("Please mention field names and new values for update.", "error");
          return;
        }

        const response = await fetch(`/api/${targetEntity.key}/${encodeURIComponent(idValue)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = (await response.json()) as { error?: string };
        if (!response.ok) {
          reply(data.error ?? "Unable to update record.", "error");
          return;
        }
        if (targetEntity.key !== activeEntity?.key) {
          setActiveEntityKey(targetEntity.key);
        }
        await Promise.all([loadRows(targetEntity.key), loadAnalytics()]);
        reply(`${targetEntity.label.trim()} record updated.`);
        return;
      }

      if (startsWithKeywords(normalized, ACTION_KEYWORDS.remove)) {
        if (targetEntity.primaryKey.length !== 1) {
          reply("Voice delete currently supports tables with single ID.", "error");
          return;
        }
        const idValue = extractPrimaryKeyValue(command, targetEntity, parsedFields);
        if (!idValue) {
          reply("Please say record ID to delete.", "error");
          return;
        }
        const response = await fetch(`/api/${targetEntity.key}/${encodeURIComponent(idValue)}`, {
          method: "DELETE"
        });
        const data = (await response.json()) as { error?: string };
        if (!response.ok) {
          reply(data.error ?? "Unable to delete record.", "error");
          return;
        }
        if (targetEntity.key !== activeEntity?.key) {
          setActiveEntityKey(targetEntity.key);
        }
        await Promise.all([loadRows(targetEntity.key), loadAnalytics()]);
        reply(`${targetEntity.label.trim()} record deleted.`);
        return;
      }

      reply("I understood your speech but not the action. Try add, update, delete, open or search.", "error");
    },
    [activeEntity, entities, loadAnalytics, loadRows, reply]
  );

  useEffect(() => {
    if (!pendingCommand) {
      return;
    }
    void executeCommand(pendingCommand);
    setPendingCommand(null);
  }, [executeCommand, pendingCommand]);

  const startListening = () => {
    const RecognitionCtor = recognitionConstructorRef.current;
    if (!RecognitionCtor) {
      reply("Voice input not supported in this browser. Use typed command instead.", "error");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const speechLang = APP_LANG_OPTIONS.find((item) => item.code === uiLang)?.speechLang ?? "en-IN";
    const recognition = new RecognitionCtor();
    recognition.lang = speechLang;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalText = "";
      let interim = "";
      for (let i = 0; i < event.results.length; i += 1) {
        const result = event.results[i];
        const item = result[0];
        if (!item?.transcript) {
          continue;
        }
        if (result.isFinal) {
          finalText += `${item.transcript} `;
        } else {
          interim += `${item.transcript} `;
        }
      }
      setLiveVoiceText((finalText || interim).trim());
      if (finalText.trim()) {
        setPendingCommand(finalText.trim());
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      const code = event.error ?? "unknown";
      if (code === "network") {
        reply(
          "Microphone network error. Use HTTPS Chrome, allow microphone permission, or type command below.",
          "error"
        );
      } else if (code === "not-allowed") {
        reply("Microphone permission is blocked. Please allow microphone in browser settings.", "error");
      } else {
        reply(`Voice error: ${code}`, "error");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setLiveVoiceText("");
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    setLiveVoiceText("");
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    setLiveVoiceText("");
  };

  const openCreateModal = () => {
    if (!activeEntity) {
      return;
    }
    const defaults: Record<string, string> = {};
    for (const column of activeEntity.columns) {
      defaults[column.name] = "";
    }
    setFormValues(defaults);
    setEditingRow(null);
    setModalOpen(true);
  };

  const openEditModal = (row: GenericRow) => {
    if (!activeEntity) {
      return;
    }
    const mapped: Record<string, string> = {};
    for (const column of activeEntity.columns) {
      if (column.type === "date") {
        mapped[column.name] = toDateInputString(row[column.name]);
      } else if (column.type === "datetime") {
        mapped[column.name] = toDateTimeInputString(row[column.name]);
      } else {
        const value = row[column.name];
        mapped[column.name] = value === null || value === undefined ? "" : String(value).trim();
      }
    }
    setEditingRow(row);
    setFormValues(mapped);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormValues({});
    setEditingRow(null);
  };

  const deleteRow = async (row: GenericRow) => {
    if (!activeEntity) {
      return;
    }
    const rowId = encodeRowPrimaryKey(activeEntity, row);
    const approve = window.confirm("Delete this record permanently?");
    if (!approve) {
      return;
    }
    try {
      const response = await fetch(`/api/${activeEntity.key}/${rowId}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to delete record");
      }
      setMessage({ type: "success", text: "Record deleted" });
      await Promise.all([loadRows(activeEntity.key), loadAnalytics()]);
    } catch (error) {
      const text = error instanceof Error ? error.message : "Failed to delete record";
      setMessage({ type: "error", text });
    }
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeEntity) {
      return;
    }
    const payload: Record<string, string> = {};
    for (const column of activeEntity.columns) {
      const value = (formValues[column.name] ?? "").trim();
      if (!editingRow && column.autoIncrement && !value) {
        continue;
      }
      if (editingRow && activeEntity.primaryKey.includes(column.name)) {
        continue;
      }
      payload[column.name] = value;
    }
    try {
      const isEdit = Boolean(editingRow);
      const endpoint = isEdit
        ? `/api/${activeEntity.key}/${encodeRowPrimaryKey(activeEntity, editingRow as GenericRow)}`
        : `/api/${activeEntity.key}`;
      const response = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save record");
      }
      setMessage({ type: "success", text: isEdit ? "Record updated" : "Record created" });
      closeModal();
      await Promise.all([loadRows(activeEntity.key), loadAnalytics()]);
    } catch (error) {
      const text = error instanceof Error ? error.message : "Unable to save record";
      setMessage({ type: "error", text });
    }
  };

  const runTypedCommand = () => {
    if (!typedCommand.trim()) {
      return;
    }
    setPendingCommand(typedCommand.trim());
    setTypedCommand("");
  };

  const voiceHelp = [
    "Open customer",
    "Search rice",
    "Add customer name Ravi phone 9001111111 address Chennai",
    "Update language id 2 script Tamil",
    "Delete supplier id 4"
  ].join(". ");

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <h1 className="brand-title">{tr.appName}</h1>
        <p className="brand-subtitle">{tr.appSubtitle}</p>
        <div className="entity-list">
          {entities.map((entity) => (
            <button
              className={`entity-button ${entity.key === activeEntityKey ? "active" : ""}`}
              key={entity.key}
              onClick={() => {
                setActiveEntityKey(entity.key);
                setQuery("");
              }}
              type="button"
            >
              {entity.label.trim()}
            </button>
          ))}
        </div>
      </aside>

      <section className="main">
        <div className="headline-row">
          <div>
            <h2 className="headline">{activeEntity?.label?.trim() ?? "Dashboard"}</h2>
            <p className="headline-subtext">
              {activeEntity
                ? `Simple controls for ${activeEntity.label.trim()}. You can use buttons, voice or typed command.`
                : "Loading modules..."}
            </p>
          </div>
          <button className="button button-secondary settings-trigger" onClick={() => setSettingsOpen(true)} type="button">
            Settings
          </button>
        </div>

        {message ? <div className={`message ${message.type}`}>{message.text}</div> : null}

        <section className="insights-section">
          <h3 className="insights-heading">{tr.statsTitle}</h3>
          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label">{tr.totalOrders}</span>
              <strong className="kpi-value">{analytics?.kpis.totalOrders ?? 0}</strong>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">{tr.totalProducts}</span>
              <strong className="kpi-value">{analytics?.kpis.totalProducts ?? 0}</strong>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">{tr.totalCustomers}</span>
              <strong className="kpi-value">{analytics?.kpis.totalCustomers ?? 0}</strong>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">{tr.pendingPayments}</span>
              <strong className="kpi-value">{analytics?.kpis.pendingPayments ?? 0}</strong>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">{tr.totalRevenue}</span>
              <strong className="kpi-value">{formatCurrency(analytics?.kpis.totalRevenue ?? 0)}</strong>
            </div>
          </div>

          <div className="stats-grid">
            <MiniBarChart
              data={(analytics?.topProducts ?? []).map((item) => ({
                name: item.productName,
                qty: item.totalQty
              }))}
              labelKey="name"
              title={tr.topSelling}
              valueKey="qty"
            />
            <MiniPieChart
              data={(analytics?.orderStatus ?? []).map((item) => ({
                name: item.status,
                total: item.total
              }))}
              labelKey="name"
              title={tr.orderStatus}
              valueKey="total"
            />
            <MiniPieChart
              data={(analytics?.paymentMethods ?? []).map((item) => ({
                name: item.method,
                total: item.total
              }))}
              labelKey="name"
              title={tr.paymentMethods}
              valueKey="total"
            />
            <MiniBarChart
              data={(analytics?.salesTrend ?? []).map((item) => ({
                month: item.month,
                sales: item.sales
              }))}
              labelKey="month"
              suffix=""
              title={tr.monthlySales}
              valueKey="sales"
            />
          </div>

          <div className="stats-card">
            <h4 className="stats-title">{tr.lowStock}</h4>
            {analyticsLoading ? (
              <p className="muted">{tr.loading}</p>
            ) : (analytics?.lowStock ?? []).length === 0 ? (
              <p className="muted">{tr.noData}</p>
            ) : (
              <div className="low-stock-list">
                {(analytics?.lowStock ?? []).map((item, index) => (
                  <div className="low-stock-row" key={`${item.productName}-${index}`}>
                    <span>{item.productName}</span>
                    <span>
                      {item.stockQuantity} / {item.reorderLevel}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="helper-grid">
          {showQuickGuide ? (
            <div className="helper-card">
              <h3 className="helper-title">{tr.quickSteps}</h3>
              <p className="helper-text">{tr.stepOne}</p>
              <p className="helper-text">{tr.stepTwo}</p>
              <p className="helper-text">{tr.stepThree}</p>
            </div>
          ) : null}
          <div className="helper-card">
            <h3 className="helper-title">{tr.voiceAssistant}</h3>
            <div className="helper-actions">
              <button
                className={`button ${isListening ? "button-danger" : "button-primary"}`}
                disabled={!voiceSupported}
                onClick={isListening ? stopListening : startListening}
                type="button"
              >
                {isListening ? tr.stopVoice : tr.startVoice}
              </button>
              <button
                className="button button-secondary"
                onClick={() => {
                  reply(voiceHelp);
                  setMessage({ type: "success", text: voiceHelp });
                }}
                type="button"
              >
                {tr.voiceExamples}
              </button>
            </div>
            <p className="helper-text">{tr.voiceHint}</p>
            <p className="helper-text">
              {isListening
                ? `Listening: ${liveVoiceText || "Speak now..."}`
                : `Last command: ${lastVoiceCommand || "No command yet"}`}
            </p>
            <div className="typed-command-row">
              <input
                className="search-input typed-command-input"
                onChange={(event) => setTypedCommand(event.target.value)}
                placeholder={tr.typedPlaceholder}
                value={typedCommand}
              />
              <button className="button button-secondary" onClick={runTypedCommand} type="button">
                {tr.runCommand}
              </button>
            </div>
          </div>
        </div>

        <div className="toolbar">
          <input
            className="search-input"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={tr.searchPlaceholder}
            value={query}
          />
          <button className="button button-primary" disabled={!activeEntity} onClick={openCreateModal} type="button">
            {tr.addRecord}
          </button>
          <span className="muted">
            {loading ? tr.loading : `${filteredRows.length} ${tr.rows}`}
          </span>
          {hiddenRowCount > 0 ? <span className="muted">{`${hiddenRowCount} ${tr.hiddenRows}`}</span> : null}
        </div>

        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                {activeEntity?.columns.map((column) => (
                  <th key={column.name}>{column.label.trim()}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td className="muted" colSpan={(activeEntity?.columns.length ?? 0) + 1}>
                    {tr.noData}
                  </td>
                </tr>
              ) : (
                activeEntity &&
                filteredRows.map((row) => {
                  const rowKey = encodeRowPrimaryKey(activeEntity, row);
                  return (
                    <tr key={rowKey}>
                      {activeEntity.columns.map((column) => (
                        <td key={`${rowKey}-${column.name}`}>{formatValue(row[column.name])}</td>
                      ))}
                      <td>
                        <div className="actions">
                          <button className="button button-secondary" onClick={() => openEditModal(row)} type="button">
                            Edit
                          </button>
                          <button className="button button-danger" onClick={() => deleteRow(row)} type="button">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {settingsOpen ? (
        <div className="modal-overlay">
          <div className="modal settings-modal">
            <h3 className="modal-title">Settings</h3>
            <div className="settings-grid">
              <label className="field">
                <span className="field-label">App Language</span>
                <select
                  className="field-input"
                  onChange={(event) => setUiLang(event.target.value as UiLang)}
                  value={uiLang}
                >
                  {APP_LANG_OPTIONS.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span className="field-label">Theme</span>
                <select
                  className="field-input"
                  onChange={(event) => setTheme(event.target.value as ThemeName)}
                  value={theme}
                >
                  {THEME_OPTIONS.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span className="field-label">Text Size</span>
                <select
                  className="field-input"
                  onChange={(event) => setFontScale(event.target.value as FontScale)}
                  value={fontScale}
                >
                  {FONT_SCALE_OPTIONS.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="settings-toggles">
              <label className="toggle-row">
                <input
                  checked={voiceFeedbackEnabled}
                  onChange={(event) => setVoiceFeedbackEnabled(event.target.checked)}
                  type="checkbox"
                />
                <span>Enable voice feedback (speak confirmations)</span>
              </label>
              <label className="toggle-row">
                <input checked={compactMode} onChange={(event) => setCompactMode(event.target.checked)} type="checkbox" />
                <span>Compact table view (more rows in less space)</span>
              </label>
              <label className="toggle-row">
                <input
                  checked={showQuickGuide}
                  onChange={(event) => setShowQuickGuide(event.target.checked)}
                  type="checkbox"
                />
                <span>Show Quick Steps card for beginners</span>
              </label>
              <label className="toggle-row">
                <input
                  checked={analyticsAutoRefresh}
                  onChange={(event) => setAnalyticsAutoRefresh(event.target.checked)}
                  type="checkbox"
                />
                <span>Auto refresh dashboard insights every 1 minute</span>
              </label>
            </div>

            <div className="settings-info">
              <h4 className="settings-subtitle">Project Creators</h4>
              <p className="helper-text">1. Barath K</p>
              <p className="helper-text">2. Kotapati KavyaSree</p>
            </div>

            <div className="settings-info">
              <h4 className="settings-subtitle">Other Settings</h4>
              <p className="helper-text">Current Theme: {theme}</p>
              <p className="helper-text">Current Text Size: {fontScale}</p>
              <p className="helper-text">Current Language: {APP_LANG_OPTIONS.find((item) => item.code === uiLang)?.label}</p>
              <p className="helper-text">Quick Steps Card: {showQuickGuide ? "Visible" : "Hidden"}</p>
              <p className="helper-text">
                Dashboard Auto Refresh: {analyticsAutoRefresh ? "Enabled (1 min)" : "Disabled"}
              </p>
              <p className="helper-text">Voice Input: {voiceSupported ? "Supported" : "Not supported in this browser"}</p>
              <button className="button button-secondary" onClick={() => void loadAnalytics()} type="button">
                Refresh Dashboard Now
              </button>
              <button
                className="button button-secondary"
                onClick={() => {
                  setUiLang("en");
                  setTheme("sunrise");
                  setFontScale("normal");
                  setCompactMode(false);
                  setShowQuickGuide(true);
                  setAnalyticsAutoRefresh(false);
                  setVoiceFeedbackEnabled(true);
                }}
                type="button"
              >
                Reset to Default
              </button>
            </div>

            <div className="modal-actions">
              <button className="button button-primary" onClick={() => setSettingsOpen(false)} type="button">
                Save & Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {modalOpen && activeEntity ? (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">{editingRow ? `Edit ${activeEntity.label}` : `Add ${activeEntity.label}`}</h3>
            <form onSubmit={submitForm}>
              <div className="form-grid">
                {activeEntity.columns.map((column) => {
                  const disabled = Boolean(editingRow && activeEntity.primaryKey.includes(column.name));
                  const inputType = inputTypeByColumn(column.type);
                  const placeholder = column.required ? `${column.label} *` : column.label;
                  const value = formValues[column.name] ?? "";
                  return (
                    <label className="field" key={column.name}>
                      <span className="field-label">{column.label.trim()}</span>
                      {column.type === "text" ? (
                        <textarea
                          className="field-textarea"
                          disabled={disabled}
                          onChange={(event) =>
                            setFormValues((previous) => ({ ...previous, [column.name]: event.target.value }))
                          }
                          placeholder={placeholder}
                          required={column.required}
                          value={value}
                        />
                      ) : (
                        <input
                          className="field-input"
                          disabled={disabled}
                          onChange={(event) =>
                            setFormValues((previous) => ({ ...previous, [column.name]: event.target.value }))
                          }
                          placeholder={placeholder}
                          required={column.required && !column.autoIncrement}
                          step={column.type === "decimal" ? "0.01" : undefined}
                          type={inputType}
                          value={value}
                        />
                      )}
                    </label>
                  );
                })}
              </div>
              <div className="modal-actions">
                <button className="button button-secondary" onClick={closeModal} type="button">
                  Cancel
                </button>
                <button className="button button-primary" type="submit">
                  {editingRow ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
