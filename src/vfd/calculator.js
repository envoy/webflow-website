const numLocationsInput = document.querySelector("#num-locations");
const staffPerLocationInput = document.querySelector("#staff-per-location");
const hourlyRateInput = document.querySelector("#hourly-rate");
const workDaysInAWeekInput = document.querySelector("#work-days-in-a-week");
const workHoursPerDayInput = document.querySelector("#work-hours-per-day");
const costSavingsPerMonthInput = document.querySelector(
  "#cost-savings-per-month"
);

console.log({
  numLocationsInput,
  staffPerLocationInput,
  hourlyRateInput,
  workDaysInAWeekInput,
  workHoursPerDayInput,
  costSavingsPerMonthInput,
});

const initialValues = {
  numLocations: 1,
  staffPerLocation: 1,
  hourlyRate: 20,
  workDaysInAWeek: 5,
  workHoursPerDay: 8,
};

// multiply all the initial values together
let costSavingsPerMonth = Object.values(initialValues).reduce(
  (acc, val) => acc * val,
  1
);

console.log({ costSavingsPerMonth });

function init() {
  numLocationsInput.value = initialValues.numLocations;
  staffPerLocationInput.value = initialValues.staffPerLocation;
  hourlyRateInput.value = initialValues.hourlyRate;
  workDaysInAWeekInput.value = initialValues.workDaysInAWeek;
  workHoursPerDayInput.value = initialValues.workHoursPerDay;

  costSavingsPerMonthInput.value = formatCurrency(costSavingsPerMonth);
}
init();

function calculate() {
  const numLocations = parseInt(numLocationsInput.value);
  const staffPerLocation = parseInt(staffPerLocationInput.value);
  const hourlyRate = parseFloat(hourlyRateInput.value);
  const workDaysInAWeek = parseInt(workDaysInAWeekInput.value);
  const workHoursPerDay = parseInt(workHoursPerDayInput.value);

  const costSavingsPerMonth =
    numLocations *
    staffPerLocation *
    hourlyRate *
    workDaysInAWeek *
    workHoursPerDay;

  costSavingsPerMonthInput.value = formatCurrency(costSavingsPerMonth);
}

function formatCurrency(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

numLocationsInput.addEventListener("input", calculate);
staffPerLocationInput.addEventListener("input", calculate);
hourlyRateInput.addEventListener("input", calculate);
workDaysInAWeekInput.addEventListener("input", calculate);
workHoursPerDayInput.addEventListener("input", calculate);
