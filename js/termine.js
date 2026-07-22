/* termine.js — Event-Liste mit Auto-Crossout vergangener Termine */

(function () {
  "use strict";

  // Format: ISO-Datum (YYYY-MM-DD). endDate optional für mehrtägig.
  // status: "upcoming" | "past" wird automatisch anhand today gesetzt.
  var EVENTS = [
    {
      start: "2026-09-17", end: null,
      title: "Fortbildung „Singen und Musizieren in der KiTa“",
      desc: "Einführungsworkshop für Erzieher*innen",
      location: "Offene Jazz Haus Schule, Köln",
      tags: []
    },
    {
      start: "2026-10-03", end: null,
      title: "Mozart Requiem",
      desc: "Kammerchor „Voci di Fuoco“ — Leitung: Fabian Hemmelmann",
      location: "Christuskirche, Bonn",
      tags: []
    },
    {
      start: "2026-11-06", end: "2026-11-08",
      title: "Fortbildung „Singen neu entdecken“",
      desc: "Praxisnahes, kreatives und bedürfnisorientiertes Singen mit Kindern — Arbeitskreis Musik in der Jugend (AMJ) — mit Nicole Lena de Terry und Lisa Meier",
      location: "musa Kulturzentrum, Göttingen",
      tags: []
    }
    // Past dates folgen — Platzhalter
  ];

  // Expose for next-event teaser on landing page
  window.TERMINE_EVENTS = EVENTS;

  var PAST_EVENTS = [
    // { start: "2025-06-01", end: null, title: "...", desc: "...", location: "...", tags: [] }
  ];

  function parseDate(s) { return new Date(s + "T00:00:00"); }

  function fmtMonth(d) { return d.toLocaleDateString("de-DE", { month: "short" }); }
  function fmtDay(d) { return d.getDate().toString(); }
  function fmtYear(d) { return d.getFullYear().toString(); }
  function fmtFull(d) {
    return d.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  function today() {
    var t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }

  function isPast(ev) {
    var end = ev.end ? parseDate(ev.end) : parseDate(ev.start);
    return end < today();
  }

  // YYYYMMDD für Google Calendar
  function fmtGCal(d) {
    var y = d.getFullYear().toString();
    var m = (d.getMonth() + 1).toString().padStart(2, "0");
    var day = d.getDate().toString().padStart(2, "0");
    return y + m + day;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function gcalLink(ev) {
    var s = parseDate(ev.start);
    // Google Calendar ist exklusiv beim Enddatum → +1 Tag
    var endSrc = ev.end ? parseDate(ev.end) : parseDate(ev.start);
    var e = new Date(endSrc);
    e.setDate(e.getDate() + 1);

    var params = [
      "action=TEMPLATE",
      "text=" + encodeURIComponent(ev.title),
      "dates=" + fmtGCal(s) + "/" + fmtGCal(e),
      "details=" + encodeURIComponent(ev.desc),
      "location=" + encodeURIComponent(ev.location)
    ].join("&");

    return "https://www.google.com/calendar/render?" + params;
  }

  function gmapsLink(location) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(location);
  }

  function renderEvent(ev) {
    var s = parseDate(ev.start);
    var e = ev.end ? parseDate(ev.end) : null;
    var past = isPast(ev);

    var dateBlock = "";
    if (e) {
      dateBlock =
        '<div class="event__date">' +
          '<div class="month">' + fmtMonth(s) + ' – ' + fmtMonth(e) + '</div>' +
          '<div class="day">' + fmtDay(s) + '–' + fmtDay(e) + '</div>' +
          '<div class="year">' + fmtYear(s) + '</div>' +
        '</div>';
    } else {
      dateBlock =
        '<div class="event__date">' +
          '<div class="month">' + fmtMonth(s) + '</div>' +
          '<div class="day">' + fmtDay(s) + '</div>' +
          '<div class="year">' + fmtYear(s) + '</div>' +
        '</div>';
    }

    var dateText = e
      ? fmtFull(s) + " – " + fmtFull(e)
      : fmtFull(s);

    var calIcon =
      '<svg class="event__cal-icon" width="14" height="14" viewBox="0 0 24 24" ' +
      'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>' +
        '<line x1="16" y1="2" x2="16" y2="6"></line>' +
        '<line x1="8" y1="2" x2="8" y2="6"></line>' +
        '<line x1="3" y1="10" x2="21" y2="10"></line>' +
      '</svg>';

    return '<article class="event' + (past ? " is-past" : "") + '">' +
      dateBlock +
      '<div class="event__body">' +
        '<h3>' + escapeHtml(ev.title) + '</h3>' +
        '<div class="event__meta">' +
          '<span>' + dateText + '</span>' +
          '<a href="' + gmapsLink(ev.location) + '" target="_blank" rel="noopener noreferrer">' +
            escapeHtml(ev.location) +
          '</a>' +
        '</div>' +
        '<p class="muted">' + escapeHtml(ev.desc) + '</p>' +
        '<a class="event__cal-link" href="' + gcalLink(ev) + '" target="_blank" rel="noopener noreferrer">' +
          calIcon + ' Zum Kalender hinzufügen' +
        '</a>' +
      '</div>' +
    '</article>';
  }

  function render() {
    var upcoming = document.querySelector("[data-events-upcoming]");
    var pastWrap = document.querySelector("[data-events-past]");
    var pastDivider = document.querySelector("[data-events-past-divider]");
    if (!upcoming) return;

    // Aufteilen in upcoming/past anhand heute
    var up = [];
    var past = [];
    EVENTS.concat(PAST_EVENTS).forEach(function (ev) {
      if (isPast(ev)) past.push(ev); else up.push(ev);
    });

    // Upcoming: aufsteigend nach Datum
    up.sort(function (a, b) { return parseDate(a.start) - parseDate(b.start); });
    // Past: absteigend (neueste zuerst)
    past.sort(function (a, b) { return parseDate(b.start) - parseDate(a.start); });

    upcoming.innerHTML = up.map(renderEvent).join("");

    if (pastWrap) {
      if (past.length === 0) {
        if (pastDivider) pastDivider.style.display = "none";
        pastWrap.innerHTML = "";
      } else {
        pastWrap.innerHTML = past.map(renderEvent).join("");
      }
    }
  }

  if (document.readyState !== "loading") render();
  else document.addEventListener("DOMContentLoaded", render);
})();
