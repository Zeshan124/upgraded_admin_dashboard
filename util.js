export const toTitleCase = (str) =>
  str && str.replace(/\b\w/g, (char) => char.toUpperCase());

export const formatDate = (dateString) => {
  const dateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const date = new Date(dateString);

  // Check if the date is invalid
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const formattedDate = date.toLocaleDateString("en-US", dateOptions);
  const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

  return (
    <div>
      <span>{formattedDate}</span>
      <br />
      <span>{formattedTime}</span>
    </div>
  );
};

// export function getImageURL(
//   imagePath,
//   backendURL = "http://125.209.91.114:3059"
// ) {
//   const imageURL = `${backendURL}/${imagePath}`;
//   return imageURL;
// }
export function getImageURL(
  imagePath,
  backendURL = "https://backend.qistbazaar.pk/"
) {
  let imageURL = `${backendURL}/${imagePath}`;

  // Check if the imagePath contains 'public' and ends with '.webp'
  if (imagePath && imagePath?.includes('public') && imagePath.toLowerCase().endsWith('.webp')) {
    // Remove 'public' from the imagePath for WebP images
    imageURL = imageURL.replace('/public/', '/');
  }

  return imageURL;
}
export const placeHolderImage =
  "/img/no-image-400x400.png";


export const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};


export const status = [
  { label: "Approved", value: "0" },
  { label: "Under Review", value: "1" },
  { label: "Rejected", value: "2" },
  { label: "All", value: null },
];

// Function to get the status label based on the store's status value
export const getStatusLabel = (statusValue) => {
  const statusObj = status.find((item) => item.value === String(statusValue));
  return statusObj ? statusObj.label : "Unknown Status";
};

export function NumbertoAbbreviatedForms(value) {
  if (typeof value !== "number") return value || 0;

  const absValue = Math.abs(value); // Get absolute value to handle negatives
  let formattedValue;

  if (absValue >= 1e9)
    formattedValue = (absValue / 1e9).toFixed(1) + "B"; // Billions
  else if (absValue >= 1e6)
    formattedValue = (absValue / 1e6).toFixed(1) + "M"; // Millions
  else if (absValue >= 1e3)
    formattedValue = (absValue / 1e3).toFixed(1) + "K"; // Thousands
  else formattedValue = absValue.toFixed(2).toString();

  if (formattedValue.endsWith('.00')) {
      formattedValue = formattedValue.slice(0, -3);
  }

  return value < 0 ? `-${formattedValue}` : formattedValue; // Add negative sign back
}
export const appendComparisonParams = (comparisonDates) => {
  if (
    !comparisonDates ||
    !comparisonDates.startDate ||
    !comparisonDates.endDate
  ) {
    return "";
  }

  return `&previousStartDate=${comparisonDates.startDate}&previousEndDate=${comparisonDates.endDate}`;
};
export const SWROnceFetchSetting = {
    revalidateOnFocus: false,     // Disable refetch on window focus
    revalidateOnReconnect: false, // Disable refetch on network reconnect
    refreshInterval: 0,           // No polling
    dedupingInterval: Infinity,   // Never re-fetch again
    shouldRetryOnError: true     // Retry on error
  }

  export     const formatCurrency = (value) => {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        return numValue ? Math.round(numValue).toLocaleString('en-US') : '0';
    }


export const CACHE_KEY = 'currency_data';
export const CACHE_DURATION = 60 * 60 * 1000; 

export const getCurrencySymbol = (currency) => {
  return currency === 'PKR' ? '₨' : '$';
};

export const convertValue = (pkrAmount, selectedCurrency, exchangeRates) => {
  if (selectedCurrency === 'PKR') return pkrAmount;
  if (selectedCurrency === 'USD') {
    const rate = exchangeRates.USD;
    return rate ? pkrAmount * rate : pkrAmount;
  }
  return pkrAmount;
};
