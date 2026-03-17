import isNil from "lodash/isNil";

export const nvFormatDate = (date: Date | string | null | undefined, hideTime: boolean = false) => {
  const locale = "en-US";
  if (isNil(date)) return "N/A";
  const _date = (() => {
    if (typeof date === "string") {
      const d = new Date(date);
      return d;
    }
    return date;
  })();
  return _date.toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
    ...(hideTime
      ? {}
      : {
          hour: "2-digit",
          minute: "2-digit"
        })
  });
};
