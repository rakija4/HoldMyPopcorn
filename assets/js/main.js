// API Key
const apiKey = 'bef075c365f811a286c385f0b22262b0';

// Selecting DOM elements & global variables
const searchInput = document.querySelector('.c-search__input');
const searchBtn = document.querySelector('.c-search__btn');
const resultsList = document.querySelector('.c-search__list');
const noDataString = 'No available data.'

let searchPhrase = '';
let detailsNode;
let prevListItem;
let currId;
let entered = false;
let moviesArr = [];

async function searchButtonClick(event) {
    event.preventDefault();
    searchBtn.classList.add('c-search__btn--loading');
    const {getResults, displayResults} = await import('./modules/results.js')
    await getResults();
    await displayResults();
}

searchBtn.addEventListener('click', searchButtonClick);

// // Fetching cast&crew data from API
// async function getCrewAsync() {
//     const castUrl = `https://api.themoviedb.org/3/movie/${currId}/credits?api_key=${apiKey}`;

//     let castArr = [];
//     let directorArr = [];
//     let writerArr = [];

//     try {
//         const res = await fetch(castUrl);
//         const json = await res.json();
//         const cast = await json.cast;
//         const crew = await json.crew;

//         crew.forEach(member => {
//             if (member.department === 'Directing')
//                 directorArr.push(member.name);
//             if (member.department === 'Writing')
//                 writerArr.push(member.name);
//         });

//         for (let i = 0; i < 5; i++) {
//             if (cast[i] != undefined)
//                 castArr.push(cast[i]);
//         }
//     } catch (err) {
//         console.log(err);
//     }

//     return [directorArr, writerArr, castArr];
// }

// Getting details from API (genres, production countries, ratings, status)
// async function getMovieDetailsAsync() {
//     const detailsUrl = `https://api.themoviedb.org/3/movie/${currId}?api_key=${apiKey}`;

//     genresArr = [];
//     countriesArr = [];

//     try {
//         const res = await fetch(detailsUrl);
//         const json = await res.json();

//         json.production_countries.forEach(country => {
//             //For full names change 'iso_3166_1' to 'name'
//             countriesArr.push(country.iso_3166_1);
//         });

//         json.genres.forEach(genre => {
//             genresArr.push(genre.name);
//         })

//         ratingAverage = json.vote_average;
//         votesCount = json.vote_count;
//         status = json.status;
//         release = json.release_date;
//     } catch (err) {
//         console.log(err);
//     }

//     return [countriesArr, genresArr, ratingAverage, votesCount, release];
// }

// // Getting youtube link to the trailer
// async function getVideoAsync() {
//     const videoUrl = `http://api.themoviedb.org/3/movie/${currId}/videos?api_key=${apiKey}`;

//     trailerId = '';
//     youtubeLink = '';

//     try {
//         const res = await fetch(videoUrl);
//         const json = await res.json();
//         if (json.results[0] != undefined) {
//             trailerId = json.results[0].key;
//             youtubeLink = `https://www.youtube.com/watch?v=${trailerId}`;
//         }
//     } catch (err) {
//         console.log(err);
//     }

//     return [trailerId, youtubeLink]
// }

// Insert new node after the referance one ( especially made for li elements )
// referenceNode - node that you want to insert after
// newNode - node that you want to insert

// const getInfo = async function() {
//     const {getCrewAsync, getMovieDetailsAsync, getVideoAsync} = await import('./modules/getInfo.js');
//     const crew = await getCrewAsync();
//     const details = await getMovieDetailsAsync();
//     const video = await getVideoAsync();
// }

