(() => {
    const MYT = function MYTools (selector){
        let elements;

        if (typeof selector === 'string') {
            elements = document.querySelectorAll(selector);
        }

        const obj = {};

        obj.getElement = (elemInd = 0) => {
            return elements[elemInd];
        }

        obj.branch = (bool, doTrue, doFalse) => {
            if (bool == true){
                doTrue();
            }
            else if (bool == false){
                doFalse();
            }

            return obj;
        }

        obj.getTransform = (transform, elemInd = 0) => {
            let matrix = window.getComputedStyle(elements[elemInd]).transform;
            matrix = matrix.split(/\(|,\s|\)/).slice(1,7);
            if (transform == 'x'){
                return matrix[4];
            }
            else if (transform == 'y'){
                return matrix[5];
            }
            else if (transform == 'r'){
                let degree = Math.asin(matrix[1]) * (180/Math.PI);
                if(matrix[0] < 0){
                    degree = 180 - degree;
                }
                if(degree < 0){
                    degree = 360 + degree;
                }
                return degree;
            }
            else{
                return matrix;
            }
        }

        obj.createElement = (tag, props, parent, ...children) => {
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

        obj.addEvent = (eventType, handler, elemInd = 0) => {
            if (elemInd === 'all'){
                elements.forEach(element => {
                    element.addEventListener(eventType, handler);
                });
            }
            else {
                elements[elemInd].addEventListener(eventType, handler);
            }
            return obj;
        }

        obj.formElemFilled = function formElemFilled(e) {
            (e.type == 'checkbox') ? result = e.checked : result = e.value != '';
            return result;
        }
        
        obj.sendFormData = function sendFormData(elemInd = 0){
            const CHILDS = elements[elemInd].getElementsByTagName('*');
            const TAGSSENTELEM = ['INPUT', 'TEXTAREA'];
            let data = '';
            let first = true;
            
            for (let i = 0; i < CHILDS.length; i++) {
                const e = CHILDS[i];
                let r = '';
        
                if (TAGSSENTELEM.indexOf(e.tagName) > -1 && this.formElemFilled(e) != false){
                    (first == false) ? r = '&': first = false;
                    data = `${data}${r}${e.name}=${e.value}`;
                }
            }
        
            return data;
        }

        obj.ajax = (method, url, data) => {
            const request = new XMLHttpRequest();

            request.addEventListener("readystatechange", () => {
                if(request.readyState === 4 && request.status === 200) {       
                    console.log(request.responseText);
                }
            });

            if (method === 'GET'){
                url = `${url}?${data}`;
                data = '';
            }
            
            request.open(method, url);

            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
            request.send(data);
        }
        
        if (!selector){
            return this;
        }
        if (typeof selector === 'string'){
            return obj;
        }
        if (selector.nodeType){
            return this;
        }
    }

    window.MYT = MYT;
})();