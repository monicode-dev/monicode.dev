function toggleAnimation() {
    if (document.body.className !== "animated") {
        document.body.className = "animated"
        localStorage.setItem("animated", "true");
    } else {
        document.body.className = ""
        localStorage.setItem("animated", "false");
    }
}

if (localStorage.getItem("animated") === "false") {
    toggleAnimation()
}