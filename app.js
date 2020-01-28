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
	for (movie of movies) {
		const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
		const option = document.createElement('a');

		option.classList.add('dropdown-item');
		option.innerHTML = `
			<img class="poster" src="${imgSrc}">
			<div>${movie.Title}, ${movie.Year}</div>
		`;
		results.append(option);
	}
};

input.addEventListener('input', debounce(onInput, 500));

document.addEventListener('click', (event) => {
	if (!root.contains(event.target)) {
		dropdown.classList.remove('is-active');
	}
});
