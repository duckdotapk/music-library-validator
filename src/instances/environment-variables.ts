//
// Imports
//

import "dotenv/config";

import z from "zod";

//
// Environment Variables
//

export const environmentVariables = z.object(
	{
		"MUSIC_DIRECTORY": z.string(),
	}).parse(process.env);