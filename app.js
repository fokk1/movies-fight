const fetchData = async (searchItem) => {
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
};

const root = document.querySelector('.autocomplete');
root.innerHTML = `
	<label><b>Search<b></label>
	<input class="input" type="text" placeholder="Type a movie...">
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
			</div>
		</div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const results = document.querySelector('.results');

const onInput = async (event) => {
	const movies = await fetchData(event.target.value);

	if (!movies.length) {
		dropdown.classList.remove('is-active');
		return;
	}

	results.innerHTML = '';
	dropdown.classList.add('is-active');
	for (let movie of movies) {
		const option = document.createElement('a');
		const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

		option.classList.add('dropdown-item');
		option.innerHTML = `
		<img class="poster" src="${imgSrc}" />
		<div>${movie.Title}, ${movie.Year}</div>
	  `;
		option.addEventListener('click', () => {
			dropdown.classList.remove('is-active');
			input.value = movie.Title;
			onMovieSelect(movie);
		});

		results.append(option);
	}
};

input.addEventListener('input', debounce(onInput, 500));

document.addEventListener('click', (event) => {
	if (!root.contains(event.target)) {
		dropdown.classList.remove('is-active');
	}
});

const onMovieSelect = async (movie) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: 'd9d84edd',
			i: movie.imdbID
		}
	});
	document.querySelector('#test').innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail) => {
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
	<div class="notification is-dark">
		<p class="titile">${movieDetail.Awards}</p>
		<p class="subtitile">Awards</p>
	</div>
	<div class="notification is-dark">
		<p class="titile">${movieDetail.BoxOffice}</p>
		<p class="subtitile">Box Office</p>
	</div>
	<div class="notification is-dark">
		<p class="titile">${movieDetail.Metascore}</p>
		<p class="subtitile">Metascore</p>
	</div>
	<div class="notification is-dark">
		<p class="titile">${movieDetail.imdbRating}</p>
		<p class="subtitile">IMDB Rating</p>
	</div>
	<div class="notification is-dark">
		<p class="titile">${movieDetail.imdbVotes}</p>
		<p class="subtitile">IMDB Votes</p>
	</div>
	`;
};
