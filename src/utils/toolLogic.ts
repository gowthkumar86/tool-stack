const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export function runToolLogic(logicId: string, values: Record<string, string>): string {
  const num = (key: string) => parseFloat(values[key] || "0");
  const str = (key: string) => values[key] || "";

  switch (logicId) {
    // ---- Finance ----
    case "percentage":
      return String(num("value") * num("percentage") / 100);

    case "discount": {
      const orig = num("originalPrice");
      const disc = num("discountPercent");
      const saved = orig * disc / 100;
      return `${(orig - saved).toFixed(2)} (You save: ${saved.toFixed(2)})`;
    }

    case "emi": {
      const p = num("principal"), r = num("rate") / 12 / 100, n = num("tenure");
      if (r === 0) return (p / n).toFixed(2);
      const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      return emi.toFixed(2);
    }

    case "sip": {
      const m = num("monthlyInvestment"), r = num("expectedReturn") / 12 / 100, n = num("years") * 12;
      const fv = m * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      return fv.toFixed(2);
    }

    case "fd": {
      const p = num("principal"), r = num("rate") / 100, t = num("years");
      const a = p * Math.pow(1 + r / 4, 4 * t);
      return a.toFixed(2);
    }

    case "gst": {
      const amt = num("amount"), rate = num("gstRate");
      const gst = amt * rate / 100;
      return `${(amt + gst).toFixed(2)} (GST: ${gst.toFixed(2)})`;
    }

    case "loanInterest":
      return (num("principal") * num("rate") * num("years") / 100).toFixed(2);

    case "ctcToInhand": {
      const ctc = num("ctc"), bonus = num("bonus");
      const monthly = ctc / 12;
      const bonusAmt = ctc * bonus / 100 / 12;
      const pf = Math.min(monthly * 0.12, 1800);
      const profTax = 200;
      const taxable = ctc - ctc * 0.12 - 50000;
      const approxTax = taxable > 1000000 ? taxable * 0.3 : taxable > 500000 ? taxable * 0.2 : taxable > 250000 ? taxable * 0.05 : 0;
      const inhand = monthly - bonusAmt - pf - profTax - Math.max(0, approxTax / 12);
      return `₹${Math.round(inhand).toLocaleString()} / month (approx)`;
    }

    case "splitBill":
      return (num("totalBill") / num("people")).toFixed(2);

    case "tip": {
      const tip = num("billAmount") * num("tipPercent") / 100;
      return `Tip: ${tip.toFixed(2)} | Total: ${(num("billAmount") + tip).toFixed(2)}`;
    }

    case "age": {
      const dob = new Date(str("dob"));
      const now = new Date();
      let years = now.getFullYear() - dob.getFullYear();
      let months = now.getMonth() - dob.getMonth();
      let days = now.getDate() - dob.getDate();
      if (days < 0) { months--; days += 30; }
      if (months < 0) { years--; months += 12; }
      return `${years} years, ${months} months, ${days} days`;
    }

    case "compoundInterest": {
      const p = num("principal"), r = num("rate") / 100, t = num("years"), n = num("n") || 12;
      return (p * Math.pow(1 + r / n, n * t)).toFixed(2);
    }

    case "simpleInterest":
      return (num("principal") * num("rate") * num("years") / 100).toFixed(2);

    case "markup": {
      const cost = num("cost"), m = num("markup");
      return (cost + cost * m / 100).toFixed(2);
    }

    case "profitMargin": {
      const cp = num("costPrice"), sp = num("sellingPrice");
      return `${(((sp - cp) / sp) * 100).toFixed(2)}%`;
    }

    // ---- Developer Tools ----
    case "jsonFormatter":
      try { return JSON.stringify(JSON.parse(str("jsonInput")), null, 2); }
      catch { return "❌ Invalid JSON: " + (Error as any).message; }

    case "jsonValidator":
      try { JSON.parse(str("jsonInput")); return "✅ Valid JSON"; }
      catch (e) { return `❌ Invalid JSON: ${(e as Error).message}`; }

    case "base64": {
      const mode = str("mode").toLowerCase();
      const input = str("textInput");
      if (mode === "decode") {
        try { return atob(input); } catch { return "❌ Invalid Base64 input"; }
      }
      return btoa(input);
    }

    case "urlEncode": {
      const mode = str("mode").toLowerCase();
      const input = str("textInput");
      return mode === "decode" ? decodeURIComponent(input) : encodeURIComponent(input);
    }

    case "jwtDecoder": {
      try {
        const parts = str("token").split(".");
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        return `Header:\n${JSON.stringify(header, null, 2)}\n\nPayload:\n${JSON.stringify(payload, null, 2)}`;
      } catch { return "❌ Invalid JWT token"; }
    }

    case "regexTester": {
      try {
        const re = new RegExp(str("pattern"), str("flags"));
        const matches = str("testString").match(re);
        return matches ? `Found ${matches.length} match(es):\n${matches.join("\n")}` : "No matches found.";
      } catch (e) { return `❌ Invalid regex: ${(e as Error).message}`; }
    }

    case "timestampConverter": {
      const ts = num("timestamp");
      const d = new Date(ts * 1000);
      return `UTC: ${d.toUTCString()}\nLocal: ${d.toLocaleString()}`;
    }

    case "uuidGenerator": {
      const count = Math.min(Math.max(1, num("count") || 1), 100);
      return Array.from({ length: count }, () => crypto.randomUUID()).join("\n");
    }

    case "slugGenerator":
      return str("textInput").toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "");

    case "colorConverter": {
      const hex = str("colorInput").replace("#", "");
      if (!/^[0-9a-fA-F]{6}$/.test(hex)) return "❌ Enter a valid 6-digit HEX color (e.g. #ff5733)";
      const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
      const rn = r / 255, gn = g / 255, bn = b / 255;
      const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
      const l = (max + min) / 2;
      let h = 0, s = 0;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        else if (max === gn) h = ((bn - rn) / d + 2) / 6;
        else h = ((rn - gn) / d + 4) / 6;
      }
      return `RGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    }

    case "hashGenerator": {
      // Simple hash (djb2) since Web Crypto is async
      const text = str("textInput");
      let hash = 5381;
      for (let i = 0; i < text.length; i++) hash = ((hash << 5) + hash + text.charCodeAt(i)) >>> 0;
      return `DJB2 Hash: ${hash.toString(16)}\n\n(For SHA-256, use the browser's Web Crypto API)`;
    }

    case "loremIpsum": {
      const count = Math.min(Math.max(1, num("paragraphs") || 1), 20);
      return Array.from({ length: count }, () => LOREM).join("\n\n");
    }

    // ---- Text Tools ----
    case "wordCounter": {
      const text = str("textInput");
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;
      const sentences = text.split(/[.!?]+/).filter(Boolean).length;
      const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length;
      return `Words: ${words}\nCharacters: ${chars}\nSentences: ${sentences}\nParagraphs: ${paragraphs}`;
    }

    case "charCounter": {
      const text = str("textInput");
      return `With spaces: ${text.length}\nWithout spaces: ${text.replace(/\s/g, "").length}`;
    }

    case "caseConverter": {
      const text = str("textInput"), type = str("caseType").toLowerCase();
      if (type === "lower") return text.toLowerCase();
      if (type === "title") return text.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
      if (type === "sentence") return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      return text.toUpperCase();
    }

    case "removeDuplicates":
      return [...new Set(str("textInput").split("\n"))].join("\n");

    case "textSorter":
      return str("textInput").split("\n").sort().join("\n");

    case "textReverser":
      return str("textInput").split("").reverse().join("");

    case "findReplace":
      return str("textInput").split(str("find")).join(str("replaceWith"));

    case "lineCounter": {
      const lines = str("textInput").split("\n");
      const nonEmpty = lines.filter((l) => l.trim()).length;
      return `Total lines: ${lines.length}\nNon-empty lines: ${nonEmpty}`;
    }

    // ---- Converters ----
    case "kmMiles":
      return str("direction") === "miles-to-km" ? `${(num("value") * 1.60934).toFixed(4)} km` : `${(num("value") * 0.621371).toFixed(4)} miles`;

    case "kgLbs":
      return str("direction") === "lbs-to-kg" ? `${(num("value") * 0.453592).toFixed(4)} kg` : `${(num("value") * 2.20462).toFixed(4)} lbs`;

    case "celsiusFahrenheit":
      return str("direction") === "f-to-c" ? `${((num("value") - 32) * 5 / 9).toFixed(2)} °C` : `${(num("value") * 9 / 5 + 32).toFixed(2)} °F`;

    case "mbGb":
      return str("direction") === "gb-to-mb" ? `${(num("value") * 1024).toFixed(2)} MB` : `${(num("value") / 1024).toFixed(4)} GB`;

    case "lakhMillion":
      return str("direction") === "million-to-lakh" ? `${(num("value") * 10).toFixed(2)} lakhs` : `${(num("value") / 10).toFixed(2)} million`;

    case "croreMillion":
      return str("direction") === "million-to-crore" ? `${(num("value") / 10).toFixed(2)} crore` : `${(num("value") * 10).toFixed(2)} million`;

    case "inchesCm":
      return str("direction") === "cm-to-in" ? `${(num("value") / 2.54).toFixed(4)} inches` : `${(num("value") * 2.54).toFixed(4)} cm`;

    case "litersGallons":
      return str("direction") === "gal-to-l" ? `${(num("value") * 3.78541).toFixed(4)} liters` : `${(num("value") * 0.264172).toFixed(4)} gallons`;

    // ---- Health ----
    case "bmi": {
      const bmi = num("weight") / Math.pow(num("height") / 100, 2);
      let cat = "Normal";
      if (bmi < 18.5) cat = "Underweight";
      else if (bmi >= 25 && bmi < 30) cat = "Overweight";
      else if (bmi >= 30) cat = "Obese";
      return `${bmi.toFixed(1)} (${cat})`;
    }

    case "calories": {
      const bmr = 10 * num("weight") + 6.25 * num("height") - 5 * num("age") - 161;
      return `${Math.round(bmr * num("activityLevel"))} kcal/day (BMR: ${Math.round(bmr)})`;
    }

    case "waterIntake": {
      const base = num("weight") * 35 / 1000;
      const levels: Record<string, number> = { "1": 0, "2": 0.5, "3": 1 };
      const extra = levels[str("activityLevel")] || 0.5;
      return `${(base + extra).toFixed(1)} liters/day`;
    }

    case "sleepCycle": {
      const [h, m] = str("bedtime").split(":").map(Number);
      if (isNaN(h) || isNaN(m)) return "❌ Enter time as HH:MM (24h format)";
      const bed = h * 60 + m + 14; // 14 min to fall asleep
      const times = [4, 5, 6].map((cycles) => {
        const wake = (bed + cycles * 90) % 1440;
        return `${Math.floor(wake / 60).toString().padStart(2, "0")}:${(wake % 60).toString().padStart(2, "0")}`;
      });
      return `Wake up at: ${times.join(", ")}\n(After 4, 5, or 6 sleep cycles)`;
    }

    // ---- Date Tools ----
    case "daysBetween": {
      const start = new Date(str("startDate")), end = new Date(str("endDate"));
      const diff = Math.abs(end.getTime() - start.getTime());
      return `${Math.ceil(diff / (1000 * 60 * 60 * 24))} days`;
    }

    case "dateCountdown": {
      const target = new Date(str("targetDate")), now = new Date();
      const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return `${diff} days ${diff >= 0 ? "remaining" : "ago"}`;
    }

    case "timeDifference": {
      const [sh, sm] = str("startTime").split(":").map(Number);
      const [eh, em] = str("endTime").split(":").map(Number);
      if ([sh, sm, eh, em].some(isNaN)) return "❌ Enter times as HH:MM";
      let diff = (eh * 60 + em) - (sh * 60 + sm);
      if (diff < 0) diff += 1440;
      return `${Math.floor(diff / 60)} hours, ${diff % 60} minutes`;
    }

    default:
      return "Logic not implemented for this tool.";
  }
}
