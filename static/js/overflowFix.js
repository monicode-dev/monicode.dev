document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        const content = document.getElementById("content");

        if (content.scrollHeight > content.clientHeight) {
            content.style.height = "100%";
        }
    }
};
