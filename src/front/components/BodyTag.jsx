


export const BodyTag = ({tag, onSelectedTag, isSelected}) =>{
    const onClick = (e)=> {
        e.preventDefault()
        onSelectedTag(tag)
    }
    return(
        <div className="d-flex align-items-center m-1 gap-2 p-2 border rounded bg-white shadow-sm">
            <button type="button" onClick={onClick} className={`btn btn-sm ${isSelected ? "btn-danger" : "btn-outline-danger"}`}>
                <i className={isSelected ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
            </button>
            <h6 className="mb-0 text-capitalize">{tag.title}</h6>
        </div>
    )
}