const insertAfterNode = (referenceNode, newNode) => {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

async function showDetailsAsync(item) {
    let genreString = '';
    let productionString = '';
    let directorsString = '';
    let writersString = '';

    const movie = moviesArr.find(movie => movie.id == currId);

    const {getCrewAsync, getMovieDetailsAsync, getVideoAsync} = await import('./modules/getInfo.js');
    const crew = await getCrewAsync();
    const details = await getMovieDetailsAsync();
    const video = await getVideoAsync();

    const directorArr = crew[0];
    const writerArr = crew[1];
    const castArr = crew[2];

    const countriesArr = details[0];
    const genresArr = details[1];
    const ratingAverage = details[2];
    const votesCount = details[3];
    const release = details[4];

    const trailerId = video[0];
    // const youtubeLink = video[1];


    const infoDetails = document.createElement('div');
    infoDetails.classList.add('c-info__details');

    item.appendChild(infoDetails);

    const infoHeader = document.createElement('div');
    infoHeader.classList.add('c-info__header');

    infoDetails.appendChild(infoHeader);

    const infoTitle = document.createElement('h3');
    infoTitle.classList.add('c-info__title', 't3');
    infoTitle.innerText = movie.title;

    infoHeader.appendChild(infoTitle);

    // Rating
    const infoRating = document.createElement('div');
    infoRating.classList.add('c-info__rating');

    infoHeader.appendChild(infoRating);

    const infoIcon = document.createElement('i');
    infoIcon.classList.add('c-info__icon', 'material-icons');
    infoIcon.innerText = 'star_border'

    infoRating.appendChild(infoIcon);

    const infoVotes = document.createElement('div');
    infoVotes.classList.add('c-info__votes');

    infoRating.appendChild(infoVotes);

    const infoVotesAverage = document.createElement('span');
    infoVotesAverage.classList.add('c-info__votes-average');

    infoVotes.appendChild(infoVotesAverage);

    const votesAverage = document.createElement('b')
    votesAverage.innerText = ratingAverage

    infoVotesAverage.appendChild(votesAverage);

    const votesMax = document.createElement('sub')
    votesMax.innerText = '/10';

    infoVotesAverage.appendChild(votesMax);

    const infoVotesTotal = document.createElement('span');
    infoVotesTotal.classList.add('c-info__votes-total');
    infoVotesTotal.innerText = votesCount;

    infoVotes.appendChild(infoVotesTotal);

    const infoList = document.createElement('ul');
    infoList.classList.add('c-info__list')

    infoDetails.appendChild(infoList);

    // Director
    //Break only for 1 result, otherway it gets all the directors
    for (let i = 0; i < directorArr.length; i++) {
        if (i === 0)
            directorsString = directorArr[i];
        else
            directorsString += ', ' + directorArr[i];
        break;
    }

    const infoListDirector = document.createElement('li')
    infoListDirector.classList.add('c-info__list-item');

    if (directorsString !== '')
        infoListDirector.innerHTML = '<span class="_list-span ">Director:</span>' + directorsString;
    else
        infoListDirector.innerHTML = '<span class="_list-span ">Director:</span>' + noDataString

    infoList.appendChild(infoListDirector);

    // Writer
    for (let i = 0; i < writerArr.length; i++) {
        if (i === 0)
            writersString = writerArr[i];
        else
            writersString += ', ' + writerArr[i];
    }

    const infoListWriter = document.createElement('li')
    infoListWriter.classList.add('c-info__list-item');

    if (writersString !== '')
        infoListWriter.innerHTML = '<span class="_list-span ">Writer:</span>' + writersString;
    else
        infoListWriter.innerHTML = '<span class="_list-span ">Writer:</span>' + noDataString;

    infoList.appendChild(infoListWriter)

    // Genre
    for (let i = 0; i < genresArr.length; i++) {
        if (i === 0)
            genreString = genresArr[i];
        else
            genreString += ', ' + genresArr[i];
    }

    const infoListGenre = document.createElement('li')
    infoListGenre.classList.add('c-info__list-item');

    if (genreString !== '')
        infoListGenre.innerHTML = '<span class="_list-span ">Genre:</span>' + genreString;
    else
        infoListGenre.innerHTML = '<span class="_list-span ">Genre:</span>' + noDataString;

    infoList.appendChild(infoListGenre)

    const infoListRelease = document.createElement('li')
    infoListRelease.classList.add('c-info__list-item');
    infoListRelease.innerHTML = '<span class="_list-span ">Release:</span>' + release;

    infoList.appendChild(infoListRelease)

    // Production
    for (let i = 0; i < countriesArr.length; i++) {
        if (i === 0)
            productionString = countriesArr[i];
        else
            productionString += ', ' + countriesArr[i];
    }

    const infoListProduction = document.createElement('li')
    infoListProduction.classList.add('c-info__list-item');

    if (productionString !== '')
        infoListProduction.innerHTML = '<span class="_list-span ">Production:</span>' + productionString;
    else
        infoListProduction.innerHTML = '<span class="_list-span ">Production:</span>' + noDataString;

    infoList.appendChild(infoListProduction)

    // Cast
    const infoCast = document.createElement('div');
    infoCast.classList.add('c-info__cast');

    infoDetails.appendChild(infoCast);

    const infoCastTitle = document.createElement('span');
    infoCastTitle.classList.add('c-info__cast-title', 't4');
    infoCastTitle.innerText = 'Cast:'

    infoCast.appendChild(infoCastTitle);

    const infoActors = document.createElement('div');
    infoActors.classList.add('c-info__actors');

    infoCast.appendChild(infoActors);

    if (castArr.length > 0) {
        castArr.forEach(actor => {
            const infoActor = document.createElement('div');
            infoActor.classList.add('c-info__actor')

            infoActors.appendChild(infoActor);

            const infoActorName = document.createElement('span');
            infoActorName.classList.add('c-info__actor-name');
            infoActorName.innerText = actor.name;

            const infoActorCharacter = document.createElement('span');
            infoActorCharacter.classList.add('c-info__actor-character');
            infoActorCharacter.innerText = actor.character;

            infoActor.appendChild(infoActorName);
            infoActor.appendChild(infoActorCharacter);

            const infoActorImg = document.createElement('img');
            infoActorImg.classList.add('c-info__actor-img')
            infoActorImg.alt = `photo of ${actor.name} who acted as ${actor.character}`

            if (actor.profile_path)
                infoActorImg.src = `https://image.tmdb.org/t/p/original${actor.profile_path}`;
            else
                infoActorImg.src = 'assets/img/fallback_w100.jpg';

            infoActor.appendChild(infoActorImg);
        });
    } else {
        const noCastAvailable = document.createElement('span');
        noCastAvailable.classList.add('c-info__actor--nocast');
        noCastAvailable.innerText = noDataString;

        infoActors.appendChild(noCastAvailable);
    }

    // Overview
    const infoOverview = document.createElement('div');
    infoOverview.classList.add('c-info__overview');

    infoDetails.appendChild(infoOverview);

    const infoOverviewTitle = document.createElement('span');
    infoOverviewTitle.classList.add('c-info__overview-title', 't4');
    infoOverviewTitle.innerText = 'Overview:';

    infoOverview.appendChild(infoOverviewTitle);

    const infoOverviewText = document.createElement('p');

    if (movie.overview == null || movie.overview == '') {
        infoOverviewText.innerText = noDataString;
        infoOverviewText.classList.add('c-info__overview-text--noinfo');
    } else {
        infoOverviewText.innerText = movie.overview;
        infoOverviewText.classList.add('c-info__overview-text');
    }

    infoOverview.appendChild(infoOverviewText);

    // Trailer
    const infoTrailer = document.createElement('div');
    infoTrailer.classList.add('c-info__trailer');

    infoDetails.appendChild(infoTrailer);

    const infoTrailerTitle = document.createElement('span');
    infoTrailerTitle.classList.add('c-info__trailer-title', 't4');
    infoTrailerTitle.innerText = 'Trailer:';

    infoTrailer.appendChild(infoTrailerTitle);

    const infoTrailerContainer = document.createElement('div');

    if (trailerId === '') {
        infoTrailerContainer.innerText = noDataString;
        infoTrailerContainer.classList.add('c-info__trailer-text');
    } else {
        infoTrailerContainer.innerHTML = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + trailerId + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
        infoTrailerContainer.classList.add('c-info__trailer-video');
    }

    infoTrailer.appendChild(infoTrailerContainer);
}

// Functions for click event of results list item
function removeDetailsItem(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
    node.remove();
}

function hideListItem(listItem) {
    listItem.classList.add('c-search__item--hover');
    listItem.firstChild.nextSibling.classList.remove('c-search__item-year--hover');
    listItem.lastElementChild.classList.remove('c-search__item-img--hidden');
    listItem.lastElementChild.classList.remove('__display-none');
    listItem.firstChild.classList.remove('__display-none');
    listItem.firstChild.nextSibling.classList.remove('__display-none');
    listItem.classList.remove('c-search__item--clicked');
}

function showListItem(listItem) {
    listItem.classList.remove('c-search__item--hover');
    listItem.firstChild.nextSibling.classList.add('c-search__item-year--hover');
    listItem.lastElementChild.classList.add('c-search__item-img--hidden');
    listItem.lastElementChild.classList.add('__display-none');
    listItem.firstChild.classList.add('__display-none');
    listItem.firstChild.nextSibling.classList.add('__display-none');
    listItem.classList.add('c-search__item--clicked');
}

// Click event for results list item
function resultsListItemClick(event) {

    const currentListItem = event.currentTarget;
    currId = currentListItem.getAttribute('id');

    if (prevListItem == currentListItem && entered) {
        removeDetailsItem(prevListItem.nextSibling);
        hideListItem(currentListItem);
        entered = false;
    } else {

        if (detailsNode != null) {
            detailsNode.remove();
            detailsNode = null;
        }

        if (prevListItem != null) {
            hideListItem(prevListItem);
            prevListItem = null;
        }

        detailsNode = document.createElement('li');
        detailsNode.classList.add('c-info', 't');
        detailsNode.id = currId;

        showListItem(currentListItem);
        insertAfterNode(currentListItem, detailsNode);
        showDetailsAsync(detailsNode);

        prevListItem = currentListItem;

        currentListItem.scrollIntoView();

        entered = true;
    }
}