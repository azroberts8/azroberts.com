function toggle(x) {
	x.classList.toggle("x");
	(document.querySelector('nav ul').style.height == document.querySelector('nav ul').scrollHeight + 'px') ? document.querySelector('nav ul').style.height = '0px' : document.querySelector('nav ul').style.height = document.querySelector('nav ul').scrollHeight + 'px';
}

function update(content) {
	document.querySelector('main').innerHTML = "";
	document.querySelector('main').appendChild(document.getElementById(content).content.cloneNode(true));
	document.querySelector('main').style.height = document.querySelector('main').scrollHeight + 'px';
}

document.onreadystatechange = function() {
	if(document.readyState === 'complete') {
		setTimeout(function() {
			const splashTranslation = getComputedStyle(document.getElementById("splashImg")).transform;
			document.addEventListener("scroll", function() {
				(window.scrollY > 0) ? document.getElementById("splashImg").style.transform = splashTranslation + " translateY(-" + window.scrollY/4 + "px)" : document.getElementById("splashImg").style.transform = splashTranslation + " translateY(" + Math.abs(window.scrollY)/4 + "px)" ;
			});
		}, 200);
	}
}