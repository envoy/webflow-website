<script>
// When a user clicks the #apple-calendar button, generate and download an ICS file
document.querySelector("#apple-calendar").addEventListener("click", function(e) {
  e.preventDefault();

  // Create an iCalendar (.ics) file with updated event details
  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Minus5 Ice Experience - Envoy Happy Hour
DTSTART;TZID=America/Los_Angeles:20250401T170000
DTEND;TZID=America/Los_Angeles:20250401T190000
LOCATION:3377 S Las Vegas Blvd. STE 2140, Las Vegas, NV 89109
DESCRIPTION:We’re hosting a happy hour at the Minus5 Ice Bar at The Venetian!\\n\\nCome cool off from the desert heat, enjoy free refreshments, and pick up some Envoy swag. Gloves and a coat will be provided—no need to bring your own!\\n\\nRSVP by March 31.
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT10M
DESCRIPTION:Reminder
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`.trim();

  // Turn the ICS text into a downloadable file
  const blob = new Blob([icsContent], { type: "text/calendar" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "envoy-isc-west-happy-hour.ics";

  // Programmatically click the link to download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
</script>
