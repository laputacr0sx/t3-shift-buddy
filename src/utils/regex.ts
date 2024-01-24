export const shiftRowRegex =
    /(?:(?:1|3|5|6)(?:[0-5])(?:\d{1})|(?:9|8)(?:\d{5})(?:[a-z]?)|(RD|CL|AL|GH|SH)){7}/gim;

export const dayOffRegex = /(RD|AL|CL|GH|SH|MA_L|WB_L)/gim;

export const specialDutyRegex = /([89]\d{5}[a-zA-Z]?)/gim;

export const proShiftNameRegex =
    /([89]\d{5}[a-zA-Z]?)(?=(RD|AL|CL|GH|SH))|(RD|AL|CL|GH|SH)|([89]\d{5}[a-zA-Z]?)|([1356][0-5]\d)/gim;

export const shiftNameRegex =
    /([1356][0-5]\d{1})|([98]\d{5}[a-z]?)|(RD|CL|AL|GH|SH)/gim;

export const urlShiftSequenceRegex = /[a-zA-z]{2}(\d+|RD|AL|CL|GH|SH)/gim;

export const inputShiftCodeRegex =
    /(^[1356][0-5]\d{1}$)|([98]\d{5}[a-z]?)|(RD|CL|AL|GH|SH)|^\s*$/gm;
// /(^([1356][0-5]\d{1}){0,1}$)|(^(98)\d{5}[a-z]?){0,1}|((RD|CL|AL|GH|SH)){0,1}/gim;
// /(?:^(?:1|3|5|6)(?:[0-5])(?:\d{1}$)|(?:^9|8)(?:\d{5})(?:[a-z]?)|(RD|CL|AL|GH|SH))/gim;

export const shiftNumberRegex = /(?:(?:1|3|5|6)[0-5]\d{1})/;

export const abbreviatedDutyNumber = /^([1356][0-5]\d{1})/gim;

export const shiftCodeRegex =
    /(^\d{3}$)|(^(?:[A-Z])(?:1[3|4|5]|7[1|5])(\d{3}$)){1}/gim;

export const threeDigitShiftRegex = /^\d{3}$/;

export const prefixRegex = /(?:[A-Z])(?:1[3|4|5]|7[1|5])/i;

export const dutyInputRegExValidator =
    /((?:1|3|5|6)(?:[0-5])(?:\d))|((?:(?:[A-Z])(?:1[3|4|5]|7[1|5]))(?:1|3|5|6)(?:[0-5])(?:\d)(?:\w?)|(?:9|8)(?:\d{5})(?:\w?))/;

export const completeShiftNameRegex =
    /((?:(?:[A-Z])(?:1[3|4|5]|7[1|5]))((?:1|3|5|6)(?:[0-5])(?:\d)(?:\w?)|DC|AL|RD|RC|HC|)|(?:9|8)(?:\d{5})(?:\w?))/;

export const rowSequenceRegex = /[ABCS]\d{1,3}/gim;

export const rostaRegex = /DC|AL|RD|RC|HC|\d{3}/gim;
