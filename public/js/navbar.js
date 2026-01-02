const input = document.getElementById("searchInput");
const form = document.getElementById("searchForm");

let debounceTimer;

input.addEventListener("input", () => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    form.submit();
  }, 1000);
});
