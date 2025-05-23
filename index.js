let input = document.querySelector(".input");
let list = document.querySelector(".autocomplete-list");
let results = document.querySelector(".results");
let resList = results.querySelector("ul");

let debounce = function (func, ms) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), ms);
  };
};

function search(event) {
  let repoName = event.target.value.trim();

  fetch(`https://api.github.com/search/repositories?q=${repoName}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let resArr = data.items.slice(0, 5);

      list.innerHTML = "";

      resArr.forEach(({ name, owner: { login }, stargazers_count: stars }) => {
        let newItem = document.createElement("li");
        newItem.textContent = name;
        list.appendChild(newItem);

        newItem.addEventListener("click", () => {
          if (!resList) {
            results.innerHTML = "<ul></ul>";
            resList = results.querySelector("ul");
            resList.className = "results-list";
          }

          const resultItem = document.createElement("li");
          resultItem.textContent = `Название: ${name}\nАвтор: ${login}\nЗвезды: ${stars}`;

          resList.appendChild(resultItem);

          let closeButton = document.createElement("button");
          closeButton.textContent = "✖";
          closeButton.className = "close";
          resultItem.appendChild(closeButton);

          list.innerHTML = "";
          event.target.value = "";
        });
      });
    });
}

let debouncedSearch = debounce(search, 400);

input.addEventListener("keyup", debouncedSearch);

results.addEventListener("click", (event) => {
  if (event.target.className === "close") {
    event.target.parentElement.remove();
  }
});

document.addEventListener("click", (event) => {
  if (!input.contains(event.target) && !list.contains(event.target)) {
    list.innerHTML = ""; // Очищаем список
  }
});
