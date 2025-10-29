// src/scripts/scheme.js

document.addEventListener("DOMContentLoaded", () => {
  const points = document.querySelectorAll(".scheme__point");

  /** Снимает активность со всех точек */
  function deactivateAll() {
    points.forEach((p) => p.classList.remove("is-active"));
  }

  /** Активирует конкретную точку по ID */
  function activateById(id) {
    deactivateAll();
    const target = document.querySelector(`.scheme__point[data-id="${id}"]`);
    console.log(id, target);
     deactivateAll();
    setTimeout(() => {target.classList.add("is-active")}, 100);
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Добавляем обработчики кликов по точкам
  points.forEach((point) => {
    point.addEventListener("click", (e) => {
      e.stopPropagation();
      if (point.classList.contains("is-active")) {
        point.classList.remove("is-active");
      } else {
        deactivateAll();
        point.classList.add("is-active");
      }
    });
  });

  // Клик вне схемы — снять выделение
  document.addEventListener("click", deactivateAll);

  // 👇 Делаем функцию доступной глобально
  window.activateSchemePoint = activateById;
});
