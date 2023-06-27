import ical, { type ICalEventData } from "ical-generator";

const calendar = ical({ name: "my first iCal" });
const startTime = new Date();
const endTime = new Date();
const eventData: ICalEventData = { start: startTime };

endTime.setHours(startTime.getHours() + 1);
calendar.createEvent(eventData);

export default calendar;
