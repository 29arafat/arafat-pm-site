(function () {
  var html = document.documentElement;
  function get() { try { return localStorage.getItem("apm-lang"); } catch (e) { return null; } }
  function put(v) { try { localStorage.setItem("apm-lang", v); } catch (e) {} }
  function apply(l) {
    html.lang = l;
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-set") === l ? "true" : "false");
    });
  }
  var start = get() || ((navigator.language || "").toLowerCase().indexOf("bn") === 0 ? "bn" : "en");
  apply(start);
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { var l = b.getAttribute("data-set"); put(l); apply(l); });
  });

  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (i) { io.observe(i); });
  } else { items.forEach(function (i) { i.classList.add("in"); }); }

  var info = document.getElementById("relinfo");
  if (info && window.fetch) {
    fetch("https://api.github.com/repos/29arafat/arafat-pm-site/releases/latest")
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j) return;
        var a = (j.assets || []).filter(function (x) { return x.name === "app-release.apk"; })[0];
        var d = j.published_at ? new Date(j.published_at).toISOString().slice(0, 10) : "";
        var mb = a ? (a.size / 1048576).toFixed(1) + " MB" : "";
        var tag = (j.tag_name || "").replace("build-", "build ");
        info.textContent = [tag, d, mb].filter(Boolean).join(" · ");
      }).catch(function () {});
  }
})();
