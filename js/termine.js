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

    return '<article class="event' + (past ? " is-past" : "") + '">' +
      dateBlock +
      '<div class="event__body">' +
        '<h3>' + ev.title + '</h3>' +
        '<div class="event__meta">' +
          '<span>' + dateText + '</span>' +
          '<span>' + ev.location + '</span>' +
        '</div>' +
        '<p class="muted">' + ev.desc + '</p>' +
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
        pastWrap.innerHTML = '<p class="muted center" style="padding:1rem 0">Vergangene Termine folgen in Kürze.</p>';
      } else {
        pastWrap.innerHTML = past.map(renderEvent).join("");
      }
    }
  }

  if (document.readyState !== "loading") render();
  else document.addEventListener("DOMContentLoaded", render);
})();
