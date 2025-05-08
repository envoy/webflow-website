
document.addEventListener("DOMContentLoaded", function () {
// When a user clicks the #apple-calendar button, generate and download an ICS file
  document.querySelector("#apple-calendar").addEventListener("click", function(e) {
    e.preventDefault();
  
    // Create an iCalendar (.ics) file with updated event details
    const icsContent = `
  BEGIN:VCALENDAR
  VERSION:2.0
  PRODID:An evening at the Chef’s Table with Envoy
  BEGIN:VEVENT
  DTSTART:20250626T220000Z
  DTEND:20250627T010000Z
  DTSTAMP:20250507T181622Z
  SUMMARY:An evening at the Chef’s Table with Envoy
  DESCRIPTION:Join Envoy for a private dinner bringing together an exclusive group of workplace and security leaders for meaningful conversation, shared insights, and an exceptional culinary experience by Chef Leah Cohen.
  LOCATION:305 Bleecker Street - New York, NY 10014
  UID:84187
  END:VEVENT
  END:VCALENDAR
  `.trim();
  
    // Turn the ICS text into a downloadable file
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "envoy-q2fy26-nyc-dinner.ics";
  
    // Programmatically click the link to download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});
