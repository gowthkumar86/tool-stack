import { ToolLogicHandler } from "./shared";

export const converterToolLogic: Record<string, ToolLogicHandler> = {
  kmMiles: (_values, { num, str }) => {
    const value = num("value");

    if (str("direction") === "miles-to-km") {
      return {
        result: (value * 1.60934).toFixed(4) + " km"
      };
    }

    return {
      result: (value * 0.621371).toFixed(4) + " miles"
    };
  },

  kgLbs: (_values, { num, str }) => {
    const value = num("value");

    if (str("direction") === "lbs-to-kg") {
      return {
        result: (value * 0.453592).toFixed(4) + " kg"
      };
    }

    return {
      result: (value * 2.20462).toFixed(4) + " lbs"
    };
  },

  celsiusFahrenheit: (_values, { num, str }) => {
    const value = num("value");

    if (str("direction") === "f-to-c") {
      return {
        result: ((value - 32) * 5 / 9).toFixed(2) + " Â°C"
      };
    }

    return {
      result: (value * 9 / 5 + 32).toFixed(2) + " Â°F"
    };
  },

  mbGb: (_values, { num, str }) => {
    const value = num("value");

    if (str("direction") === "gb-to-mb") {
      return {
        result: (value * 1024).toFixed(2) + " MB"
      };
    }

    return {
      result: (value / 1024).toFixed(4) + " GB"
    };
  },

  lakhMillion: (_values, { num, str }) => {
    const value = num("value");

    if (str("direction") === "million-to-lakh") {
      return {
        result: (value * 10).toFixed(2) + " lakhs"
      };
    }

    return {
      result: (value / 10).toFixed(2) + " million"
    };
  },

  croreMillion: (_values, { num, str }) => {
    const value = num("value");

    if (str("direction") === "million-to-crore") {
      return {
        result: (value / 10).toFixed(2) + " crore"
      };
    }

    return {
      result: (value * 10).toFixed(2) + " million"
    };
  },

  inchesCm: (_values, { num, str }) => {
    const value = num("value");

    if (str("direction") === "cm-to-in") {
      return {
        result: (value / 2.54).toFixed(4) + " inches"
      };
    }

    return {
      result: (value * 2.54).toFixed(4) + " cm"
    };
  },

  litersGallons: (_values, { num, str }) => {
    const value = num("value");

    if (str("direction") === "gal-to-l") {
      return {
        result: (value * 3.78541).toFixed(4) + " liters"
      };
    }

    return {
      result: (value * 0.264172).toFixed(4) + " gallons"
    };
  }
};
