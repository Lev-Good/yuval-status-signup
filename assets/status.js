// This is the existing anonymous browser key. Keep privileged keys server-side.
const apiUrl = "https://jljyyoxbrcmfkjggvgnm.supabase.co";
const anonymousKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impsanl5b3hicmNtZmtqZ2d2Z25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MjQ3NDYsImV4cCI6MjA5ODQwMDc0Nn0.IlsDYK_B3_Ag93-ii4fQxp7nrrXcvghiFRH0grzfkVU";
const track = document.body.dataset.track;
const form = document.querySelector("form");
const button = form.querySelector("button");
const errorMessage = document.querySelector("#error");
const successMessage = document.querySelector("#success");
const buttonLabel = button.textContent;
button.disabled = false;

function showError(message, field) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
  if (field) field.focus();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (button.disabled) return;
  errorMessage.hidden = true;

  const nameField = form.elements.namedItem("name");
  const phoneField = form.elements.namedItem("phone");
  const name = nameField.value.trim();
  const phone = phoneField.value.trim();
  if (!name || name.length > 100) {
    showError("נא להזין שם", nameField);
    return;
  }
  if (!phone || phone.length > 30) {
    showError("נא להזין מספר וואטסאפ", phoneField);
    return;
  }

  button.disabled = true;
  button.textContent = "שולח...";
  try {
    const response = await fetch(apiUrl + "/rest/v1/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonymousKey,
        Authorization: "Bearer " + anonymousKey,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ name, phone, track }),
    });
    if (!response.ok) throw new Error("The lead could not be saved.");
    form.reset();
    form.hidden = true;
    successMessage.hidden = false;
    successMessage.focus();
  } catch {
    showError("משהו השתבש, נסו שוב בעוד רגע.");
  } finally {
    button.textContent = buttonLabel;
    button.disabled = false;
  }
});