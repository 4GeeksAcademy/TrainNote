

export const Postcard = ({post}) => {
    return(
        <div className="card mb-3">
            <div className="card-body">
                
                <p>{post.content}</p>
                <h5>{post.title}</h5>

                {post.img &&(
                    <img src={post.img}
                    alt="post"
                    className="img-fluid rounded" />
                )}
                <div className="mt-3">

                    <small className="text-muted">
                        {new Date(
                            post.created_at
                        ).toLocaleString()}
                    </small>

                </div>
                    
                    

            </div>

        </div>
    )
}