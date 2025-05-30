import { Mail, MapPin, PhoneCall } from "lucide-react";
import React, { useState } from "react";

const ApplicationCard = ({
	application,
	userType,
	children,
}: ApplicationCardProps) => {
	const [imgSrc, setImgSrc] = useState(
		application.property.photoUrls?.[0] || "/placeholder.jpg"
	);

	const statusColor =
		application.status === "Approved"
			? "bg-green-500"
			: application.status === "Denied"
			? "bg-red-500"
			: "bg-yellow-500";

	const contactPerson =
		userType === "manager" ? application.tenant : application.manager;

	return (
		<div className="border rounded-xl overflow-hidden shadow-sm bg-white mb-4">
			<div className="flex flex-col lg:flex-row  items-start lg:items-center justify-between px-6 md:px-4 py-6 gap-6 lg:gap-4">
				{/* Property Info Section */}
				<div className="flex flex-col lg:flex-row gap-5 w-full lg:w-auto">
					<div className="relative w-full lg:w-[200px] h-[150px]">
						<img
							src={imgSrc}
							alt={application.property.name}
							className="rounded-xl object-cover w-full h-full"
							onError={() => setImgSrc("/placeholder.jpg")}
						/>
					</div>
					<div className="flex flex-col justify-between">
						<div>
							<h2 className="text-xl font-bold my-2">
								{application.property.name}
							</h2>
							<div className="flex items-center mb-2">
								<MapPin className="w-5 h-5 mr-1" />
								<span>{`${application.property.location.city}, ${application.property.location.country}`}</span>
							</div>
						</div>
						<div className="text-xl font-semibold">
							${application.property.pricePerMonth}{" "}
							<span className="text-sm font-normal">/ month</span>
						</div>
					</div>
				</div>

				{/* Divider - visible only on desktop */}
				<div className="hidden lg:block border-[0.5px] border-primary-200 h-48" />

				{/* Status Section */}
				<div className="flex flex-col items-start lg:items-end gap-5">
					<div className="flex gap-3 items-center">
						<span
							className={`${statusColor} text-white px-4 py-1 rounded-full text-sm font-medium`}>
							{application.status}
						</span>
						<div className="text-gray-400 font-normal">
							{new Date(application.applicationDate).toLocaleDateString()}
						</div>
					</div>

					{/* Contact Information */}
					<div className="w-full lg:text-right">
						<h3 className="font-bold">
							{userType === "manager" ? "Tenant Contact" : "Manager Contact"}
						</h3>
						<div className="mt-2">
							<div className="flex items-center gap-2 mb-1">
								<Mail className="w-4 h-4" />
								<span>{contactPerson.email}</span>
							</div>
							<div className="flex items-center gap-2">
								<PhoneCall className="w-4 h-4" />
								<span>{contactPerson.phoneNumber}</span>
							</div>
						</div>
					</div>

					{/* Buttons Section - Rendered from parent */}
					<div className="w-full lg:text-right">{children}</div>
				</div>
			</div>
		</div>
	);
};

export default ApplicationCard;
