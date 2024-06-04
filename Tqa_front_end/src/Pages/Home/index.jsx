import React from "react";
import { MdOutlineMenu } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import "./style.css";
import data from "../../Data/testData.json";

export default function Homepage() {
  console.log(data);
  const [showDetail, setShowDetail] = React.useState(false);
  const [selectedMovie, setSelectedMovie] = React.useState(null);
  function renderMovies() {
    return data.slice(0, 4).map((movie) => (
      <div
        className="MovieCard"
        onClick={() => {
          setShowDetail(true);
          setSelectedMovie(movie);
        }}>
        <img
          src={movie.image}
          alt="movie"
        />
        <div className="MovieInfo">
          <p>{movie.name}</p>
          <span>{movie.year}</span>
        </div>
      </div>
    ));
  }
  function renderMoviesDetail(selectedMovie) {
    return (
      <div className="overLay">
        <div className="MovieDetail">
          <IoCloseSharp
            style={{
              fontSize: "1.5rem",
              position: "absolute",
              right: "10px",
              top: "10px",
              cursor: "pointer",
            }}
            onClick={() => setShowDetail(false)}
          />
          <div className="selectedMovieDetail">
            <img
              src={selectedMovie.image}
              alt="movie"
              style={{
                width: "300px",
                height: "400px",
                objectFit: "cover",
                borderRadius: "10px",
                // position: "absolute",
                transform: "translate(-50px, -50px)",
              }}
            />
            <div className="selectedMovieInfo">
              <h2>{selectedMovie.name}</h2>
              <span>{selectedMovie.time} min {selectedMovie.year}</span>
              <p>{selectedMovie.introduce}</p>
              <button>Play Movie</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="BackGround">
      {showDetail && renderMoviesDetail(selectedMovie)}
      <div className="Container">
        <div className="NavBar">
          <MdOutlineMenu style={{ fontSize: "1.5rem" }} />
          <h3>Movies</h3>
          <FaMagnifyingGlass />
        </div>
        <span>Most Popular Movies</span>
        <div className="Movies">{renderMovies()}</div>
      </div>
    </div>
  );
}
