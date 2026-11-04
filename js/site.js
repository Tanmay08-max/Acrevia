const modal = document.getElementById("enquiry"),
  form = document.getElementById("leadForm"),
  statusBox = document.getElementById("formStatus");
document.querySelectorAll("[data-enquiry]").forEach((b) =>
  b.addEventListener("click", () => {
    document.getElementById("formTitle").textContent = b.dataset.enquiry;
    form.reset();
    statusBox.hidden = true;
    modal.showModal();
  }),
);
document.querySelector(".close").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    const r = modal.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      modal.close();
  }
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  statusBox.textContent =
    "Preview complete. Your enquiry passes the form checks. Nothing has been sent or saved; a live enquiry connection is needed before launch.";
  statusBox.hidden = false;
});
document.getElementById("users").addEventListener("input", (e) => {
  const n = Number(e.target.value);
  document.getElementById("total").textContent =
    Number.isInteger(n) && n >= 1 && n <= 10000
      ? "₹" + (n * 999).toLocaleString("en-IN") + " / month"
      : "Enter 1–10,000 whole users";
});
document.querySelectorAll(".native-menu-links a").forEach((a) =>
  a.addEventListener("click", () => {
    document.querySelector(".native-menu").open = false;
  }),
);
