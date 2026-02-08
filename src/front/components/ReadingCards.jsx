import { Link } from "react-router-dom";
export const ReadingCards = ({reading}) => {
   return (
		<div className="card border shadow-sm" style={{ minWidth: "320px", minHeight: "300px" }}>
			
			<div className="card-body d-flex flex-column">
				<h5 className="card-title border-bottom pb-2 mb-2 text-center">
					{reading.title}
				</h5>

				<p
					className="card-text"
				>
					{reading.description}
				</p>
			</div>

			<div className="card-footer bg-white d-flex">
				<Link to={`/reading/${reading.id}`} className="w-100">
					<button className="btn btn-primary w-100">
						Ver lectura
					</button>
				</Link>
			</div>
		</div>
	);
};