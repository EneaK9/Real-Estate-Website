// Add a function to handle image URLs properly
const getValidImageUrl = (url: string, propertyName?: string) => {
	if (!url) {
		// Create a custom placeholder using the property name if available
		if (propertyName) {
			const encodedName = encodeURIComponent(propertyName);
			return `https://via.placeholder.com/640x480?text=${encodedName}`;
		}
		return "/placeholder.jpg";
	}

	// If it's an example.com URL (placeholder), return a customized placeholder
	if (url.includes("example.com")) {
		if (propertyName) {
			const encodedName = encodeURIComponent(propertyName);
			return `https://via.placeholder.com/640x480?text=${encodedName}`;
		}
		return "https://via.placeholder.com/640x480?text=Property+Image";
	}
	return url;
};
