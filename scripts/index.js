function toggle(x) {
    x.classList.toggle("x");
    const nav = document.querySelector('nav')
    if(nav.style.height === '0px') {
        nav.style.height = nav.scrollHeight + 'px';
        nav.style.marginBottom = "var(--size-0)";
    } else {
        nav.style.height = '0px';
        nav.style.marginBottom = "0px";
    }
}