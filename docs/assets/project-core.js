(function () {
  "use strict";

  const PAGE_SIZE = 12;

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = "";
    let quoted = false;

    for (let index = 0; index < text.length; index += 1) {
      const character = text[index];
      const next = text[index + 1];

      if (character === '"' && quoted && next === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = !quoted;
      } else if (character === "," && !quoted) {
        row.push(field);
        field = "";
      } else if ((character === "\n" || character === "\r") && !quoted) {
        if (character === "\r" && next === "\n") index += 1;
        row.push(field);
        if (row.some((value) => value.length)) rows.push(row);
        row = [];
        field = "";
      } else {
        field += character;
      }
    }

    if (field.length || row.length) {
      row.push(field);
      rows.push(row);
    }

    const headers = (rows.shift() || []).map((header) => header.trim());
    return rows.map((values) =>
      Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]))
    );
  }

  const number = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const sum = (rows, key) => rows.reduce((total, row) => total + number(row[key]), 0);
  const average = (rows, key) => (rows.length ? sum(rows, key) / rows.length : 0);
  const percent = (numerator, denominator) => (denominator ? numerator / denominator : 0);

  const formats = {
    count: (value) => Math.round(number(value)).toLocaleString("en-US"),
    decimal: (value) =>
      number(value).toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }),
    currency: (value) =>
      number(value).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
      }),
    currency2: (value) =>
      number(value).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
    percentage: (value) =>
      number(value).toLocaleString("en-US", {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }),
    text: (value) => String(value ?? "")
  };

  function formatValue(value, format) {
    if (typeof format === "function") return format(value);
    return (formats[format] || formats.text)(value);
  }

  function groupRows(rows, key) {
    const groups = new Map();
    rows.forEach((row) => {
      const value = row[key] || "Not specified";
      if (!groups.has(value)) groups.set(value, []);
      groups.get(value).push(row);
    });
    return groups;
  }

  function renderFilters(config, rows, selections, update) {
    const grid = document.getElementById("filterGrid");
    grid.innerHTML = "";

    config.filters.forEach((filter) => {
      const wrapper = document.createElement("div");
      wrapper.className = "filter-field";

      const label = document.createElement("label");
      const id = `filter-${filter.key}`;
      label.setAttribute("for", id);
      label.textContent = filter.label;

      const select = document.createElement("select");
      select.id = id;
      select.dataset.key = filter.key;

      const all = document.createElement("option");
      all.value = "";
      all.textContent = `All ${filter.label}`;
      select.appendChild(all);

      [...new Set(rows.map((row) => row[filter.key]).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b))
        .forEach((value) => {
          const option = document.createElement("option");
          option.value = value;
          option.textContent = value;
          select.appendChild(option);
        });

      select.value = selections[filter.key] || "";
      select.addEventListener("change", () => {
        selections[filter.key] = select.value;
        update();
      });

      wrapper.append(label, select);
      grid.appendChild(wrapper);
    });
  }

  function renderKpis(config, rows) {
    const container = document.getElementById("kpis");
    container.innerHTML = "";

    config.kpis.forEach((kpi) => {
      const card = document.createElement("div");
      card.className = "kpi-card";

      const label = document.createElement("small");
      label.textContent = kpi.label;

      const value = document.createElement("strong");
      value.textContent = formatValue(kpi.value(rows), kpi.format);

      card.append(label, value);
      container.appendChild(card);
    });
  }

  function renderCharts(config, rows) {
    const container = document.getElementById("charts");
    container.innerHTML = "";

    config.charts.forEach((chart) => {
      const card = document.createElement("article");
      card.className = "chart-card";

      const heading = document.createElement("h3");
      heading.textContent = chart.title;
      const note = document.createElement("p");
      note.className = "chart-note";
      note.textContent = chart.note;
      const list = document.createElement("div");
      list.className = "bar-list";

      const chartRows = chart.filter ? rows.filter(chart.filter) : rows;
      const values = [...groupRows(chartRows, chart.groupBy).entries()]
        .map(([label, group]) => ({
          label,
          value: number(chart.value(group))
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, chart.limit || 8);

      const maximum = Math.max(...values.map((item) => item.value), 0);

      values.forEach((item) => {
        const row = document.createElement("div");
        row.className = "bar-row";
        row.title = `${item.label}: ${formatValue(item.value, chart.format)}`;

        const label = document.createElement("div");
        label.className = "bar-label";
        label.textContent = item.label;

        const track = document.createElement("div");
        track.className = "bar-track";
        const fill = document.createElement("div");
        fill.className = "bar-fill";
        fill.style.width = `${maximum ? Math.max(2, (item.value / maximum) * 100) : 0}%`;
        track.appendChild(fill);

        const value = document.createElement("div");
        value.className = "bar-value";
        value.textContent = formatValue(item.value, chart.format);

        row.append(label, track, value);
        list.appendChild(row);
      });

      if (!values.length) {
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.textContent = "No records match the current filters.";
        list.appendChild(empty);
      }

      card.append(heading, note, list);
      container.appendChild(card);
    });
  }

  function renderTable(config, rows, state) {
    const table = document.getElementById("dataTable");
    const meta = document.getElementById("tableMeta");
    const pager = document.getElementById("tablePager");
    const query = state.search.trim().toLowerCase();

    const searched = query
      ? rows.filter((row) =>
          config.columns.some((column) =>
            String(row[column.key] ?? "").toLowerCase().includes(query)
          )
        )
      : rows;

    const totalPages = Math.max(1, Math.ceil(searched.length / PAGE_SIZE));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * PAGE_SIZE;
    const pageRows = searched.slice(start, start + PAGE_SIZE);

    table.innerHTML = "";
    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    config.columns.forEach((column) => {
      const cell = document.createElement("th");
      cell.textContent = column.label;
      headRow.appendChild(cell);
    });
    head.appendChild(headRow);
    table.appendChild(head);

    const body = document.createElement("tbody");
    pageRows.forEach((row) => {
      const tableRow = document.createElement("tr");
      config.columns.forEach((column) => {
        const cell = document.createElement("td");
        cell.textContent = formatValue(row[column.key], column.format);
        tableRow.appendChild(cell);
      });
      body.appendChild(tableRow);
    });
    table.appendChild(body);

    meta.textContent = searched.length
      ? `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, searched.length)} of ${searched.length.toLocaleString()} records`
      : "No matching records";

    pager.innerHTML = "";
    const previous = document.createElement("button");
    previous.type = "button";
    previous.textContent = "Previous";
    previous.disabled = state.page === 1;
    previous.addEventListener("click", () => {
      state.page -= 1;
      renderTable(config, rows, state);
    });

    const page = document.createElement("span");
    page.textContent = `Page ${state.page} of ${totalPages}`;

    const next = document.createElement("button");
    next.type = "button";
    next.textContent = "Next";
    next.disabled = state.page === totalPages;
    next.addEventListener("click", () => {
      state.page += 1;
      renderTable(config, rows, state);
    });

    pager.append(previous, page, next);
  }

  async function initialize() {
    const config = window.PROJECT_CONFIG;
    const dashboard = document.querySelector(".dashboard-shell");
    if (!config || !dashboard) return;

    const filters = document.getElementById("filterGrid");
    filters.innerHTML = '<div class="loading">Loading the project dataset…</div>';

    try {
      const response = await fetch(config.dataUrl);
      if (!response.ok) throw new Error(`Dataset returned ${response.status}`);
      const allRows = parseCsv(await response.text());
      const baseRows = config.baseFilter ? allRows.filter(config.baseFilter) : allRows;
      const selections = {};
      const state = { search: "", page: 1 };

      const update = () => {
        const filteredRows = baseRows.filter((row) =>
          config.filters.every(
            (filter) => !selections[filter.key] || row[filter.key] === selections[filter.key]
          )
        );

        const active = config.filters
          .filter((filter) => selections[filter.key])
          .map((filter) => `${filter.label}: ${selections[filter.key]}`);

        document.getElementById("filterSummary").textContent = active.length
          ? `${filteredRows.length.toLocaleString()} records · ${active.join(" · ")}`
          : `Showing all ${filteredRows.length.toLocaleString()} records.`;

        state.page = 1;
        renderKpis(config, filteredRows);
        renderCharts(config, filteredRows);
        renderTable(config, filteredRows, state);
      };

      renderFilters(config, baseRows, selections, update);

      const search = document.getElementById("tableSearch");
      search.addEventListener("input", () => {
        state.search = search.value;
        state.page = 1;
        const filteredRows = baseRows.filter((row) =>
          config.filters.every(
            (filter) => !selections[filter.key] || row[filter.key] === selections[filter.key]
          )
        );
        renderTable(config, filteredRows, state);
      });

      document.getElementById("resetFilters").addEventListener("click", () => {
        Object.keys(selections).forEach((key) => {
          selections[key] = "";
        });
        document.querySelectorAll("#filterGrid select").forEach((select) => {
          select.value = "";
        });
        search.value = "";
        state.search = "";
        state.page = 1;
        update();
      });

      update();
    } catch (error) {
      filters.innerHTML =
        '<div class="error">The dashboard dataset could not load. Refresh the page or use the downloadable CSV below.</div>';
      console.error(error);
    }
  }

  window.PortfolioAnalytics = { number, sum, average, percent, formats };
  document.addEventListener("DOMContentLoaded", initialize);
})();
