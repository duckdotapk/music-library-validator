//
// Imports
//

import fs from "node:fs";
import path from "node:path";

import { processAlbum } from "./process-album.js";

import { ProcessArtistOptions } from "../types/ProcessArtistOptions.js";
import { ProcessArtistResult } from "../types/ProcessArtistResult.js";

//
// Function
//

export async function processArtist(options : ProcessArtistOptions) : Promise<ProcessArtistResult>
{
	//
	// Initialise Result
	//

	const result : ProcessArtistResult =
		{
			artistDirectory: options.artistDirectory,
			errors: [],
			processAlbumResults: [],
		};

	//
	// Iterate Directory
	//

	const directoryEntries = await fs.promises.readdir(options.artistDirectory,
		{
			withFileTypes: true,
		});

	for (const directoryEntry of directoryEntries)
	{
		if (!directoryEntry.isDirectory())
		{
			continue;
		}

		const processAlbumResult = await processAlbum(
			{
				...options,

				albumDirectoryName: directoryEntry.name,
				albumDirectory: path.join(options.artistDirectory, directoryEntry.name),
			});

		result.processAlbumResults.push(processAlbumResult);
	}

	//
	// Return Result
	//

	return result;
}
