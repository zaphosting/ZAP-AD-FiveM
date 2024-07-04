let resName = GetParentResourceName();
let animated;
let stickyPosition;
let link;
let slideDuration;
let animation;

document.addEventListener("DOMContentLoaded", () => {
    document.body.style.display = "none";
    fetch("https://"+resName+"/loaded");
});

window.addEventListener("message", function(event) 
{
    let container = document.getElementById("container");
    let wrapper = document.getElementById("wrapper");

    if (event.data.config) {
        let config = event.data.config;

        animated = config.animated;
        stickyPosition = config.stickyPosition;
        link = config.link;
        slideDuration = config.slideDuration * 1000;

        let textElement = document.getElementById("text");
        textElement.innerHTML = config.text;
        textElement.style.color = config.textColor;

        container.style.backgroundColor = config.backgroundColor;

        if (!animated) {
            container.style.margin = config.bannerMargin + "px";
            container.style.borderRadius = config.bannerBorder + "px";
        }

        let imageElem = document.getElementById("image");
        if (config.imageLink != "") {
            imageElem.src = config.imageLink;
            imageElem.style.borderRadius = config.imageBorder + "px";
            imageElem.width = config.imageSizeWidth;
            imageElem.height = config.imageSizeHeight;
        }
        else {
            imageElem.style.display = "none";
        }

        if (link != "") {
            container.onclick = () => {
                window.invokeNative("openUrl", link);
                fetch("https://"+resName+"/clicked");
            }
        }
    }
    else if (event.data.show) {
        if (animated) {
            animation = wrapper.animate([
                { transform: "translateX(100%)" },
                { transform: "translateX(-100%)" },
            ], {
                duration: slideDuration,
                iterations: Infinity,
            });
        }
        else {
            container.style.position = "absolute";
            const [tb, lr] = stickyPosition.split("-");

            if (tb === "top") {
                container.style.top = 0;
            }
            else if (tb === "bottom") {
                container.style.bottom = 0;
            }

            if (lr === "left") {
                container.style.left = 0;
            }
            else if (lr === "right") {
                container.style.right = 0;
            }
        }

        document.body.style.display = "block";
    }
    else {
        document.body.style.display = "none";
        animation.cancel();
    }
});
