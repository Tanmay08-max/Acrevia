import { stages, db } from "./data.js";
import { esc, opts, toast, showModule } from "./workspace.js";
const editor = document.getElementById("recordEditor");
document.querySelector(".close-editor").onclick = () => editor.close();
export function editRecord(kind, id = null, property = "") {
  let row = id ? db[kind].find((x) => x.id === id) : {};
  document.getElementById("editorTitle").textContent =
    (id ? "Edit " : "New ") +
    {
      deals: "deal",
      properties: "property",
      contacts: "contact",
      visits: "site visit",
    }[kind];
  const field = (key, label, type = "text", values = null) =>
    `<label>${label}${values ? `<select name="${key}" required>${opts(values, row[key] || values[0])}</select>` : `<input name="${key}" type="${type}" value="${esc(row[key] ?? (key === "property" ? property : ""))}" required ${type === "number" ? 'min="0" step="1"' : 'maxlength="150"'}>`}</label>`;
  let fields = field(
    "name",
    kind === "properties"
      ? "Property name"
      : kind === "visits"
        ? "Contact / visitor name"
        : "Name",
  );
  if (kind === "deals")
    fields +=
      field("property", "Property / requirement") +
      field("segment", "Segment", "text", ["Residential", "Commercial"]) +
      field("value", "Indicative deal value (₹)", "number") +
      field("stage", "Stage", "text", stages);
  if (kind === "properties")
    fields +=
      field("city", "City") +
      field("segment", "Segment", "text", ["Residential", "Commercial"]) +
      field("size", "Configuration / size") +
      field("price", "Indicative value (₹)", "number") +
      field("status", "Availability", "text", [
        "Available",
        "Reserved",
        "Sold / leased",
      ]);
  if (kind === "contacts")
    fields +=
      field("company", "Company / individual") +
      field("email", "Email", "email") +
      field("segment", "Segment", "text", ["Residential", "Commercial"]);
  if (kind === "visits")
    fields +=
      field("property", "Property") +
      field("date", "Visit date and time", "datetime-local") +
      field("status", "Status", "text", [
        "Scheduled",
        "Completed",
        "Cancelled",
      ]);
  const form = document.getElementById("recordForm");
  form.innerHTML =
    fields +
    '<button class="btn" type="submit">Save ' +
    (id ? "changes" : "record") +
    '</button><p class="small">Demo session only. No information is sent to a server.</p>';
  form.onsubmit = (e) => {
    e.preventDefault();
    let data = Object.fromEntries(new FormData(form));
    for (const k of Object.keys(data)) {
      data[k] = data[k].trim();
      if (!data[k]) {
        form.elements[k].setCustomValidity("Enter a value.");
        form.elements[k].reportValidity();
        form.elements[k].oninput = () => form.elements[k].setCustomValidity("");
        return;
      }
    }
    if (data.value) data.value = Number(data.value);
    if (data.price) data.price = Number(data.price);
    if (id) Object.assign(row, data);
    else
      db[kind].push({
        ...data,
        id: Math.max(0, ...db[kind].map((r) => r.id)) + 1,
      });
    editor.close();
    showModule(
      {
        deals: "Deal pipeline",
        properties: "Properties",
        contacts: "Contacts",
        visits: "Site visits",
      }[kind],
    );
    toast(id ? "Record updated." : "Record created.");
  };
  editor.showModal();
}
