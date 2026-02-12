document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.querySelector(".providers-check__block__search-btn");
  const searchInput = document.querySelector(".providers-check__block__input");
  const inputWrapper = document.querySelector(".providers-check__block__input-wrapper");

  if (searchBtn && searchInput && inputWrapper) {
    const updateBtnState = () => {
      inputWrapper.classList.toggle("is-empty", !searchInput.value.trim());
    };

    updateBtnState();
    searchInput.addEventListener("input", updateBtnState);
    searchInput.addEventListener("change", updateBtnState);

    searchBtn.addEventListener("click", (e) => {
      if (!searchInput.value.trim()) {
        e.preventDefault();
        return;
      }
      console.log(searchInput.value);
    });
  }
});
