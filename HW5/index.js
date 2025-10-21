function getBackgroundColor(el) {
    if (!el) return '';
    return window.getComputedStyle(el).backgroundColor || '';
}

document.addEventListener('DOMContentLoaded', function() {
    //@Task 1
    const btn = document.querySelector("#b1");

    if (btn && !btn.dataset.originalBg) {
        btn.dataset.originalBg = getBackgroundColor(btn);
    }

    if (btn) {
        btn.addEventListener("mouseenter", function() {
            btn.style.backgroundColor = "yellow";
        });

        btn.addEventListener("mouseleave", function() {
            btn.style.backgroundColor = btn.dataset.originalBg || '';
        });
    }

    //@Task 2
    const table = document.getElementById("myTable");
    if (table) {
        table.querySelectorAll("tr").forEach(function(row) {
            const originalBg = row.style.backgroundColor;
            row.addEventListener("mouseenter", function() {
                row.style.backgroundColor = "lightgreen";
            });
            row.addEventListener("mouseleave", function() {
                row.style.backgroundColor = originalBg;
            });
        });
    }

    //@Task 3
    const link = document.getElementById("link");
    const tooltip = document.getElementById("tooltip");

    if (link && tooltip) {
        link.addEventListener("mouseenter", function(e) {
            tooltip.textContent = link.href;
            tooltip.style.display = "block";
            tooltip.style.left = e.pageX + "px";
            tooltip.style.top = e.pageY + "px";
        });

        link.addEventListener("mousemove", function(e) {
            tooltip.style.left = e.pageX + "px";
            tooltip.style.top = e.pageY + "px";
        });

        link.addEventListener("mouseleave", function() {
            setTimeout(function() {
                tooltip.style.display = "none";
            }, 300);
        });
    }

    //@Task 4
    const area = document.getElementById("contextArea");
    const menu = document.getElementById("menu");

    if (!area || !menu) {
        throw new Error("Элементы не найдены");
    }

    area.addEventListener("contextmenu", function(e) {
        e.preventDefault();
        menu.style.display = "block";
        menu.style.left = e.pageX + "px";
        menu.style.top = e.pageY + "px";
    });

    document.addEventListener("click", function() {
        menu.style.display = "none";
    });

    menu.querySelectorAll("li").forEach(function(item) {
        item.addEventListener("mouseenter", function() {
            item.style.backgroundColor = "lightblue";
        });
        item.addEventListener("mouseleave", function() {
            item.style.backgroundColor = "";
        });
    });

    //@Task 5
    const keys = document.querySelectorAll("#keyboard button");

    document.addEventListener("keydown", function(e) {
        keys.forEach(function(btn) {
            if (btn.dataset.key && btn.dataset.key.toLowerCase() === e.key.toLowerCase()) {
                btn.style.backgroundColor = "orange";
            }
        });
    });

    document.addEventListener("keyup", function(e) {
        keys.forEach(function(btn) {
            if (btn.dataset.key && btn.dataset.key.toLowerCase() === e.key.toLowerCase()) {
                btn.style.backgroundColor = "";
            }
        });
    });
});
