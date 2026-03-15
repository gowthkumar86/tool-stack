import { ToolLogicHandler } from "./shared";

export const healthToolLogic: Record<string, ToolLogicHandler> = {
  bmi: (_values, { num }) => {
    const bmi = num("weight") / Math.pow(num("height") / 100, 2);

    let category = "Normal";

    if (bmi < 18.5) {
      category = "Underweight";
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight";
    } else if (bmi >= 30) {
      category = "Obese";
    }

    return {
      bmi: bmi.toFixed(1),
      category
    };
  },

  calories: (_values, { num }) => {
    const bmr =
      10 * num("weight") +
      6.25 * num("height") -
      5 * num("age") -
      161;

    const calories = Math.round(
      bmr * num("activityLevel")
    );

    return {
      dailyCalories: calories,
      bmr: Math.round(bmr)
    };
  },

  waterIntake: (_values, { num, str }) => {
    const base = num("weight") * 35 / 1000;

    const levels: Record<string, number> = {
      "1": 0,
      "2": 0.5,
      "3": 1
    };

    const extra = levels[str("activityLevel")] || 0.5;

    return {
      waterLiters: (base + extra).toFixed(1)
    };
  },

  sleepCycle: (_values, { str }) => {
    const [h, m] = str("bedtime")
      .split(":")
      .map(Number);

    if (isNaN(h) || isNaN(m)) {
      return {
        wakeTimes: "âŒ Enter time as HH:MM (24h format)"
      };
    }

    const bed = h * 60 + m + 14;

    const times = [4, 5, 6].map((cycles) => {
      const wake = (bed + cycles * 90) % 1440;

      const hours = Math.floor(wake / 60)
        .toString()
        .padStart(2, "0");

      const mins = (wake % 60)
        .toString()
        .padStart(2, "0");

      return `${hours}:${mins}`;
    });

    return {
      wakeTimes: times.join(", ")
    };
  }
};
