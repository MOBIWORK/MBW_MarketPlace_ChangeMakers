import { createRouter, createWebHistory } from "@ionic/vue-router"
import { RouteRecordRaw } from "vue-router"
import Home from "../views/Home.vue"
import accountRoutes from "./account"
import rescueRoutes from "./rescue"
import beneficiaryRoutes from "./beneficiary"
import entitlementRoutes from "./entitlement"
import awarenessCampRoutes from "./awarenessCamp"
import { userResource } from "@/data/user"
import { session } from "@/data/session"

const routes: Array<RouteRecordRaw> = [
	{
		name: "Home",
		path: "/",
		redirect: "/tabs/dashboard",
	},
	{
		path: "/tabs/",
		component: Home,
		children: [
			{
				path: "",
				redirect: "/tabs/dashboard",
			},
			{
				path: "dashboard",
				component: () => import("@/views/Dashboard.vue"),
			},
			{
				name: "MyAccountPage",
				path: "Account",
				component: () => import("@/views/Account.vue"),
			},
		],
	},
	...accountRoutes,
	...rescueRoutes,
	...beneficiaryRoutes,
	...entitlementRoutes,
	...awarenessCampRoutes,
]

const router = createRouter({
	history: createWebHistory("/c/"),
	routes,
})


router.beforeEach(async (to, from, next) => {
	let isLoggedIn = session.isLoggedIn
	try {
		await userResource.promise
	} catch (error) {
		isLoggedIn = false
	}

	if (to.name === "Login" && isLoggedIn) {
		next({ name: "Home" })
	} else if (to.name !== "Login" && !isLoggedIn) {
		next({ name: "Login" })
	} else {
		next()
	}
})

export default router
