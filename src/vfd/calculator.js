const numLocationsInput = document.querySelector("#num-locations");
const staffPerLocationInput = document.querySelector("#staff-per-location");
// const hourlyRateInput = document.querySelector("#hourly-rate"); // plain
const workDaysInAWeekInput = document.querySelector("#work-days-in-a-week");
const workHoursPerDayInput = document.querySelector("#work-hours-per-day");
const costSavingsPerMonthInput = document.querySelector(
  "#cost-savings-per-month"
);

const initialValues = {
  numLocations: 3,
  staffPerLocation: 2,
  // hourlyRate: 30,
  workDaysInAWeek: 5,
  workHoursPerDay: 8,
};

const weeksInAMonth = 4.2857;

// multiply all the initial values together
let costSavingsPerMonth = Object.values(initialValues).reduce(
  (acc, val) => acc * val,
  1
);

function init() {
  numLocationsInput.value = initialValues.numLocations;
  staffPerLocationInput.value = initialValues.staffPerLocation;
  // hourlyRateInput.value = initialValues.hourlyRate;
  workDaysInAWeekInput.value = initialValues.workDaysInAWeek;
  workHoursPerDayInput.value = initialValues.workHoursPerDay;

  calculate({ target: costSavingsPerMonthInput });
}
init();

function calculate(event) {
  event.target.classList.remove("initial-font-color");

  const numLocations = parseInt(numLocationsInput.value);
  const staffPerLocation = parseInt(staffPerLocationInput.value);
  // const hourlyRate = parseInt(hourlyRateInput.value);
  const workDaysInAWeek = parseInt(workDaysInAWeekInput.value);
  const workHoursPerDay = parseInt(workHoursPerDayInput.value);

  const costSavingsPerMonth =
    numLocations *
    staffPerLocation *
    // hourlyRate *
    workDaysInAWeek *
    workHoursPerDay *
    weeksInAMonth;

  costSavingsPerMonthInput.value = costSavingsPerMonth.toFixed(1);
}

// function formatCurrency(value) {
//   return value.toLocaleString("en-US", {
//     style: "currency",
//     currency: "USD",
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   });
// }

numLocationsInput.addEventListener("input", calculate);
staffPerLocationInput.addEventListener("input", calculate);
// hourlyRateInput.addEventListener("input", calculate);
workDaysInAWeekInput.addEventListener("input", calculate);
workHoursPerDayInput.addEventListener("input", calculate);
