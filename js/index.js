(() => {
    const CONTACTSDATA__BUBBLESPANEL = new BubblesPanel('.contactsdata__bubblespanel');

    const NAV = document.querySelector('nav');
    const LOGOTYPE = document.getElementById('logotype');
    const TOOLBAR = document.getElementById('toolbar');
    const MENU_BTN = document.getElementById('menubtn');
    const UP_BTN = document.getElementById('upbtn');

    let logotypeMaxWidth = 400;
    let maintitleTextMaxWidth = 400;
    let maxMedia = logotypeMaxWidth + maintitleTextMaxWidth + 90;//90 - сумма отступа (margin) справа и слева (по 30), и между элементами логотип и основной заголовок (30).
    let minMedia = logotypeMaxWidth + 60;//60 - сумма отступа (margin) справа и слева (по 30).

    let scrollBorder;

    /* Функция получения значения из матрицы трансформации элемента */
    function getValueElementInTransformMatrix(element, elemInd){
        let matrix = window.getComputedStyle(element).transform;

        matrix = matrix.split(/\(|,\s|\)/).slice(1,7);
        return matrix[elemInd];
    }

    /* Функция подсчета нижней точки при скроле для смены родителя логотипа */
    function setScrollBorderForChangingParentLogotype(){
        const MAINTITLE = document.querySelector('#maintitle');
        let maintitleHeig = MAINTITLE.offsetHeight;
        const HEADER = document.getElementById('header');
        let headerPaddTop = parseInt(window.getComputedStyle(HEADER).paddingTop, 10);

        scrollBorder = maintitleHeig + headerPaddTop;
    }

    /* Функция подсчета и установки отступа слева и уменьшения размера шрифта для текста основного заголовка */
    function setMaintitleTextMarginLeft(){
        if (document.documentElement.clientWidth < maxMedia && document.documentElement.clientWidth > minMedia && document.documentElement.clientWidth > document.documentElement.clientHeight){

            const MAINTITLE = document.querySelector('#maintitle');
            const FRAME = MAINTITLE.querySelector('.frame');
            const MAINTITLE_TEXT = MAINTITLE.querySelector('p');
            let frameWidth = FRAME.offsetWidth;
            let r = (logotypeMaxWidth + maintitleTextMaxWidth)/(frameWidth - 90);
            let logotypeWidth = frameWidth - 90 - logotypeMaxWidth/r;
            let maintitleTextWidth = frameWidth - 90 - maintitleTextMaxWidth/r;
            let maintitleTextMarginLeft = logotypeWidth + 30;

            MAINTITLE_TEXT.style.marginLeft = '' +maintitleTextMarginLeft+ 'px';

            //Пропорциональное уменьшение размера шрифта.
            let scale = maintitleTextWidth/maintitleTextMaxWidth;
            const MAINTITLE_SPAN = MAINTITLE.querySelector('span');
            let fontSizeText = 60 * scale;
            let fontSizeSpan = 72 * scale;

            MAINTITLE_TEXT.style.fontSize = '' +fontSizeText+ 'px';
            MAINTITLE_SPAN.style.fontSize = '' +fontSizeSpan+ 'px';
        }
        else {
            const MAINTITLE = document.querySelector('#maintitle');
            const MAINTITLE_TEXT = MAINTITLE.querySelector('p');
            const MAINTITLE_SPAN = MAINTITLE.querySelector('span');

            MAINTITLE_TEXT.style.marginLeft = '';
            MAINTITLE_TEXT.style.fontSize = '';
            MAINTITLE_SPAN.style.fontSize = '';
        }
    }

    /* Функция подсчета и установки отступа справа для логотипа */
    function setLogotypeMarginRight(){
        const MAINTITLE = document.querySelector('#maintitle');
        const MAINTITLE_TEXT = MAINTITLE.querySelector('p');
        let maintitleTextWidth = MAINTITLE_TEXT.offsetWidth;
        let logotypeMarginRight = maintitleTextWidth + 60;//60 - сумма отступа (margin) между логотипом и основным заголовком и крайне правого отступа, т.к. логотип имеет абсолютное позиционирование и на него не действуют отступы (padding) родителя.

        LOGOTYPE.style.marginRight = '' +logotypeMarginRight+ 'px';
        return logotypeMarginRight;
    }

    function countLogotypeHeightAfterMarginPress(logotypeMarginRight){
        const MAINTITLE = document.querySelector('#maintitle');
        const FRAME = MAINTITLE.querySelector('.frame');
        let frameWidth = FRAME.offsetWidth;
        const LOGO = LOGOTYPE.querySelector('img');

        return ((frameWidth - logotypeMarginRight - 30)/LOGO.naturalWidth) * LOGO.naturalHeight;//Высчитывая конечный размер высоты логотипа после уменьшения через формулу пропорции, выведенной из зависимости x1/x2 = y1/y2.
    }

    /* Подсчет старого положение логотипа по оси "X" относительно нового родителя */
    function countLogotypeXPosition(earlyParemt){
        let x;
        if (earlyParemt === document.querySelector('#preloader')){
            let FRAME;
            if (LOGOTYPE.parentElement === document.querySelector('.navframe')){
                FRAME = NAV.querySelector('.navframe');
            }
            else {
                const MAINTITLE = document.querySelector('#maintitle');
                FRAME = MAINTITLE.querySelector('.frame');
            }

            let frameWidth = FRAME.offsetWidth;
            let logotypeWidth = LOGOTYPE.offsetWidth;
            let logotypeMargineLeft = parseInt(window.getComputedStyle(LOGOTYPE).marginLeft, 10);

            x = frameWidth/2 - logotypeWidth/2 - logotypeMargineLeft;
        }

        return x;
    }

    /* Подсчет старого положение логотипа по оси "Y" относительно нового родителя */
    function countLogotypeYPosition(earlyParemt){
        let y;
        if (earlyParemt === document.querySelector('#preloader')){
            if (LOGOTYPE.parentElement === document.querySelector('.navframe')){
                let clientHeight = document.documentElement.clientHeight;
                let logotypeHeight = LOGOTYPE.offsetHeight;
                let yCenter = clientHeight/2 - logotypeHeight/2;
                let navTop = - getValueElementInTransformMatrix(NAV, 5);

                y = yCenter + navTop;
            }
            else {
                let clientHeight = document.documentElement.clientHeight;
                let logotypeHeight = LOGOTYPE.offsetHeight;
                let yCenter = clientHeight/2 - logotypeHeight/2;
                const HEADER = document.getElementById('header');
                let headerPaddTop = parseInt(window.getComputedStyle(HEADER).paddingTop, 10);
                const MAINTITLE = document.querySelector('#maintitle');
                let maintitlePaddTop = parseInt(window.getComputedStyle(MAINTITLE).paddingTop, 10);
                
                y = yCenter - headerPaddTop - maintitlePaddTop;
            }
        }
        else if (earlyParemt === document.querySelector('.navframe')){
            const MAINTITLE = document.querySelector('#maintitle');
            const FRAME = MAINTITLE.querySelector('.frame');
            let frameHeight = FRAME.offsetHeight;
            let maintitlePaddBot = parseInt(window.getComputedStyle(MAINTITLE).paddingBottom, 10);

            y = frameHeight + maintitlePaddBot;
        }
        else {
            let logotypeHeight = countLogotypeHeight();

            y = - logotypeHeight;
        }

        return y;
    }

    /* Установка старого положение логотипа по оси "X" и "Y" относительно нового родителя */
    function setLogotypePosition(earlyParemt){
        let x = countLogotypeXPosition(earlyParemt);
        let y = countLogotypeYPosition(earlyParemt);

        LOGOTYPE.style.left = '' + x + 'px';
        LOGOTYPE.style.top = '' + y + 'px';
    }

    /* Подсчет нового положение логотипа по оси "X" относительно нового родителя */
    function countLogotypeNewXPosition(){
        let x;
        if (LOGOTYPE.parentElement === document.querySelector('.navframe')){
            x = 0;
            
            if (NAV.classList.contains('nav-down')) {
                LOGOTYPE.classList.add('logo-average');
            }
            else {
                LOGOTYPE.classList.add('logo-nav');
            }
        }
        else {
            if (document.documentElement.clientWidth < maxMedia  && document.documentElement.clientWidth > minMedia && document.documentElement.clientWidth < document.documentElement.clientHeight){
                const MAINTITLE = document.querySelector('#maintitle');
                const FRAME = MAINTITLE.querySelector('.frame');
                const LOGO = LOGOTYPE.querySelector('img');
                let frameWidth = FRAME.offsetWidth;
                let logotypeWidth = LOGO.naturalWidth;
                let logotypeMargineLeft = parseInt(window.getComputedStyle(LOGOTYPE).marginLeft, 10);
        
                x = frameWidth/2 - logotypeWidth/2 - logotypeMargineLeft;
            }
            else {
                x = 0;
            }
        }

        return x;
    }

    /* Подсчет высоты логотипа с учетом ширины экрана */
    function countLogotypeHeight(){
        const LOGO = LOGOTYPE.querySelector('img');
        let logotypeHeight;
        if (document.documentElement.clientWidth > minMedia){
            logotypeHeight = LOGO.naturalHeight;
        }
        else{
            logotypeHeight = (document.documentElement.clientWidth - 60)*(LOGO.naturalHeight / LOGO.naturalWidth);    
        }

        return logotypeHeight;
    }

    /* Подсчет нового положение логотипа по оси "Y" относительно нового родителя */
    function countLogotypeNewYPosition(){
        let y;
        if (LOGOTYPE.parentElement === document.querySelector('.navframe')){
            y = 0;

            LOGOTYPE.style.marginRight = '';
        }
        else {
            if (document.documentElement.clientWidth < maxMedia && document.documentElement.clientWidth < document.documentElement.clientHeight){
                const MAINTITLE = document.querySelector('#maintitle');
                let maintitlePaddTop = parseInt(window.getComputedStyle(MAINTITLE).paddingTop, 10);

                LOGOTYPE.style.marginRight = '';

                let logotypeHeight = countLogotypeHeight();

                y = - logotypeHeight - maintitlePaddTop - 35;
            }
            else {
                const MAINTITLE = document.querySelector('#maintitle');
                let maintitlePaddBot = parseInt(window.getComputedStyle(MAINTITLE).paddingBottom, 10);
                const FRAME = MAINTITLE.querySelector('.frame');
                let frameWidth = FRAME.offsetHeight;
                let logotypeHeight;
                if (document.documentElement.clientWidth < maxMedia && document.documentElement.clientWidth > minMedia && document.documentElement.clientWidth > document.documentElement.clientHeight){
                    let logotypeMarginRight = setLogotypeMarginRight();
                    logotypeHeight = countLogotypeHeightAfterMarginPress(logotypeMarginRight);
                }
                else {
                    const LOGO = LOGOTYPE.querySelector('img');
                    logotypeHeight = LOGO.naturalHeight;
                }

                y = frameWidth + maintitlePaddBot - logotypeHeight;
            }
            LOGOTYPE.classList.remove('logo-average');
            LOGOTYPE.classList.remove('logo-nav');
        }

        return y;
    }

    /* Установка нового положение логотипа по оси "X" и "Y" относительно нового родителя */
    function setLogotypeNewPosition(){
        let x = countLogotypeNewXPosition();
        let y = countLogotypeNewYPosition();
        if (parseInt(LOGOTYPE.style.left, 10) !== x || parseInt(LOGOTYPE.style.top, 10) !== y){
            LOGOTYPE.classList.add('logo-transition');
            LOGOTYPE.style.left = '' + x + 'px';
            LOGOTYPE.style.top = '' + y + 'px';
            LOGOTYPE.addEventListener('transitionend', function(){
                LOGOTYPE.classList.remove('logo-transition');
            });
        };
    }

    /* Перемещение логотипа в панель навигации (смена родителя) */
    function setLogotypeParentIsNavigation(){
        const NAVFRAME = NAV.querySelector('.navframe');
        NAVFRAME.insertBefore(LOGOTYPE, NAVFRAME.children[0]);
    }

    /* Перемещение логотипа в основной заголовок (смена родителя) */
    function setLogotypeParentIsMaintitle(){
        const MAINTITLE = document.getElementById('maintitle');
        const MAINTITLE_FRAME = MAINTITLE.querySelector('.frame');
        MAINTITLE_FRAME.insertBefore(LOGOTYPE, MAINTITLE_FRAME.children[0]);
    }

    /* Функция установки paddingTop у header */
    function setHeader() {
        const BANNER = document.querySelector('body');
        const HEADER = document.getElementById('header');
        let headerPadBott = parseInt(window.getComputedStyle(HEADER).paddingBottom, 10);
        const MAINTITLE = document.getElementById('maintitle');
        let maintitleHeig = MAINTITLE.offsetHeight;
        let clientHeight = document.documentElement.clientHeight;
        let headerPadTop = clientHeight - headerPadBott - maintitleHeig;
        let bannerBGPosY = headerPadTop + maintitleHeig - 1100;
        if (bannerBGPosY > -200) {
            BANNER.style.backgroundPositionY = "-200px";
            HEADER.style.paddingTop = 900 - maintitleHeig + 'px';
        }
        else {
            BANNER.style.backgroundPositionY = bannerBGPosY + 'px';
            HEADER.style.paddingTop = headerPadTop + 'px';
        }

        setScrollBorderForChangingParentLogotype();
    }

    /* Функция скрытия прелоадера */
    function closePreloader(){
        const PRELOADER = document.getElementById('preloader');
        PRELOADER.style.display = 'none';
    }

    /* Функция задания положения логотипа */
    function setLogotype(e){
        let earlyParemt = LOGOTYPE.parentElement;
        let scrolled = window.pageYOffset || document.documentElement.scrollTop;
        const NAVFRAME = document.querySelector('.navframe');
        const PRELOADER = document.getElementById('preloader');
        //Если находимся в начале страницы, но логотип находится на панеле навигации или только загружена страницу.
        if (scrolled < scrollBorder && (earlyParemt == NAVFRAME || earlyParemt == PRELOADER)){
            window.removeEventListener('scroll', setLogotype);
            setLogotypeParentIsMaintitle();
            setLogotypePosition(earlyParemt);
            setTimeout(setLogotypeNewPosition, 10);
            LOGOTYPE.addEventListener('transitionend', function(){
                window.addEventListener('scroll', setLogotype);
            });
        }
        //Если страница пролистана ниже основного заголовка, но логотип находится возле основного заголока или только загружена страница.
        else if (scrolled >= scrollBorder && (earlyParemt != NAVFRAME || earlyParemt == PRELOADER)){
            window.removeEventListener('scroll', setLogotype);
            setLogotypeParentIsNavigation();
            setLogotypePosition(earlyParemt);
            setTimeout(setLogotypeNewPosition, 10);
            LOGOTYPE.addEventListener('transitionend', function(){
                window.addEventListener('scroll', setLogotype);
            });
        }
        //Если мы вызвали функцию при смене ориентации страницы (строка344) и родитель логотипа не должен измениться.
        else if ((scrolled < scrollBorder && earlyParemt != NAVFRAME) || (scrolled >= scrollBorder && earlyParemt == NAVFRAME)){
            if (e.type === 'change'){
                setLogotypeNewPosition();
            };
        }
    }

    /* СОБЫТИЯ */
    /* При загрузки страницы */
    window.addEventListener('load', setMaintitleTextMarginLeft);
    window.addEventListener('load', setHeader);
    window.addEventListener('load', closePreloader);
    window.addEventListener('load', setLogotype);

    /* При смене ориентации страницы */
    const MEDIAQ = window.matchMedia("(orientation: portrait)");//Событие изменения ориентации.

    MEDIAQ.addListener(setMaintitleTextMarginLeft);
    MEDIAQ.addListener(setHeader);
    MEDIAQ.addListener(setLogotype);

    /* КНОПКА МЕНЮ */
    /* ФУНКЦИИ */
    function endNavigationDown() {
        MENU_BTN.classList.remove('menubtn-down');
        MENU_BTN.classList.add('menubtn-close');
        NAV.removeEventListener('transitionend', endNavigationDown);
    }

    function endNavigationUp() {
        MENU_BTN.classList.remove('menubtn-up');
        NAV.removeEventListener('transitionend', endNavigationUp);
    }

    function endNavigationUpDownForLogotype(){
        LOGOTYPE.classList.remove('logo-navtransition');
        LOGOTYPE.removeEventListener('transitionend', endNavigationUpDownForLogotype);
    }

    /* СОБЫТИЯ */
    /* Событие при нажатие на кнопку меню */
    MENU_BTN.onclick = () => {
        if (NAV.classList.contains('nav-down')) {
            LOGOTYPE.classList.add('logo-navtransition');
            NAV.classList.remove('nav-down');
            if (LOGOTYPE.parentElement === document.querySelector('.navframe')){
                LOGOTYPE.classList.remove('logo-average');
                LOGOTYPE.classList.add('logo-nav');
            }
            TOOLBAR.classList.remove('toolbar-up');
            MENU_BTN.classList.remove('menubtn-close');
            MENU_BTN.classList.add('menubtn-up');
            /* Remove shadow from buttons */
            MENU_BTN.classList.remove('toolbar-down');
            UP_BTN.classList.remove('toolbar-down');
            /* Set static menu button type */
            NAV.addEventListener('transitionend', endNavigationUp);
            LOGOTYPE.addEventListener('transitionend', endNavigationUpDownForLogotype);
        }
        else if (MENU_BTN.classList.contains('menubtn-down')) {
            LOGOTYPE.classList.add('logo-navtransition');
            NAV.classList.add('nav-down');
            if (LOGOTYPE.parentElement === document.querySelector('.navframe')){
                LOGOTYPE.classList.remove('logo-nav');
                LOGOTYPE.classList.add('logo-average');
            }
            TOOLBAR.classList.add('toolbar-up');
            /* menubtn-down classs for button type already added from Onmouseenter event */
            /* Set shadow from buttons */
            MENU_BTN.classList.add('toolbar-down');
            UP_BTN.classList.add('toolbar-down');
            /* Set static menu button type */
            NAV.addEventListener('transitionend', endNavigationDown);
            LOGOTYPE.addEventListener('transitionend', endNavigationUpDownForLogotype);
        }
        else {
            LOGOTYPE.classList.add('logo-navtransition');
            NAV.classList.add('nav-down');
            if (LOGOTYPE.parentElement === document.querySelector('.navframe')){
                LOGOTYPE.classList.remove('logo-nav');
                LOGOTYPE.classList.add('logo-average');
            }
            TOOLBAR.classList.add('toolbar-up');
            MENU_BTN.classList.add('menubtn-down');
            /* Set shadow from buttons */
            MENU_BTN.classList.add('toolbar-down');
            UP_BTN.classList.add('toolbar-down');
            /* Set static menu button type */
            NAV.addEventListener('transitionend', endNavigationDown);
            LOGOTYPE.addEventListener('transitionend', endNavigationUpDownForLogotype);
        }
    }

    /* Событие при наведение курсора на кнопку меню */
    MENU_BTN.onmouseenter = () => {
        if (NAV.classList.contains('nav-down')) {
        }
        else {
            MENU_BTN.classList.add('menubtn-down');
        }
    }

    /* Событие при отведение курсора с кнопки меню */
    MENU_BTN.onmouseleave = () => {
        if (MENU_BTN.classList.contains('menubtn-close')) {
        }
        else if (NAV.classList.contains('nav-down')) {
        }
        else {
            MENU_BTN.classList.remove('menubtn-down');
        }
    }

    /* КНОПКА "ВВЕРХ" */
    /* ФУНКЦИИ */
    /* Видимость кнопки "вверх" */
    function visibleUpButton() {
        let scrolled = window.pageYOffset || document.documentElement.scrollTop;
        if (scrolled > 1) {
            UP_BTN.style.display = 'block';
        } else {
            UP_BTN.style.display = 'none';
        }
    }
    /* СОБЫТИЯ */
    window.addEventListener('scroll', visibleUpButton);

    /* АНИМАЦИЯ КНОПОК 'ОБРАЗЕЦ ДОГОВОРА' И 'ОТПРАВИТЬ' */
    /* ПЕРЕМЕННЫЕ */
    const WIDEBUTTONS = document.querySelectorAll('.widebutton__button');

    /* ФУНКЦИИ */
    function pressEndWidebutton(e){
        if (e.propertyName === 'transform') {
            this.classList.remove('widebutton-pressed');
            this.removeEventListener('transitionend', pressEndWidebutton);
            if (this.querySelector('.widebutton__button-sample')){
                popupCreate(this.parentElement);
            }
        };
    }

    function pressWidebutton(){
        const FRAME = this.parentElement;
        const WIDEBUTTON = FRAME.parentElement;
        WIDEBUTTON.classList.add('widebutton-pressed');
        WIDEBUTTON.addEventListener('transitionend', pressEndWidebutton);
    }

    /* Функция создания элемента */
    function createElement(tag, props, parent){
        const element = document.createElement(tag);
    
        Object.keys(props).forEach(key => element[key] = props[key]);

        parent.appendChild(element);
    
        return element;
    }

    /* Функция создания всплывающего окна с образцом договора */
    function popupCreate(parent){
        const POPUP = createElement('div', { className: 'widebutton__popup' }, parent);
        // Элеменет в Position: Fixed занимает максимум 100% ширины и высоты видимой части эерана вне зависимости от содержимого,
        // чтобы иметь возможность корректно разместить содержимое большего разрешения с возможностью скрола необходимо создать дополнительный контейнер. 
        const POPUPCONTENT_WRAP = createElement('div', { className: 'widebutton__sample' }, POPUP);
        createElement('canvas', { className: 'bubblespanel widebutton__bubblespanel'}, POPUPCONTENT_WRAP);
        const IMG_WRAP = createElement('div', { className: 'samplewindow' }, POPUPCONTENT_WRAP);
        const IMG = createElement('img', { className: 'samplewindow__img', src: 'img/contract.jpg' }, IMG_WRAP);
        IMG.addEventListener('load', () => {
            // Рисуемые элементы в Canvas зависимы от высоты и ширины Canvas, которое оно занимает,
            // и его не возможно окончательно вычислить пока не загрузится элемент IMG,
            // от разрешения которого просчитывается размеры остальных элементов иерархически его содержащих.
            const WIDEBUTTON_BUBBLESPANEL = new BubblesPanel('.widebutton__bubblespanel');
        });
        const CLSBTN = createElement('button', { className: 'closebtn' }, IMG_WRAP);
        createElement('span', { className: 'closebtn__cross' }, CLSBTN);
        CLSBTN.onclick = () => {
            POPUP.remove();
        }
    }

    /* СОБЫТИЯ */
    WIDEBUTTONS.forEach(e => {
        e.onclick = pressWidebutton;
    });

    /* АНИМАЦИЯ КНОПОК КОНТАКТОВ */
    /* ПЕРЕМЕННЫЕ */
    const MES_BTNS = document.querySelectorAll('.contactsdata__mesbtn');

    /* ФУНКЦИИ */
    function pressEndMesBtn(e){
        if (e.propertyName === 'transform') {
            this.classList.remove('contactsdata__mesbtn-pressed');
            this.removeEventListener('transitionend', pressEndMesBtn);
        };
    }

    function pressMesBtn(){
        this.classList.add('contactsdata__mesbtn-pressed');
        this.addEventListener('transitionend', pressEndMesBtn);
    }

    /* СОБЫТИЯ */
    MES_BTNS.forEach(e => {
        e.onclick = pressMesBtn;
    });

    /* МАСКИ ВВОДА */
    /* Маска для поля ввода телефона */
    window.addEventListener("DOMContentLoaded", function() {
        function setCursorPosition(pos, elem) {
            elem.focus();
            if (elem.setSelectionRange) elem.setSelectionRange(pos, pos);
            else if (elem.createTextRange) {
                let range = elem.createTextRange();
                range.collapse(true);
                range.moveEnd("character", pos);
                range.moveStart("character", pos);
                range.select();
            }
        }
        function mask(event) {
            let matrix = "+7 (___) ___ ____",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, "");
            if (def.length >= val.length) val = def;
            this.value = matrix.replace(/./g, function(a) {
                return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a
            });
            if (event.type == "blur") {
                if (this.value.length == 2) this.value = "";
            }
            else setCursorPosition(this.value.length, this);
        };
        let input = document.querySelector("#contact");
        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
    });
})();