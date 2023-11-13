export const shiftRowRegex =
  /(?:(?:1|3|5|6)(?:[0-5])(?:\d{1})|(?:9|8)(?:\d{5})(?:[a-z]?)|(RD|CL|AL|GH|SH)){7}/gim;

export const shiftNameRegex =
  /(^[1356][0-5]\d{1}$)|([98]\d{5}[a-z]?)|(RD|CL|AL|GH|SH)|^\s*$/gm;
// /(^([1356][0-5]\d{1}){0,1}$)|(^(98)\d{5}[a-z]?){0,1}|((RD|CL|AL|GH|SH)){0,1}/gim;
// /(?:^(?:1|3|5|6)(?:[0-5])(?:\d{1}$)|(?:^9|8)(?:\d{5})(?:[a-z]?)|(RD|CL|AL|GH|SH))/gim;

export const shiftNumberRegex = /(?:(?:1|3|5|6)[0-5]\d{1})/;

export const abbreviatedDutyNumber =
  /(?:(?:(?:1|3|5|6)[0-5]\d{1})|(?:9|8)(?:\d{5})(?:[a-z]?))/gim;

export const shiftCodeRegex =
  /(^\d{3}$)|(^(?:[A-Z])(?:1[3|4|5]|7[1|5])(\d{3}$)){1}/gim;

export const threeDigitShiftRegex = /^\d{3}$/;

export const prefixRegex = /(?:[A-Z])(?:1[3|4|5]|7[1|5])/i;

export const dutyInputRegExValidator =
  /((?:1|3|5|6)(?:[0-5])(?:\d))|((?:(?:[A-Z])(?:1[3|4|5]|7[1|5]))(?:1|3|5|6)(?:[0-5])(?:\d)(?:\w?)|(?:9|8)(?:\d{5})(?:\w?))/;

export const completeShiftNameRegex =
  /((?:(?:[A-Z])(?:1[3|4|5]|7[1|5]))(?:1|3|5|6)(?:[0-5])(?:\d)(?:\w?)|(?:9|8)(?:\d{5})(?:\w?))/;
