import "./style/app.scss";

declare global {
  interface Window {
    initMap: () => void;
  }
}

// Injected globally from index.html script
declare const google: any;

function initMap(): void {
  const yakaprint = { lng: 4.3951245, lat: 50.7175503 };
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 13.6,
      center: yakaprint,
    }
  );

  const marker = new google.maps.Marker({
    position: yakaprint,
    map: map,
    title: "Yakaprint",
  });

  const info = new google.maps.InfoWindow({
    content: "<strong>Yakaprint</strong>",
    ariaLabel: "Yakaprint",
  });

  marker.addListener("click", () => {
    info.open({
      anchor: marker,
      map,
    });
  });
}

window.initMap = initMap;

function logoPosition(logo: HTMLElement, spacer: HTMLElement) {
  const { left, top } = spacer.getBoundingClientRect();

  logo.style.left = `${left}px`;
  logo.style.top = `${top}px`;
  logo.classList.add("active");
}

function resetLogoPosition(logo: HTMLElement) {
  logo.classList.remove("active");
  logo.style.left = "50%";
  logo.style.top = window.innerWidth > 850 ? "8rem" : "4rem";
}

function closeNav(): void {
  const nav = document.querySelector(".header__nav") as HTMLElement;

  if (nav) {
    setTimeout(() => nav.classList.remove("open"), 100);
  }
}

(function () {
  const logo = document.querySelector("#logo") as HTMLElement;
  const spacer = document.querySelector("#logo-spacer") as HTMLElement;

  if (logo && spacer) {
    let copy = logo.cloneNode(true) as HTMLElement;
    copy.id = "logo_copy";

    logo.before(copy);

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (copy) {
          if (entry.isIntersecting) {
            resetLogoPosition(copy);
            return;
          }

          logoPosition(copy, spacer);
        }
      },
      {
        root: null,
        threshold: 0.5,
      }
    );

    observer.observe(logo);

    const mobileButton = document.querySelector("#mobile-nav") as HTMLElement;
    const nav = document.querySelector(".header__nav") as HTMLElement;

    if (mobileButton && nav) {
      mobileButton.addEventListener("click", () => {
        nav.classList.toggle("open");
      });

      const links = document.querySelectorAll(".header__link");

      links.forEach((el: Node) => {
        el.addEventListener("click", closeNav);
      });
    }

    window.addEventListener("resize", () => {
      if (copy.classList.contains("active")) {
        logoPosition(copy, spacer);
      } else {
        resetLogoPosition(copy);
      }

      closeNav();
    });
  }
})();
