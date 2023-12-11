//
// Imports
//

import { processMusicCollection } from "./functions/process-music-collection.js";

import { environmentVariables } from "./instances/environment-variables.js";
import fs from "node:fs";
import path from "node:path";
import { ProcessError } from "./types/ProcessError.js";

//
// Music Library Validator
//

const result = await processMusicCollection(
	{
		musicDirectory: environmentVariables.MUSIC_DIRECTORY,
	});

//
// Output Results
//

await fs.promises.mkdir(environmentVariables.RESULTS_OUTPUT_DIRECTORY,
	{
		recursive: true,
	});

await fs.promises.writeFile(path.join(environmentVariables.RESULTS_OUTPUT_DIRECTORY, "results.json"), JSON.stringify(result, null, "\t"));

//
// Output Errors
//

const errors : ProcessError[] = [];

for (const processArtistResult of result.processArtistResults)
{
	errors.push(...processArtistResult.errors);

	for (const processAlbumResult of processArtistResult.processAlbumResults)
	{
		errors.push(...processAlbumResult.errors);

		for (const processFileResult of processAlbumResult.processFileResults)
		{
			errors.push(...processFileResult.errors);
		}
	}
}

await fs.promises.writeFile(path.join(environmentVariables.RESULTS_OUTPUT_DIRECTORY, "errors.json"), JSON.stringify(errors, null, "\t"));