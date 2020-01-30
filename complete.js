const complete = ({ root, fetchData, optionSelect }) => {
	root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" type="text" placeholder="Type a movie...">
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
`;

	const input = root.querySelector('input');
	const dropdown = root.querySelector('.dropdown');
	const results = root.querySelector('.results');

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
				input.value = '';
				optionSelect(movie);
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
};
