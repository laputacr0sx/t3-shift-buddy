export const shiftRowRegex =
  /(?:(?:1|3|5|6)(?:[0-5])(?:\d{1})|(?:9|8)(?:\d{5})(?:[a-z]?)|(RD|CL|AL|GH|SH)){7}/gim;

export const sevenShiftRegex =
  /(?:(?:1|3|5|6)(?:[0-5])(?:\d{1})|(?:9|8)(?:\d{5})(?:[a-z]?)|(RD|CL|AL|GH|SH))/gim;

export const shiftCodeRegex =
  /(^\d{3}$)|(^(?:[A-Z])(?:1[3|4|5]|7[1|5])(\d{3}$)){1}/gim;

export const threeDigitShiftRegex = /^\d{3}$/;

export const prefixRegex = /(?:[A-Z])(?:1[3|4|5]|7[1|5])/i;

export const dutyInputRegExValidator =
  /((?:1|3|5|6)(?:[0-5])(?:\d))|((?:(?:[A-Z])(?:1[3|4|5]|7[1|5]))(?:1|3|5|6)(?:[0-5])(?:\d)(?:\w?)|(?:9|8)(?:\d{5})(?:\w?))/;
