import moment from "moment-timezone";

const predefinedRanges = {
  "Last 7 Days": [
    moment().tz("Asia/Karachi").subtract(6, "days"),
    moment().tz("Asia/Karachi"),
  ],
  Today: [moment().tz("Asia/Karachi"), moment().tz("Asia/Karachi")],
  Yesterday: [
    moment().tz("Asia/Karachi").subtract(1, "days"),
    moment().tz("Asia/Karachi").subtract(1, "days"),
  ],
  "Last 30 Days": [
    moment().tz("Asia/Karachi").subtract(29, "days"),
    moment().tz("Asia/Karachi"),
  ],
  "This Month": [
    moment().tz("Asia/Karachi").startOf("month"),
    moment().tz("Asia/Karachi"),
  ],
  "Last Month": [
    moment().tz("Asia/Karachi").subtract(1, "month").startOf("month"),
    moment().tz("Asia/Karachi").subtract(1, "month").endOf("month"),
  ],
  "Last 365 Days": [
    moment().tz("Asia/Karachi").subtract(364, "days"),
    moment().tz("Asia/Karachi"),
  ],
};

export default function DateLabel(dates) {
  const { startDate, endDate } = dates || {};
  if (!startDate || !endDate) return "";

  const start = moment(startDate);
  const end = moment(endDate);

  // Check if the range matches a predefined range
  for (const [label, [rangeStart, rangeEnd]] of Object.entries(
    predefinedRanges
  )) {
    if (start.isSame(rangeStart, "day") && end.isSame(rangeEnd, "day")) {
      return label;
    }
  }

  // Fallback to shortened date format
  return `${start.format("DD-MM-YYYY")} - ${end.format("DD-MM-YYYY")}`;
}

