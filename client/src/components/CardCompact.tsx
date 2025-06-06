import { Bath, Bed, Heart, House, Star } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const CardCompact = ({
	property,
	isFavorite,
	onFavoriteToggle,
	showFavoriteButton = true,
	propertyLink,
}: CardCompactProps) => {
	const [imgSrc, setImgSrc] = useState(
		property.photoUrls?.[0] || "/placeholder.jpg"
	);

	return (
		<div className="bg-white rounded-xl overflow-hidden shadow-lg w-full flex h-40 mb-5">
			<div className="relative w-1/3">
				<img
					src={imgSrc}
					alt={property.name}
					className="absolute inset-0 w-full h-full object-cover"
					onError={() => setImgSrc("/placeholder.jpg")}
				/>
				<div className="absolute bottom-2 left-2 flex gap-1 flex-col">
					{property.isPetsAllowed && (
						<span className="bg-white/80 text-black text-xs font-semibold px-2 py-1 rounded-full w-fit">
							Pets
						</span>
					)}
					{property.isParkingIncluded && (
						<span className="bg-white/80 text-black text-xs font-semibold px-2 py-1 rounded-full">
							Parking
						</span>
					)}
				</div>
			</div>
			<div className="p-4 flex flex-col justify-between flex-1">
				<div>
					<h2 className="font-bold mb-1 text-sm">
						{propertyLink ? (
							<Link
								href={propertyLink}
								className="hover:underline hover:text-blue-600"
								scroll={false}>
								{property.name}
							</Link>
						) : (
							property.name
						)}
					</h2>
					<p className="text-gray-600 text-xs mb-1 truncate">
						{property?.location?.address}, {property?.location?.city}
					</p>
					<div className="flex items-center mb-1">
						<Star className="w-3 h-3 text-yellow-400 mr-1" />
						<span className="font-semibold text-xs">
							{property.averageRating.toFixed(1)}
						</span>
						<span className="text-gray-600 text-xs ml-1">
							({property.numberOfReviews})
						</span>
					</div>
				</div>
				<div>
					<p className="text-md font-bold">
						${property.pricePerMonth.toFixed(0)}{" "}
						<span className="text-gray-600 text-xs font-normal"> /month</span>
					</p>
					<div className="flex items-center gap-2 text-gray-600 mt-1 text-xs">
						<span className="flex items-center">
							<Bed className="w-3 h-3 mr-1" />
							{property.beds}
						</span>
						<span className="flex items-center">
							<Bath className="w-3 h-3 mr-1" />
							{property.baths}
						</span>
						<span className="flex items-center">
							<House className="w-3 h-3 mr-1" />
							{property.squareFeet}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CardCompact;
