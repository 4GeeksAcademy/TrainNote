import { useFeed } from "../hooks/useFeed";
import "../../css/feed.css";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { followForo } from "../../services/followService";

export const Feed = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    const handleFollow = async (foroId) => {
        try {
            const data = await followForo(foroId);
            console.log(data);

            await loadFollowForos();


        } catch (error) {
            console.log(error);

        }
    }

    const {
        loading,
        search,
        setSearch,
        myForos,
        followForos,
        userTags,
        filteredForos,
        loadFollowForos,
        allTags,
        activeTag,
        setActiveTag
    } = useFeed();

    if (loading) {
        return (
            <div className="text-center mt-5 text-seccess">
                <h3>Cargando...</h3>
            </div>
        );
    }

    return (
        <div className="feed-page">

            <aside className="feed-sidebar">

                <Link
                    to={`/profile/${user?.id}`}
                    className="profile-card text-decoration-none"
                >

                    <img
                        src={user?.img}
                        alt={user?.first_name}
                        className="profile-avatar"
                    />

                    <h5 className="mt-3 text-danger">
                        {user?.first_name} {user?.last_name}
                    </h5>

                </Link>


                <div className="sidebar-card">

                    <h5>Mis Foros</h5>

                    {
                        myForos.length > 0 ? (

                            <ul className="forum-list">

                                {
                                    myForos.map((foro) => (

                                        <li
                                            key={foro.id}
                                            className="forum-item"
                                        >

                                            <img
                                                src={foro.img}
                                                alt={foro.title}
                                                className="forum-image"
                                            />

                                            <span>
                                                {foro.title}
                                            </span>

                                        </li>

                                    ))
                                }

                            </ul>

                        ) : (

                            <p>No tienes foros creados.</p>

                        )
                    }

                </div>

                <div className="sidebar-card">

                    <h5>Foros Seguidos</h5>

                    {
                        followForos.length > 0 ? (

                            <ul className="forum-list">

                                {followForos.map((foro) => (

                                    <li
                                        key={foro.id}
                                        className="forum-item"
                                    >

                                        <img
                                            src={foro.img}
                                            alt={foro.title}
                                            className="forum-image"
                                        />

                                        <span>
                                            {foro.title}
                                        </span>

                                    </li>

                                ))}

                            </ul>

                        ) : (

                            <p className="text-muted">
                                No sigues ningún foro actualmente.
                            </p>

                        )
                    }

                </div>

                <div className="sidebar-card">

                    <h5>Mis Tags</h5>

                    {
                        userTags.length > 0 ? (

                            <div className="feed-tags">

                                {
                                    userTags.map((tagSelect) => (

                                        <span
                                            key={tagSelect.id}
                                            className="feed-tag"
                                        >
                                            {tagSelect.tag.title}
                                        </span>

                                    ))
                                }

                            </div>

                        ) : (

                            <p className="text-muted">
                                No has seleccionado tags todavía.
                            </p>

                        )
                    }

                </div>

            </aside>




            <main className="feed-main">

                <div
                    id="foroCarousel"
                    className="carousel slide mb-4"
                >
                    <div className="carousel-inner">

                        {filteredForos.slice(0, 3).map((foro, index) => (

                            <div
                                key={foro.id}
                                className={`carousel-item ${index === 0 ? "active" : ""}`}
                            >

                                <img
                                    src={foro.img}
                                    alt={foro.title}
                                    className="carousel-foro-image"
                                />

                                <div className="carousel-caption">
                                    <h3>{foro.title}</h3>
                                    <p>{foro.description}</p>
                                </div>

                            </div>

                        ))}

                    </div>

                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#foroCarousel"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon"></span>
                    </button>

                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#foroCarousel"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon"></span>
                    </button>

                </div>


                {
                    filteredForos.length > 0 ? (

                        filteredForos.map((foro) => (

                            <div
                                key={foro.id}
                                className="feed-foro-card mb-3"
                            >

                                <img
                                    src={foro.img}
                                    alt={foro.title}
                                    className="foro-card-image"
                                />

                                <h3>{foro.title}</h3>

                                <p>{foro.description}</p>

                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleFollow(foro.id)}
                                >
                                    Seguir
                                </button>

                            </div>

                        ))

                    ) : (

                        <div className="empty-search-card">

                            <h3>
                                🔍 No encontramos resultados
                            </h3>

                            <p>
                                No existe ningún foro que coincida con tu búsqueda.
                            </p>

                        </div>

                    )
                }

            </main>


        </div>
    );
};