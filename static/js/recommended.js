const table = document.getElementsByTagName("tbody").item(0);
const loader = document.getElementsByClassName("loader").item(0);

const pageName = document.getElementsByName("title")[0].content.split("|")[1]
    .trim().toLowerCase();

function fetchData(mode) {
    if (mode == "recommends" || mode == "reviews") {
        let type = new URLSearchParams(window.location.search).get("type");
        type = type ? type : "music";
        fetch(`/v1/${mode}/` + type)
            .then((response) => response.json().then((fetchedData) => genTable(fetchedData, mode)).catch((reason) => console.log(reason)));
    } else {
        return;
    }
}

function genTable(data, mode) {
    let type = new URLSearchParams(window.location.search).get("type");
    type = type ? type : "music";

    document.getElementById(type).classList.add("active");

    for (let i = 0; i < data.length; i++) {
        const media = data[i];

        let row = document.createElement("tr");

        let colOne = document.createElement("td");
        colOne.innerHTML = media["name"];
        row.appendChild(colOne);

        let colTwo = document.createElement("td");
        colTwo.innerHTML = media["creator"];
        row.appendChild(colTwo);

        let colThree = document.createElement("td");
        if (mode == "reviews") {
            for (let i = 0; i < media["review"]; i++) {
                let img = document.createElement("img");
                img.src = "/images/star-filled.svg";
                img.className = "svg";
                colThree.appendChild(img);
            }

            for (let i = 0; i < 5 - media["review"]; i++) {
                let img = document.createElement("img");
                img.src = "/images/star.svg";
                img.className = "svg";
                colThree.appendChild(img);
            }
        } else if (mode == "recommends") {
            colThree.innerHTML = media["recommendedBy"];
        }
        row.appendChild(colThree);

        table.appendChild(row);
    }

    loader.style.display = "none";
    table.parentElement.style.display = "table";
}

fetchData(pageName);
