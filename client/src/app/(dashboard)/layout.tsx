"use client";

import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/AppSidebar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import React, { useEffect, useState } from "react";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
	const router = useRouter();
	const pathname = usePathname();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (authUser) {
			const userRole = authUser.userRole?.toLowerCase();
			if (
				(userRole === "manager" && pathname.startsWith("/tenants")) ||
				(userRole === "tenant" && pathname.startsWith("/managers"))
			) {
				router.push(
					userRole === "manager"
						? "/managers/properties"
						: "/tenants/applications",
					{ scroll: false }
				);
			} else {
				setIsLoading(false);
			}
		} else if (!authLoading) {
			// If not loading and no auth user, wait a bit then check again
			setTimeout(() => {
				setIsLoading(false);
			}, 500);
		}
	}, [authUser, router, pathname, authLoading]);

	// Show loading while auth is loading or we're still checking
	if (authLoading || isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg">Loading dashboard...</div>
			</div>
		);
	}

	// If no user role after loading, redirect to signin
	if (!authUser?.userRole) {
		router.push("/signin");
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg">Redirecting to login...</div>
			</div>
		);
	}

	return (
		<SidebarProvider>
			<div className="min-h-screen w-full bg-primary-100">
				<Navbar />
				<div style={{ marginTop: `${NAVBAR_HEIGHT}px` }}>
					<main className="flex">
						<Sidebar userType={authUser.userRole.toLowerCase()} />
						<div className="flex-grow transition-all duration-300">
							{children}
						</div>
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
};

export default DashboardLayout;
