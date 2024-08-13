document
  .querySelector("#apple-calendar")
  .addEventListener("click", function (e) {
    e.preventDefault();

    // Create an iCalendar (.ics) file content with updated event details
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Top Golf Happy Hour by Envoy
DTSTART;TZID=America/New_York:20240923T163000
DTEND;TZID=America/New_York:20240923T190000
LOCATION:9295 Universal Blvd, Orlando, FL 32819
DESCRIPTION:Thank you for registering for the Envoy Top Golf Happy Hour!\\n\\nAs the event approaches, we will provide you with additional information about the venue and any other necessary details.\\n\\nPrepare to show off your golf skills and get ready for an evening filled with networking and fun! We can't wait to see you at the event! If you have other guests attending, please have each guest RSVP here: https://envoy.com/events/global-security-exchange-2024.
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT10M
DESCRIPTION:Reminder
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

    // Create a Blob from the iCalendar content
    const blob = new Blob([icsContent.trim()], { type: "text/calendar" });

    // Create a link element and trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "envoy-top-golf-happy-hour.ics";

    // Append the link to the body and click it programmatically
    document.body.appendChild(link);
    link.click();

    // Clean up the link after the download
    document.body.removeChild(link);
  });
