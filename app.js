const config = {
	async fetchData(searchItem) {
		const response = await axios.get('http://www.omdbapi.com/', {
			params: {
				apikey: 'd9d84edd',
				s: searchItem
			}
		});

		if (response.data.Error) {
			return [];
		}

		return response.data.Search;
	}
};

complete({
	...config,
	root: document.querySelector('#left'), //left side completing
	optionSelect(movie) {
		onMovieSelect(movie, document.querySelector('#summary-left'), 'left');
	}
});

complete({
	...config,
	root: document.querySelector('#right'), //right side completing
	optionSelect(movie) {
		onMovieSelect(movie, document.querySelector('#summary-right'), 'right');
	}
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: 'd9d84edd',
			i: movie.imdbID
		}
	});
	summaryElement.innerHTML = movieTemplate(response.data);

	if (side === 'left') {
		leftMovie = response.data;
	} else {
		rightMovie = response.data;
	}

	if (leftMovie && rightMovie) {
		comparison();
	}
};

const comparison = () => {
	const leftSideStats = document.querySelectorAll('#summary-left .notification');
	const rightSideStats = document.querySelectorAll('#summary-right .notification');

	leftSideStats.forEach((leftStat, index) => {
		const rightStat = rightSideStats[index];

		const leftSideValue = parseInt(leftStat.dataset.value);
		const rightSideValue = parseInt(rightStat.dataset.value);

		if (rightSideValue > leftSideValue) {
			leftStat.classList.remove('is-dark');
			rightStat.classList.remove('is-dark');
			rightStat.classList.add('is-success');
			leftStat.classList.add('is-danger');
		} else {
			rightStat.classList.remove('is-dark');
			leftStat.classList.remove('is-dark');
			leftStat.classList.add('is-success');
			rightStat.classList.add('is-danger');
		}
	});
};

const movieTemplate = (movieDetail) => {
	const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
	const metascore = parseInt(movieDetail.Metascore);
	const imdbRating = parseFloat(movieDetail.imdbRating);
	const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
	const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
		const value = parseInt(word);

		if (isNaN(value)) {
			return prev;
		} else {
			return prev + value;
		}
	}, 0);

	return `
	<div class="media">
		<figure class="media-left">
			<p class="image">
				<img src="${movieDetail.Poster}" alt="">
			</p>
		</figure>
		<div class="media-content">
			<div class="content">
				<h1>${movieDetail.Title}</h1>
				<h4>${movieDetail.Genre}</h4>
				<p>${movieDetail.Plot}</p>
			</div>
		</div>
	</div>
	<div data-value=${awards} class="notification is-dark">
		<p class="title">${movieDetail.Awards}</p>
		<p class="subtitle">Awards</p>
	</div>
	<div data-value=${dollars} class="notification is-dark">
		<p class="title">${movieDetail.BoxOffice}</p>
		<p class="subtitle">Box Office</p>
	</div>
	<div data-value=${metascore} class="notification is-dark">
		<p class="title">${movieDetail.Metascore}</p>
		<p class="subtitle">Metascore</p>
	</div>
	<div data-value=${imdbRating} class="notification is-dark">
		<p class="title">${movieDetail.imdbRating}</p>
		<p class="subtitle">IMDB Rating</p>
	</div>
	<div data-value=${imdbVotes} class="notification is-dark">
		<p class="title">${movieDetail.imdbVotes}</p>
		<p class="subtitle">IMDB Votes</p>
	</div>
	`;
};
