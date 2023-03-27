tabs();
menuMobile();

getContent();

function tabs() {
  let links = document.querySelectorAll("nav ul li a");
  let sections = document.querySelectorAll(".section");

  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      links.forEach(function (link) {
        link.classList.remove("active");
      });

      sections.forEach(function (section) {
        section.classList.add("none");
      });

      let id = link.getAttribute("href").replace("#", "");
      let current = document.querySelector("#" + id);
      link.classList.add("active");
      current.classList.remove("none");
    });
  });
}

function menuMobile() {
  let menu = document.querySelector("nav button");
  let menuItems = document.querySelectorAll("nav ul li");
  let ul = document.querySelector("nav ul");

  document.documentElement.onclick = function (event) {
    if (event.target !== menu) {
      ul.classList.remove("active");
    }
  };

  menu.addEventListener("click", function () {
    ul.classList.toggle("active");
  });

  menuItems.forEach(function (items) {
    items.addEventListener("click", function () {
      ul.classList.remove("active");
    });
  });
}

function getContent() {
  let loading = document.querySelector("#loading");
  let error = document.querySelector("#error");
  let page = document.querySelector("#page");

  let productsContent = document.querySelector("#products");

  let products = [];

  fetch("https://api.github.com/repos/ovictorlelis/paginadigital.com.br/issues")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((items) => {
        if (items.user.login == "ovictorlelis") {
          if (items.labels[0]) {
            switch (items.labels[0].name) {
              case "products":
                products.push(items);
                break;
            }
          }
        }
      });

      const converter = new showdown.Converter({ tables: true });

      let regex = /!?\[([^\]]*)\]\(([^\)]+)\)/gm;
      products.forEach((data) => {
        let matches = data.body.match(regex);
        let url = data.body.match(/###.+/g)[0].replace("###", "");
        let content = data.body.replace(regex, "").split(/###.+/g)[1].trim();
        let datas = [];
        const singleMatch = /\[([^\[]+)\]\((.*)\)/;
        for (var i = 0; i < matches.length; i++) {
          var text = singleMatch.exec(matches[i]);
          datas[text[1]] = text[2];
        }

        let urls = url.trim(" ", "").split(" | ");
        url = "<ul><li>" + urls.join("</li><li>") + "</li></ul>";

        productsContent.innerHTML += `
            <article>
              <img src="${datas["cover"]}" alt="Print do projeto" />
              <div class="content">
                  <h3>${data.title}</h3>
                  <p class="info">
                    ${content}
                  </p>
                  <div class="codes">
                      <a
                        class="${datas["link"] ? "" : "none"}"
                        target="_blank"
                        href="${datas["link"]}"
                      >
                      ${url}
                      </a>
                      <a
                        class="${datas["github"] ? "" : "none"}"
                        target="_blank"
                        href="${datas["github"]}"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="192"
                          height="192"
                          fill="var(--color-feature)"
                          viewBox="0 0 256 256"
                        >
                          <rect width="256" height="256" fill="none"></rect>
                          <path
                            d="M84,240a23.9,23.9,0,0,0,24-24V168"
                            fill="none"
                            stroke="var(--color-feature)"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="16"
                          ></path>
                          <path
                            d="M172,240a23.9,23.9,0,0,1-24-24V168"
                            fill="none"
                            stroke="var(--color-feature)"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="16"
                          ></path>
                          <path
                            d="M152,168h16a23.9,23.9,0,0,1,24,24v8a23.9,23.9,0,0,0,24,24"
                            fill="none"
                            stroke="var(--color-feature)"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="16"
                          ></path>
                          <path
                            d="M104,168H88a23.9,23.9,0,0,0-24,24v8a23.9,23.9,0,0,1-24,24"
                            fill="none"
                            stroke="var(--color-feature)"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="16"
                          ></path>
                          <path
                            d="M111.8,64A52,52,0,0,0,68,40a52,52,0,0,0-3.5,44.7A49.3,49.3,0,0,0,56,112v8a48,48,0,0,0,48,48h48a48,48,0,0,0,48-48v-8a49.3,49.3,0,0,0-8.5-27.3A52,52,0,0,0,188,40a52,52,0,0,0-43.8,24Z"
                            fill="none"
                            stroke="var(--color-feature)"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="16"
                          ></path>
                        </svg>
                      </a>
                  </div>
                </div>
              </article>
            `;
      });

      let links = document.querySelectorAll(".md a");
      links.forEach((link) => {
        link.setAttribute("target", "_blank");
      });

      loading.classList.remove("flex");
      loading.classList.add("none");
      page.classList.remove("none");
    })
    .catch((err) => {
      loading.classList.remove("flex");
      loading.classList.add("none");

      error.classList.add("flex");
      error.classList.remove("none");
    });
}
