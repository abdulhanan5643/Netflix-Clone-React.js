import React, {useState, useEffect} from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({title, fetchUrl, isLargeRow}) {

    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl]=useState("");

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }

        fetchData();
    }, [fetchUrl]);

    const opts={
        height: "390",
        width:"100%",
        playerVars:{
            autoplay:1,
        },
    };

    const handleClick= (movie)=>{
        if (trailerUrl){
            setTrailerUrl('');
        }else {
            movieTrailer(movie?.name || "").then((url)=>{
                const urlPrams=new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlPrams.get('v'));
            })
        }
    }

    return (
        <div className="row">
            <h2>{title}</h2>

            <div className="row_posters">
                {movies.map(movie => (
                    <img className={`row_poster ${isLargeRow && "row_posterLarge"}`} onClick={()=>handleClick(movie)} key={movie.id} src={`${base_url}${isLargeRow ? movie.poster_path: movie.backdrop_path}`} alt={movie.name}/>
                ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts}/>}
        </div>
    )
}

export default Row;