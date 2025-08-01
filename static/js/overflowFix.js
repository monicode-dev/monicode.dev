function overflowFix() {
    const content = document.getElementById("content");
    if (document.readyState === "complete") {
        if (content.scrollHeight > content.clientHeight) {
            content.style.height = "100%";
        } else {
            content.style.height = "100vh"
        }
    }
}

document.addEventListener("readystatechange", overflowFix)