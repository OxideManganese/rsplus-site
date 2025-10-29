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
    if (!target) return;
    
    setTimeout(() => {
      target.classList.add("is-active");
      
      // Проверяем, видим ли элемент полностью
      const rect = target.getBoundingClientRect();
      const isInViewport = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );

      if (!isInViewport) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
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

  // 👇 Делаем функцию доступной глобально
  window.activateSchemePoint = activateById;
});
