import svg4everybody from 'svg4everybody';
import $ from 'jquery';


document.querySelector('.field__input--textarea').addEventListener('keyup', function () {
	this.style.height = '6em';
	this.style.height = this.scrollHeight + 'px';
});

$(() => {
	svg4everybody();
});


