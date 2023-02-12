import type { Match, Prisma } from "@prisma/client"

export interface Summoner {
	name: string,
	matchHistory: Match[]
}