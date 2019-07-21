(() => {
	let formElemFilled = function formElemFilled(e) {
		(e.type == 'checkbox') ? result = e.checked : result = e.value != '';
		return result;
	}
	
	let sendFormData = function sendFormData(element){
		const CHILDS = element.getElementsByTagName('*');
		const TAGSSENTELEM = ['INPUT', 'TEXTAREA'];
		let data = '';
		let first = true;
		
		for (let i = 0; i < CHILDS.length; i++) {
			const e = CHILDS[i];
			let r = '';
	
			if (TAGSSENTELEM.indexOf(e.tagName) > -1 && formElemFilled(e) != false){
				(first == false) ? r = '&': first = false;
				data = `${data}${r}${e.name}=${e.value}`;
			}
		}
	
		return data;
	}

	let ajax = (method, url, data, done) => {
		const request = new XMLHttpRequest();

		request.addEventListener('readystatechange', () => {
			if(request.readyState === 4 && request.status === 200) {       
				done();
			}
		});

		if (method === 'GET'){
			url = `${url}?${data}`;
			data = '';
		}
		
		request.open(method, url);

		request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		request.send(data);
	}

	let ajaxLoadSVG = (src, parent, done) => {
		const xhr = new XMLHttpRequest();

		xhr.onload = function() {
			parent.innerHTML = xhr.responseText;
			done();
		}

		xhr.open('GET', src);
		xhr.overrideMimeType('image/svg+xml');
		xhr.send('');
	}
	
	const FORM = document.querySelector('form');
	FORM.addEventListener('submit', function(e) {
		e.preventDefault()
		ajax('POST', 'php/email.php', sendFormData(FORM), function(){
			thanksWindow(FORM);
		});
	});

	function createElement(tag, props, parent, ...children) {
		const element = document.createElement(tag);

		Object.keys(props).forEach(key => element[key] = props[key]);

		children.forEach(child => {
			if (typeof child === 'string'){
				child = document.createTextNode(child);
			}
	
			element.appendChild(child);
		});

		if (parent !== NaN || undefined || 0){
			parent.appendChild(element);
		}

		return element;
	}

	function thanksWindow(parent){
		const POPUP = createElement('div', { className: 'widebutton__popup widebutton__popup-thanks' }, parent);
		createElement('canvas', { className: 'bubblespanel widebutton__bubblespanel'}, POPUP);
        const WIDEBUTTON_BUBBLESPANEL = new BubblesPanel('.widebutton__bubblespanel');
		const WRAP = createElement('div', { className: 'thankswindow' }, POPUP);
		ajaxLoadSVG('img/ico/thanks.svg', WRAP, function(){
			createElement('h1', { innerHTML: 'Спасибо' }, WRAP);
			createElement('h2', { innerHTML: 'что оставили заявку' }, WRAP);
			const CLSBTN = createElement('button', { className: 'thankswindow__clsbtn', innerHTML: 'Вернуться на страницу' }, WRAP);
			CLSBTN.addEventListener('click', () => {
				FORM.reset();
				POPUP.remove();
			})
		});
	}
})();