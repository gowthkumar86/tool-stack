import { ToolLogicHandler } from "./shared";

export const dateToolLogic: Record<string, ToolLogicHandler> = {
  daysBetween: (_values, { str }) => {
    const start = new Date(str("startDate"));
    const end = new Date(str("endDate"));
    const diff = Math.abs(
      end.getTime() - start.getTime()
    );

    const days = Math.ceil(
      diff / (1000 * 60 * 60 * 24)
    );

    return {
      daysBetween: days
    };
  },

  dateCountdown: (_values, { str }) => {
    const target = new Date(str("targetDate"));
    const now = new Date();
    const diff = Math.ceil(
      (target.getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return {
      daysRemaining: diff >= 0
        ? `${diff} days remaining`
        : `${Math.abs(diff)} days ago`
    };
  },

  timeDifference: (_values, { str }) => {
    const [sh, sm] = str("startTime")
      .split(":")
      .map(Number);

    const [eh, em] = str("endTime")
      .split(":")
      .map(Number);

    if ([sh, sm, eh, em].some(isNaN)) {
      return {
        timeDifference: "âŒ Enter times as HH:MM"
      };
    }

    let diff =
      (eh * 60 + em) -
      (sh * 60 + sm);

    if (diff < 0) {
      diff += 1440;
    }

    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    return {
      timeDifference: `${hours} hours ${minutes} minutes`
    };
  }
};
