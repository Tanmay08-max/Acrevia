import { modules, stages, db } from "./data.js";
import { editRecord } from "./editor.js";
const workspace = document.getElementById("workspace"),
  view = document.getElementById("demoView");
let currentModule = "Overview",
  query = "",
  filter = "All";
const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const money = (n) => "₹" + Number(n).toLocaleString("en-IN");
const opts = (arr, value) =>
  arr
    .map((x) => `<option ${x === value ? "selected" : ""}>${esc(x)}</option>`)
    .join("");
function toast(t) {
  document.getElementById("demoNotice").innerHTML =
    `<div class="demo-toast">${esc(t)}</div>`;
}
function showModule(name) {
  currentModule = name;
  query = "";
  filter = "All";
  document.getElementById("demoNotice").textContent = "";
  render();
}
function openDemo(name) {
  showModule(name);
  if (!workspace.open) workspace.showModal();
}
document
  .querySelectorAll("[data-module]")
  .forEach((b) =>
    b.addEventListener("click", () => openDemo(b.dataset.module)),
  );
document.querySelectorAll("[data-record]").forEach(
  (b) =>
    (b.onclick = () => {
      openDemo("Deal pipeline");
      editRecord("deals", Number(b.dataset.record));
    }),
);
document.getElementById("exitDemo").onclick = () => workspace.close();
function matching(row) {
  return (
    JSON.stringify(row).toLowerCase().includes(query.toLowerCase()) &&
    (filter === "All" || row.segment === filter)
  );
}
function toolbar(kind) {
  return `<div class="demo-toolbar"><input id="demoSearch" aria-label="Search demo records" placeholder="Search records…" value="${esc(query)}">${kind !== "visits" ? `<select id="demoFilter" aria-label="Filter property segment">${opts(["All", "Residential", "Commercial"], filter)}</select>` : ""}<button class="btn" data-new="${kind}">+ New ${kind === "deals" ? "deal" : kind === "properties" ? "property" : kind === "contacts" ? "contact" : "site visit"}</button></div>`;
}
function render() {
  document.getElementById("heroDeals").textContent = db.deals.filter(
    (d) => d.stage !== "Closed",
  ).length;
  document.getElementById("heroVisits").textContent = db.visits.length;
  document.getElementById("heroNegotiations").textContent = db.deals.filter(
    (d) => d.stage === "Negotiation",
  ).length;
  document.getElementById("demoNav").innerHTML = modules
    .map(
      (m) =>
        `<button class="${m === currentModule ? "active" : ""}" data-go="${m}">${m}</button>`,
    )
    .join("");
  let content = "";
  if (currentModule === "Overview") {
    content = `<p>Your sample business at a glance. Open a module to try the workflow.</p><div class="demo-grid">${[
      [
        "Active deals",
        db.deals.filter((d) => d.stage !== "Closed").length,
        "Deal pipeline",
      ],
      [
        "Available properties",
        db.properties.filter((p) => p.status === "Available").length,
        "Properties",
      ],
      [
        "Scheduled visits",
        db.visits.filter((v) => v.status === "Scheduled").length,
        "Site visits",
      ],
    ]
      .map(
        ([t, n, m]) =>
          `<article class="demo-card"><p>${t}</p><strong>${n}</strong><br><button class="btn outline" data-go="${m}">View ${m.toLowerCase()} ↗</button></article>`,
      )
      .join(
        "",
      )}</div><h3 style="margin-top:30px">Next actions</h3><div class="demo-grid"><article class="demo-card"><h3>Capture a new enquiry</h3><p>Add a deal and follow its progress across stages.</p><button class="btn" data-new="deals">+ New deal</button></article><article class="demo-card"><h3>Plan a property visit</h3><p>Choose a property, contact and appointment time.</p><button class="btn" data-new="visits">+ Schedule visit</button></article></div>`;
  }
  if (currentModule === "Deal pipeline") {
    content =
      toolbar("deals") +
      `<div class="stage-board">${stages
        .map((stage) => {
          const rows = db.deals.filter((d) => d.stage === stage && matching(d));
          return `<div class="stage-col"><h3>${stage} · ${rows.length}</h3>${rows.map((d) => `<article class="demo-card"><h3>${esc(d.name)}</h3><p>${esc(d.property)}</p><p>${money(d.value)} · ${d.segment}</p><label class="small">Stage<select aria-label="Stage for ${esc(d.name)}" data-stage="${d.id}">${opts(stages, d.stage)}</select></label><button class="btn outline" data-edit="deals:${d.id}">Open deal</button></article>`).join("") || '<p class="small">No deals in this stage.</p>'}</div>`;
        })
        .join("")}</div>`;
  }
  if (currentModule === "Properties") {
    content =
      toolbar("properties") +
      `<div class="demo-grid">${
        db.properties
          .filter(matching)
          .map(
            (p) =>
              `<article class="demo-card"><span class="eyebrow">${p.segment} · ${p.status}</span><h3>${esc(p.name)}</h3><p>${esc(p.city)} · ${esc(p.size)}</p><p>Indicative value: ${money(p.price)}</p><button class="btn outline" data-edit="properties:${p.id}">View / edit property</button> <button class="btn" data-visit="${p.id}">Schedule visit</button></article>`,
          )
          .join("") || '<p class="demo-empty">No matching properties.</p>'
      }</div>`;
  }
  if (currentModule === "Contacts") {
    content =
      toolbar("contacts") +
      `<div class="table-scroll"><table class="demo-table"><thead><tr><th>Name</th><th>Company</th><th>Email</th><th>Segment</th><th>Action</th></tr></thead><tbody>${
        db.contacts
          .filter(matching)
          .map(
            (c) =>
              `<tr><td>${esc(c.name)}</td><td>${esc(c.company)}</td><td>${esc(c.email)}</td><td>${c.segment}</td><td><button class="btn outline" data-edit="contacts:${c.id}">Open contact</button></td></tr>`,
          )
          .join("") || '<tr><td colspan="5">No matching contacts.</td></tr>'
      }</tbody></table></div>`;
  }
  if (currentModule === "Site visits") {
    content =
      toolbar("visits") +
      `<div class="demo-grid">${
        db.visits
          .filter(matching)
          .map(
            (v) =>
              `<article class="demo-card"><span class="eyebrow">${v.status}</span><h3>${esc(v.name)}</h3><p>${esc(v.property)}</p><p>${esc(v.date.replace("T", " · "))}</p><button class="btn outline" data-edit="visits:${v.id}">View / edit visit</button>${v.status === "Scheduled" ? ` <button class="btn" data-complete="${v.id}">Mark completed</button>` : ""}</article>`,
          )
          .join("") || '<p class="demo-empty">No matching visits.</p>'
      }</div>`;
  }
  if (currentModule === "Reports") {
    const total = db.deals.reduce((a, d) => a + Number(d.value), 0);
    content = `<p>Live calculations from the sample records in this session.</p><div class="demo-grid"><article class="demo-card"><p>Total indicative deal value</p><strong>${money(total)}</strong></article><article class="demo-card"><p>Closed deals</p><strong>${db.deals.filter((d) => d.stage === "Closed").length}</strong></article><article class="demo-card"><p>Completed visits</p><strong>${db.visits.filter((d) => d.status === "Completed").length}</strong></article></div><article class="demo-card" style="margin-top:24px"><h3>Deals by stage</h3>${stages
      .map((t) => {
        let n = db.deals.filter((d) => d.stage === t).length;
        return `<span>${t} · ${n}</span><div class="bar"><i style="width:${db.deals.length ? (n / db.deals.length) * 100 : 0}%"></i></div>`;
      })
      .join(
        "",
      )}<p>Sample values are illustrative and may include different transaction types.</p><button class="btn" id="exportDeals">Export deals CSV</button></article>`;
  }
  view.innerHTML = `<h2>${currentModule}</h2>${content}`;
  workspace
    .querySelectorAll("[data-go]")
    .forEach((b) => (b.onclick = () => showModule(b.dataset.go)));
  view
    .querySelectorAll("[data-new]")
    .forEach((b) => (b.onclick = () => editRecord(b.dataset.new)));
  view.querySelectorAll("[data-edit]").forEach(
    (b) =>
      (b.onclick = () => {
        let [k, id] = b.dataset.edit.split(":");
        editRecord(k, Number(id));
      }),
  );
  view.querySelectorAll("[data-stage]").forEach(
    (el) =>
      (el.onchange = () => {
        db.deals.find((d) => d.id === Number(el.dataset.stage)).stage =
          el.value;
        render();
        toast(
          "Deal stage updated. Overview and reports now reflect the change.",
        );
      }),
  );
  view
    .querySelectorAll("[data-visit]")
    .forEach(
      (b) =>
        (b.onclick = () =>
          editRecord(
            "visits",
            null,
            db.properties.find((p) => p.id === Number(b.dataset.visit)).name,
          )),
    );
  view.querySelectorAll("[data-complete]").forEach(
    (b) =>
      (b.onclick = () => {
        db.visits.find((v) => v.id === Number(b.dataset.complete)).status =
          "Completed";
        render();
        toast("Visit marked completed.");
      }),
  );
  const search = document.getElementById("demoSearch");
  if (search)
    search.oninput = () => {
      let pos = search.selectionStart;
      query = search.value;
      render();
      let next = document.getElementById("demoSearch");
      next.focus();
      next.setSelectionRange(pos, pos);
    };
  const f = document.getElementById("demoFilter");
  if (f)
    f.onchange = () => {
      filter = f.value;
      render();
    };
  const exportButton = document.getElementById("exportDeals");
  if (exportButton)
    exportButton.onclick = () => {
      const safe = (v) =>
        '"' +
        String(v)
          .replace(/^[=+@-]/, "'")
          .replace(/"/g, '""') +
        '"';
      let csv = [
        "Name,Property,Segment,Stage,Value",
        ...db.deals.map((d) =>
          [d.name, d.property, d.segment, d.stage, d.value].map(safe).join(","),
        ),
      ].join("\r\n");
      const url = URL.createObjectURL(
        new Blob([csv], { type: "text/csv;charset=utf-8;" }),
      );
      let a = document.createElement("a");
      a.href = url;
      a.download = "Acrevia_Demo_Deals.csv";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast("CSV export requested.");
    };
}
export { esc, money, opts, toast, showModule };
