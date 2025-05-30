"use client";

import Navbar from "@/components/Navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
	const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
	const router = useRouter();
	const pathname = usePathname();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Only redirect from the homepage, not all public pages
		if (authUser?.userRole && pathname === "/") {
			const userRole = authUser.userRole.toLowerCase();
			if (userRole === "manager") {
				router.push("/managers/properties", { scroll: false });
				return;
			} else if (userRole === "tenant") {
				router.push("/tenants/applications", { scroll: false });
				return;
			}
		}

		// Stop loading
		if (!authLoading) {
			setIsLoading(false);
		}
	}, [authUser, router, pathname, authLoading]);

	if (authLoading || isLoading) return <>Loading...</>;

	return (
		<div className="h-full w-full">
			<Navbar />
			<main
				className={`h-full flex w-full flex-col`}
				style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
				{children}
			</main>
		</div>
	);
};

export default Layout;
