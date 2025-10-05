const form = document.getElementById("form");
let data = {};

function submitRecommend(event) {
    event.preventDefault();
    let formData = new FormData(form);
    let category = formData.get("category");
    formData.delete("category");

    for (const value of formData) {
        data[value[0]] = value[1];
    }

    if (data["recommendedBy"] == "") {
        data["recommendedBy"] = "Anonymous";
    }

    fetch("/v1/recommends/" + category, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((_) => window.location.href = "/recommends");
}

form.addEventListener("submit", submitRecommend);
