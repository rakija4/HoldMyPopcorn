// Fetching cast&crew data from API
const getCrewAsync = async function() {
    const castUrl = `https://api.themoviedb.org/3/movie/${currId}/credits?api_key=${apiKey}`;

    const castArr = [];
    const directorArr = [];
    const writerArr = [];

    try {
        const res = await fetch(castUrl);
        const json = await res.json();
        const cast = await json.cast;
        const crew = await json.crew;

        crew.forEach(member => {
            if (member.department === 'Directing')
                directorArr.push(member.name);
            if (member.department === 'Writing')
                writerArr.push(member.name);
        });

        for (let i = 0; i < 5; i++) {
            if (cast[i] != undefined)
                castArr.push(cast[i]);
        }

        return [directorArr, writerArr, castArr];
    } catch (err) {
        console.log(err);
    }

}

// Getting details from API (genres, production countries, ratings, status)
const getMovieDetailsAsync = async function() {
    const detailsUrl = `https://api.themoviedb.org/3/movie/${currId}?api_key=${apiKey}`;

    const genresArr = [];
    const countriesArr = [];

    try {
        const res = await fetch(detailsUrl);
        const json = await res.json();

        json.production_countries.forEach(country => {
            //For full names change 'iso_3166_1' to 'name'
            countriesArr.push(country.iso_3166_1);
        });

        json.genres.forEach(genre => {
            genresArr.push(genre.name);
        })

        const ratingAverage = json.vote_average;
        const votesCount = json.vote_count;
        const release = json.release_date;
        
        return [countriesArr, genresArr, ratingAverage, votesCount, release];
    } catch (err) {
        console.log(err);
    }
}

// Getting youtube link to the trailer
const getVideoAsync = async function() {
    const videoUrl = `http://api.themoviedb.org/3/movie/${currId}/videos?api_key=${apiKey}`;

    try {
        const res = await fetch(videoUrl);
        const json = await res.json();
        if (json.results[0] != undefined) {
            const trailerId = json.results[0].key;
            return [trailerId]
        }else{
            return ['']
        }
        
    } catch (err) {
        console.log(err);
    }

}

export {getCrewAsync, getMovieDetailsAsync, getVideoAsync};