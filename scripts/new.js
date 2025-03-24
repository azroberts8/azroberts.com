function toggle(x) {
    x.classList.toggle("x");
    const nav = document.querySelector('nav')
    if(nav.style.height === nav.scrollHeight + 'px') {
        nav.style.height = '0px';
    } else {
        nav.style.height = nav.scrollHeight + 'px';
    }
}