import svg4everybody from 'svg4everybody';
import $ from 'jquery';


document.querySelector('.field__input--textarea').addEventListener('keyup', function () {
	this.style.height = '6em';
	this.style.height = this.scrollHeight + 'px';
});

$(() => {
	svg4everybody();
});


function Publisher() {
	this.subscribers = [];
}

Publisher.prototype.deliver = function (data, publisher) {
	publisher.subscribers.forEach(
		function (callback) {
			callback.fn.call(callback.scope, data);
		});

};

function HTMLElem(ElemTag, ElemProps) {

	if (typeof ElemTag !== 'undefined') {
		this.createTag(ElemTag);
	}
	if (typeof ElemProps !== 'undefined') {
		this.setHTMLElemProps(ElemProps);
	}

}

HTMLElem.prototype.createTag = function (ElemTag){
	this.htmlElem = document.createElement(ElemTag);

	return this;

};

HTMLElem.prototype.setHTMLElemProps = function (ElemProps) {
	for (const key in ElemProps) {
		if (ElemProps.hasOwnProperty(key)) {
			if ((key === 'styles' || key === 'style') && typeof ElemProps[key] === 'object') {
				for (const rule in ElemProps[key]) {
					if (ElemProps[key].hasOwnProperty(rule)) {
						this.htmlElem.style[rule] = ElemProps[key][rule];
					}
				}
			}else if (key === 'html') {
				this.htmlElem.innerHTML = ElemProps[key];
			}else {
				this.htmlElem.setAttribute(key, ElemProps[key]);
			}
		}
	}
	return this;
};


// HTMLElem.prototype.getHTMLElemProp = function (ElemProp) {
// 	return this.htmlElem.getAttribute(ElemProp);
// };

HTMLElem.prototype.attachToParent = function (parentElem) {
	if (parentElem.nodeType === 1){
		parentElem.appendChild(this.htmlElem);
	}
	return this;
};

HTMLElem.prototype.render = function () {
	const obj = this;
	for (const prop in obj){
		if (obj.hasOwnProperty(prop) && obj[prop].hasOwnProperty('htmlElem') ){
			obj[prop].attachToParent(obj.htmlElem);
		}
	}
	this.htmlElem = obj.htmlElem;

	return this;
};

HTMLElem.prototype.addEventListener = function (event, callback) {
	this.htmlElem.addEventListener(event, callback);

	return this;
};

HTMLElem.prototype.removeEventListener = function (event, callback) {
	this.htmlElem.removeEventListener(event, callback);

	return this;
};

HTMLElem.prototype.setState = function (state) {
	for (const key in state) {
		if (state.hasOwnProperty(key)) {
			this.state[key] = state[key];
		}
	}
	this.syncFromState();
	return this.state;
};

HTMLElem.prototype.syncFromState = function () {};

HTMLElem.prototype.subscribe = function (publisher, scope, fn) {
	const callback = {};
	callback.scope = scope;
	callback.fn = fn;
	publisher.subscribers.push(callback);
};

function Datalist(state){
	Object.setPrototypeOf( this, new HTMLElem() );
	this.state = state;


	this.createTag('datalist').setHTMLElemProps({for: this.state.name});

	const self = this;
	let optionsCount = 0;

	const existDatalist = document.querySelector('datalist[for="' + this.state.name + '"]');
	if (existDatalist) {

		[].forEach.call(existDatalist.children, function (option, index) {
			if (option.hasAttribute('label')) {
				self['option' + index] = new HTMLElem('option', {
					value: option.getAttribute('value'),
					label: option.getAttribute('label')
				});
				optionsCount++;
			}
		});


	}else {
		self.option1 = new HTMLElem('option', {
			value: '0',
			label: 'Не владею'
		});
		self.option2 = new HTMLElem('option', {
			value: '20',
			label: 'Использую готовые решения'
		});
		self.option3 = new HTMLElem('option', {
			value: '50',
			label: 'Использую готовые решения и умею их переделывать'
		});
		self.option4 = new HTMLElem('option', {
			value: '100',
			label: 'Пишу сложный JS с нуля'
		});
		optionsCount = 4;
	}

	self.optionsCount = optionsCount;
	self.render();
	return self;
}

function Label(optionObj, cols, isLast) {
	Object.setPrototypeOf( this, new HTMLElem() );

	this.valueAttr = parseFloat(optionObj.htmlElem.getAttribute('value'));
	this.labelAttr = optionObj.htmlElem.getAttribute('label');

	this.createTag('div').setHTMLElemProps({
		'data-value': this.valueAttr,
		html: this.labelAttr,
		class: 'slider__label  font__label font__label--slider',
		style: {
			left: (isLast) ? 'auto' : (this.valueAttr - 1.298) + '%',
			'max-width': (cols > 0 ) ? ((100 / cols) + '%') : '100%'
		}
	});
	this.render();

}

