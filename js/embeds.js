/* embeds.js — 2-Click-Lösung für Spotify / YouTube / SoundCloud
   DSGVO: Erst nach Klick wird der iframe geladen. Vorher keine Verbindung
   zum Dienst, keine Cookies, keine IP-Übertragung.
   Player spielt INLINE auf der Website — kein Redirect zur Plattform.
*/

(function () {
  "use strict";

  // Track-Daten: Quelle als Typ, ID/URL je nach Dienst
  // type: "spotify" | "youtube" | "soundcloud"
  // Für Spotify: track/album/artist id; für YouTube: video id; für soundcloud: track-url
  // group: section heading for grouping tracks by project
  var TRACKS = [
    {
      title: "Chameleon",
      project: "Heather Blue",
      group: "Hörproben",
      source: "youtube",
      sourceLabel: "YouTube",
      youtube: "tcri-PwhqcQ",
      cover: "assets/img/covers/chameleon-youtube-maxresdefault.jpg",
      spotify: null,
      soundcloud: null
    },
    {
      title: "Safe by Myself",
      project: "Heather Blue",
      group: "Hörproben",
      source: "spotify",
      sourceLabel: "Spotify",
      spotify: "track/0RcR4XxcqhiEmFDFLtXE9C",
      cover: "assets/img/covers/safe-by-myself-spotify.jpg",
      youtube: null,
      soundcloud: null
    },
    {
      title: "Safe by Myself",
      project: "Heather Blue — SoundCloud",
      group: "Hörproben",
      source: "soundcloud",
      sourceLabel: "SoundCloud",
      soundcloud: "https://soundcloud.com/heatherblue-music/safe-by-myself",
      cover: "assets/img/covers/safe-by-myself-soundcloud.jpg",
      spotify: null,
      youtube: null
    }
  ];

  function buildIframe(track) {
    var url = "";
    if (track.source === "spotify") {
      url = "https://open.spotify.com/embed/" + track.spotify + "?utm_source=generator&theme=0";
      return '<iframe src="' + url + '" width="100%" height="152" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>';
    }
    if (track.source === "youtube") {
      // 2-Click-Lösung: User klickt bevor Verbindung aufgebaut wird → DSGVO ok.
      // youtube.com (nicht nocookie) da modestbranding+nocookie Error 153 verursacht.
      url = "https://www.youtube.com/embed/" + track.youtube + "?rel=0&playsinline=1";
      return '<iframe src="' + url + '" width="100%" height="200" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
    }
    if (track.source === "soundcloud") {
      url = "https://w.soundcloud.com/player/?url=" + encodeURIComponent(track.soundcloud) + "&color=%236b8cae&auto_play=false&visual=true&show_artwork=true";
      return '<iframe src="' + url + '" width="100%" height="300" allow="autoplay" loading="lazy"></iframe>';
    }
    return "";
  }

  function renderTracklist() {
    var list = document.querySelector("[data-tracklist]");
    if (!list) return;

    var currentGroup = "";
    TRACKS.forEach(function (track, i) {
      // Group header
      if (track.group && track.group !== currentGroup) {
        currentGroup = track.group;
        var groupLi = document.createElement("li");
        groupLi.className = "track__group";
        groupLi.innerHTML = '<div class="track__group-title">' + currentGroup + '</div>';
        list.appendChild(groupLi);
      }

      var li = document.createElement("li");
      li.className = "track";
      li.innerHTML =
        '<div class="track__row">' +
          (track.cover
            ? '<img class="track__cover" src="' + track.cover + '" alt="' + track.title + '" loading="lazy">'
            : '<div class="track__cover track__cover--placeholder"></div>') +
          '<button class="track__play" aria-label="' + track.title + ' abspielen" data-track="' + i + '">' +
            '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>' +
          '</button>' +
          '<div class="track__info">' +
            '<div class="track__title">' + track.title + '</div>' +
            '<span class="track__project">' + track.project + '</span>' +
          '</div>' +
          '<span class="track__source">' + track.sourceLabel + '</span>' +
        '</div>' +
        '<div class="embed-slot" data-slot="' + i + '"></div>';

      list.appendChild(li);

      var btn = li.querySelector(".track__play");
      var slot = li.querySelector(".embed-slot");
      btn.addEventListener("click", function () {
        if (slot.classList.contains("is-open")) {
          slot.classList.remove("is-open");
          slot.innerHTML = "";
          btn.querySelector("svg path").setAttribute("d", "M8 5v14l11-7z"); // play
          return;
        }
        slot.innerHTML = buildIframe(track) +
          '<p class="embed-notice">Mit dem Klick wird eine Verbindung zu ' + track.sourceLabel +
          " aufgebaut. Weitere Informationen in der Datenschutzerklärung.</p>";
        slot.classList.add("is-open");
        btn.querySelector("svg path").setAttribute("d", "M6 6h12v12H6z"); // stop
      });
    });
  }

  if (document.readyState !== "loading") renderTracklist();
  else document.addEventListener("DOMContentLoaded", renderTracklist);
})();
