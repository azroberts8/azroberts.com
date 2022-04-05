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

fetch("/assets/images/images.json")
.then(res => res.json())
.then(res => {
	Array.prototype.forEach.call(document.getElementsByClassName("card"), card => {
		const e = card.firstElementChild;
		if(e.tagName === 'IMG') {
			e.setAttribute('src', res[e.getAttribute('img-id')]);
		}
	});
	Array.prototype.forEach.call(document.getElementsByClassName("photoGrid"), collections => {
		Array.prototype.forEach.call(collections.children, photo => {
			const node = document.createElement("div");
			node.style.backgroundImage = `url('${ res[photo.getAttribute("img-id")] }')`;
			photo.appendChild(node);
		})
	});
})
.then(() => {
	Array.prototype.forEach.call(document.getElementsByClassName("card"), card => {
		const e = card.firstElementChild;
		if(e.tagName === 'IMG') {
			const img = new Image();
			img.addEventListener('load', () => {
				e.setAttribute('src', `/assets/images/${ e.getAttribute('img-id') }`);
				e.style.filter = 'blur(0px)';
			});
			img.src = `/assets/images/${ e.getAttribute('img-id') }`;
		}
	});
	Array.prototype.forEach.call(document.getElementsByClassName("photoGrid"), collections => {
		Array.prototype.forEach.call(collections.children, photo => {
			const e = photo.firstElementChild;
			const img = new Image();
			img.addEventListener('load', () => {
				e.style.backgroundImage = `url('/assets/images/${ photo.getAttribute('img-id') }')`;
				e.style.filter = 'blur(0px)';
			});
			img.src = `/assets/images/${ photo.getAttribute('img-id') }`;
		});
	});
});