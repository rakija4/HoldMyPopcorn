// RegExp for filtering titles
// value - string to check
// searchValue - string to check with
const stringMatches = (value, searchValue) => {
    const reg1 = new RegExp(searchValue, 'gi');
    const reg2 = new RegExp(searchValue.replace('&', 'and'), 'gi');
    const reg3 = new RegExp(searchValue.replace('and', '&'), 'gi');
    return value.match(reg1) || value.match(reg2) || value.match(reg3);
}

// Getting results for given searchValue - fetching basic data from API
const getResults = async function() {
    moviesArr = [];

    try {
        searchPhrase = searchInput.value;
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchPhrase}`;
        const res = await fetch(url);
        const json = await res.json();
        const totalPages = await json.total_pages;

        for (let i = 1; i <= totalPages; i++) {
            const secondRes = await fetch(url + '&page=' + i); //Second fetch to get data from all pages
            const secondJson = await secondRes.json();

            secondJson.results.forEach(item => {
                const title = item.title;
                const originalTitle = item.original_title;

                if (((stringMatches(title, searchPhrase)) || (stringMatches(originalTitle, searchPhrase))) && ((item.release_date !== undefined) && (item.release_date !== '')))
                    moviesArr.push(item);
            })
        }
    } catch (err) {
        console.log(err);
    }
}

// Wrapping function 
// s - string to wrap
// w - indicates approximate number of characters after which text is wrapped
const wrap = (s, w) => s.replace(
    new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, 'g'), '$1\n'
);

// Displaying results for given searchValue
const displayResults = function() {
    while (resultsList.firstChild) {
        resultsList.removeChild(resultsList.firstChild);
    }

    if (moviesArr.length > 0) {
        moviesArr.forEach(item => {
            const title = item.title;
            const originalTitle = item.original_title;
            const id = item.id;
            const releaseDate = item.release_date;
            const year = releaseDate.slice(0, 4);
            const poster = item.poster_path;
            const resultsItem = document.createElement('li');
            const itemTitle = document.createElement('span');
            const itemYear = document.createElement('span');
            const innerSpan = document.createElement('span');
            const itemImg = document.createElement('img');

            resultsItem.classList.add('c-search__item');
            resultsItem.id = id;
            itemTitle.classList.add('c-search__item-title');
            itemYear.classList.add('c-search__item-year', 't4');
            innerSpan.classList.add('_inner-span');
            itemImg.classList.add('c-search__item-img');
            resultsItem.classList.add('c-search__item--hover');

            if ((title === originalTitle) || ((title !== originalTitle) && (stringMatches(title, searchPhrase)))) {
                itemTitle.innerText = title;
                itemImg.alt = `movie poster for ${title}`;
            } else {
                itemTitle.innerText = originalTitle;
                itemImg.alt = `movie poster for ${originalTitle}`;
            }

            itemTitle.innerText = wrap(itemTitle.innerText, 50);

            if (poster !== null)
                itemImg.src = `https://image.tmdb.org/t/p/w92/${poster}`;
            else
                itemImg.src = 'assets/img/fallback_w92.jpg';

            innerSpan.innerText = `(${year})`;
            resultsItem.appendChild(itemTitle);
            itemYear.appendChild(innerSpan);
            resultsItem.appendChild(itemYear);
            resultsItem.appendChild(itemImg);
            resultsList.appendChild(resultsItem);

            resultsItem.addEventListener('click', resultsListItemClick);
        })
    } else {
        const resultsItem = document.createElement('li');
        resultsItem.classList.add('c-search__no-item', 't4');
        resultsItem.innerText = 'No results... :( ';
        resultsList.appendChild(resultsItem);
    }


    searchBtn.classList.remove('c-search__btn--loading');
}

export {getResults, displayResults};
