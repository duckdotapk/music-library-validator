//
// Imports
//

import fs from "node:fs";
import path from "node:path";

import { processArtist } from "./process-artist.js";

import { ProcessMusicCollectionOptions } from "../types/ProcessMusicCollectionOptions.js";
import { ProcessMusicCollectionResult } from "../types/ProcessMusicCollectionResult.js";

//
// Function
//

export async function processMusicCollection(options : ProcessMusicCollectionOptions) : Promise<ProcessMusicCollectionResult>
{
	//
	// Initialize Results
	//

	const result : ProcessMusicCollectionResult =
		{
			errors: [],
			musicDirectory: options.musicDirectory,
			processArtistResults: [],
		};

	//
	// Iterate Artist Directories
	//

	const directoryEntries = await fs.promises.readdir(options.musicDirectory,
		{
			withFileTypes: true,
		});

	for (const directoryEntry of directoryEntries)
	{
		if (!directoryEntry.isDirectory())
		{
			continue;
		}

		// Ignore SyncThing Folder
		if (directoryEntry.name == ".stfolder")
		{
			continue;
		}

		const processArtistResult = await processArtist(
			{
				...options,

				artistDirectoryName: directoryEntry.name,
				artistDirectory: path.join(options.musicDirectory, directoryEntry.name),
			});

		result.processArtistResults.push(processArtistResult);
	}

	//
	// Return Result
	//

	return result;
}