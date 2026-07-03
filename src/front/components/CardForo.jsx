import { BodyTagSimply } from "../components/BodyTag.jsx";
import logo from "../assets/img/logomin.png";


export const CardForoSimply = ({ foro }) => {

    return (
        <div className="card shadow-sm h-100" style={{ maxWidth: "22rem", overflow: "hidden" }}>
            
            <div style={{ width: "100%", height: "200px", overflow: "hidden" }}>
                <img 
                    src={foro.img || logo} 
                    className="card-img-top w-100 h-100" 
                    style={{ objectFit: "cover", objectPosition: "center" }} // 💡 Recorta sin deformar
                    alt={foro.title} 
                />
            </div>

            <div className="card-body d-flex flex-column justify-content-between">
                <div>
                    <h2 className="card-title h4 fw-bold mb-2">{foro.title}</h2>
                    <p className="card-text text-muted small">{foro.description}</p>
                </div>
                
                <div className="mt-3">
                    <label className="form-label fw-bold small text-secondary m-0 mb-1">Tags</label>
                    <div className="d-flex flex-wrap gap-2 p-2 rounded bg-light border"
                         style={{ minHeight: "45px", maxHeight: "120px", overflowY: "auto" }}>
                        {foro.tags && foro.tags.length > 0 ? (
                            foro.tags.map((tag) => (
                                <BodyTagSimply key={tag.id} tag={tag} />
                            ))
                        ) : (
                            <span className="text-muted xtra-small">Sin etiquetas</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}