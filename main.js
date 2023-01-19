import conditions from './conditions.js';

console.log(conditions);

const apiKey = 'e9a5d3b74bf84418b11193028231901';

// Элементы на странице
const header = document.querySelector('.header');
const form = document.querySelector('#form');
const input = document.querySelector('#inputCity');

function removeCard() {
	const prevCard = document.querySelector('.card');
	if (prevCard) prevCard.remove();
}

function showError(errorMessage) {
	// Отобразить карточку с ошибкой
	const html = `<div class="card">${errorMessage}</div>`;

	// Отображаем карточку на странице
	header.insertAdjacentHTML('afterend', html);
}

function showCard({ name, country, temp, condition, imgPath }) {
	// Разметка для карточки
	const html = `<div class="card">
                                <h2 class="card-city">${name} <span>${country}</span></h2>

                                <div class="card-weather">
                                    <div class="card-value">${temp}<sup>°c</sup></div>
                                    <img class="card-img" src="${imgPath}" alt="Weather">
                                </div>

                                <div class="card-description">${condition}</div>
                            </div>`;

	// Отображаем карточку на странице
	header.insertAdjacentHTML('afterend', html);
}

async function getWeather(city) {
	const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
	const response = await fetch(url);
	const data = await response.json();
	console.log(data);
    return data;
}

// Слушаем отправку формы
form.onsubmit = async function (e) {
	// Отменяем отправку формы
	e.preventDefault();

	// Берем значение из инпута, обрезаем пробелы
	let city = input.value.trim();

    // Получаем данные с сервера
    const data = await getWeather(city);

    if (data.error) {
		removeCard();
		showError(data.error.message);
	} else {
		removeCard();

		console.log(data.current.condition.code);

		const info = conditions.find(
			(obj) => obj.code === data.current.condition.code
		);
		console.log(info);
		console.log(info.languages[23]['day_text']);

        const filePath = './img/' + (data.current.is_day ? 'day' : 'night') + '/';
		const fileName = (data.current.is_day ? info.day : info.night) + '.png';
        const imgPath = filePath + fileName;
        console.log('filePath', filePath + fileName);

		const weatherData = {
			name: data.location.name,
			country: data.location.country,
			temp: data.current.temp_c,
			condition: data.current.is_day
				? info.languages[23]['day_text']
				: info.languages[23]['night_text'],
			imgPath,
		};

		showCard(weatherData);
	}

};
