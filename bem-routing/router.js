const content = document.getElementById('app-content');
const nav= document.getElementById('app-nav');

function currentRoute(){
    console.log(location.hash);
    console.log((location.hash || "#home").slice(1));
    return (location.hash || "#home").slice(1);
}

function setActive(route){
    for(const a of nav.querySelectorAll(".nav__link")){
        const isActive = a.getAttribute("href") === `#${route}`;
        a.classList.toggle("nav__link--active", isActive);
    }

}
async function render(route) {
  const safe = /^[a-z0-9-]+$/i.test(route) ? route : "home";
  content.innerHTML = '<p class="panel__text">Cargando…</p>';
  try {
    const res = await fetch(`views/${safe}.html`, { cache: "no-store" });
    if (!res.ok) throw new Error("not found");
    content.innerHTML = await res.text();
    setActive(safe);
    for (const s of content.querySelectorAll("script")) {
      eval(s.textContent);
    }
  } catch {
    const res404 = await fetch("views/404.html").catch(() => null);
    content.innerHTML =
      res404 && res404.ok
        ? await res404.text()
        : '<article class="panel"><h2 class="panel__title">404</h2><p class="panel__text">No encontrada.</p></article>';
    setActive("");
  }
}
window.addEventListener("hashchange", () => render(currentRoute()));
window.addEventListener("load", () => render(currentRoute()));