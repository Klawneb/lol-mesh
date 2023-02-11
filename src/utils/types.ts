import type { Prisma } from "@prisma/client"

export type  ParticipantWithMatch = Prisma.ParticipantGetPayload<{
  include: { Match: true }
}>

export interface Summoner {
	name: string,
	matchHistory: ParticipantWithMatch[]
}