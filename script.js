const form = document.getElementById("candidateForm");
const formSteps = [...document.querySelectorAll(".form-step")];
const progress = document.getElementById("progress");
const progressSteps = [...document.querySelectorAll(".progress-step")];

let currentStep = 0;

/* ---------- Helpers ---------- */
function showStep(step) {
  formSteps.forEach((el, i) => el.classList.toggle("active", i === step));
  updateProgress(step);
}

function updateProgress(step) {
  progressSteps.forEach((el, i) => {
    el.classList.toggle("active", i <= step);
    el.innerHTML = i < step ? "✔" : i + 1; // checkmark for completed
  });
  progress.style.width = (step / (progressSteps.length - 1)) * 100 + "%";
}

function collectReviewData() {
  document.getElementById("reviewName").textContent = form.fullname.value || "—";
  document.getElementById("reviewEmail").textContent = form.email.value || "—";
  document.getElementById("reviewPhone").textContent = form.phone.value || "—";
  document.getElementById("reviewPosition").textContent = form.position.value || "—";
  document.getElementById("reviewExperience").textContent = form.experience.value || "—";
  document.getElementById("reviewResume").textContent =
    form.resume.files[0]?.name || "No file";
}

function validateStep(step) {
  const inputs = formSteps[step].querySelectorAll("input, select");
  return [...inputs].every((input) => input.checkValidity());
}

/* ---------- Navigation ---------- */
form.addEventListener("click", (e) => {
  if (e.target.classList.contains("next")) {
    if (!validateStep(currentStep)) {
      form.reportValidity();
      return;
    }
    if (currentStep < formSteps.length - 1) {
      currentStep++;
      if (currentStep === 2) collectReviewData();
      showStep(currentStep);
    }
  }

  if (e.target.classList.contains("prev")) {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  }
});

/* ---------- File Upload Display ---------- */
form.resume.addEventListener("change", () => {
  document.getElementById("file-chosen").textContent =
    form.resume.files[0]?.name || "No file chosen";
});

/* ---------- Form Submit ---------- */

const url = "https://script.google.com/macros/s/AKfycbyOr-Y5tquHIjtVNunuuVAyP9lsMJVb-BVKDTe79c3cGecbpxUYPJcK9Z9iyjKyNIVg/exec"; // paste your Web App URL

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    fullname: form.fullname.value,
    email: form.email.value,
    phone: form.phone.value,
    position: form.position.value,
    experience: form.experience.value,
    resume: form.resume.files[0]?.name || "No file"
  };

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      mode: "no-cors"   // 👈 allows it to work from localhost:3000
    });

    document.getElementById("responseMsg").textContent =
      "✅ Application submitted successfully! (Saved to Google Sheet)";
    form.reset();

  } catch (err) {
    document.getElementById("responseMsg").textContent =
      "⚠ Error: " + err.message;
  }
});


/* ---------- Init ---------- */
showStep(currentStep);



/*server side

await fetch("http://localhost:5000/submit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
});
*/