function LabelPoint(optionObj) {
	Object.setPrototypeOf( this, new HTMLElem() );

	this.valueAttr = parseFloat(optionObj.htmlElem.getAttribute('value'));
	this.createTag('div').setHTMLElemProps({
		class: 'slider__point',
		style: 'left: ' + (this.valueAttr - 1.298) + '%'
	});
	this.render();
}

function Thumb(state){
	Object.setPrototypeOf( this, new HTMLElem() );
	this.state = state;
	this.shiftX = 1.2;

	this.createTag('div').setHTMLElemProps({
		class: 'triangle',
		style: {left: this.state.posX - this.shiftX + '%'}
	});

	this.syncFromState = function () {
		this.setHTMLElemProps({
			style: {left: this.state.posX - this.shiftX + '%'}
		});
	};

	this.render();
}

function Input(state){
	Object.setPrototypeOf( this, new HTMLElem() );
	this.state = state;

	this.createTag('input').setHTMLElemProps({
		type: 'text',
		name: this.state.name,
		value: this.state.value,
		class: 'slider__value'
	});
	this.syncFromState = function () {
		this.setHTMLElemProps({
			value: this.state.value
		});
	};
	this.render();

}

function SliderState(name, value, min, max) {
	this.name = (typeof name !== 'undefined') ? name : 'slider';
	this.min = (typeof min !== 'undefined') ? parseInt(min, 10) : parseInt('0', 10);
	this.max = (typeof max !== 'undefined') ? parseInt(max, 10) : parseInt('100', 10);
	this.value = (typeof value !== 'undefined') ? parseInt(value, 10) : this.min;
	this.posX = (this.value - this.min) / (this.max - this.min);

}

SliderState.prototype.setValue = function (newValue){
	const oldValue = this.value;
	if (newValue === oldValue) {
		return this;
	}
	if (newValue <= this.min){
		this.value = this.min;
	}else if (newValue >= this.max){
		this.value = this.max;
	}else if ((this.min < newValue) && (newValue < this.max)){
		this.value = newValue;
	}
	this.posX = (this.value - this.min) / (this.max - this.min) * 100;
	return this;
};

function Slider(name, value, min, max) {

	Object.setPrototypeOf(this, new HTMLElem());
	this.publishValue = new Publisher();
	this.state = new SliderState(name, value, min, max);

	this.createTag('div').setHTMLElemProps({id: this.state.name, class: 'section__slider'});
	this.thumbElem = new Thumb(this.state);
	this.inputElem = new Input(this.state);

	this.datalistElem = new Datalist(this.state);
	const cols = parseInt(this.datalistElem.optionsCount, 10);
	for (const key in this.datalistElem){
		if (this.datalistElem.hasOwnProperty(key) && ( this.datalistElem[key].hasOwnProperty('htmlElem') )) {
			const optionObj = this.datalistElem[key];
			const valueAttr = parseInt(optionObj.htmlElem.getAttribute('value'), 10);
			this[key] = new Label(optionObj, cols, valueAttr === this.state.max);
			if ((this.state.min < valueAttr) && (valueAttr < this.state.max)) {
				this[key + 'Point'] = new LabelPoint(optionObj);
			}
		}
	}
	this.render();

	const that = this;
	this.thumbElem.subscribe(that.publishValue, that.thumbElem, that.thumbElem.setState);
	this.inputElem.subscribe(that.publishValue, that.inputElem, that.inputElem.setState);

	this.inputElem.addEventListener('change', function (event) {
		that.publishValue.deliver(that.state.setValue(event.target.value), that.publishValue);
	});
	this.addEventListener('click', function (event) {
		if (event.target.id === that.state.name) {
			const sliderClickPosX = event.offsetX / event.target.clientWidth * 100;
			const sliderClickValue = that.state.min + sliderClickPosX * (that.state.max - that.state.min) / 100;
			that.publishValue.deliver(that.state.setValue(sliderClickValue), that.publishValue);
		}
		if (event.target.attributes['data-value']){
			const dataValue = event.target.attributes['data-value'].value;
			that.publishValue.deliver(that.state.setValue(dataValue), that.publishValue);
		}

	});
	this.thumbElem.addEventListener('mousedown', function (event) {
		event.preventDefault();
		that.addEventListener('mousemove', that.onMouseMove);
		that.addEventListener('mouseup', that.onMouseUp);
	});
	this.thumbElem.addEventListener('dragstart', function () {
		return false;
	});

	this.onMouseMove = function (event){
		if (event.target.id === that.state.name) {
			const sliderClickPosX = event.offsetX / event.target.clientWidth * 100;
			const sliderClickValue = that.state.min + sliderClickPosX * (that.state.max - that.state.min) / 100;
			that.publishValue.deliver(that.state.setValue(sliderClickValue), that.publishValue);
		}
	};
	this.onMouseUp = function (){
		that.removeEventListener('mousemove', that.onMouseMove);
		that.removeEventListener('mouseup', that.onMouseUp);
	};

}



const sliderJs = new Slider('jslevel');
sliderJs.attachToParent(document.querySelector('.sl-place'));

