//
// Imports
//

import fs from "node:fs";
import path from "node:path";

import { ProcessAlbumOptions } from "../types/ProcessAlbumOptions.js";
import { ProcessAlbumResult } from "../types/ProcessAlbumResult.js";
import { processFile } from "./process-file.js";

//
// Function
//

export async function processAlbum(options : ProcessAlbumOptions) : Promise<ProcessAlbumResult>
{
	//
	// Initialise Result
	//

	const result : ProcessAlbumResult =
		{
			albumDirectory: options.albumDirectory,
			errors: [],
			processFileResults: [],
		};

	//
	// Iterate Directory
	//

	const directoryEntries = await fs.promises.readdir(options.albumDirectory,
		{
			withFileTypes: true,
		});

	for (const directoryEntry of directoryEntries)
	{
		if (directoryEntry.isDirectory())
		{
			continue;
		}

		switch (directoryEntry.name.toLowerCase())
		{
			case "cover.jpg":
			case "cover.png":
			case "thumbs.db":
			{
				break;
			}

			default:
			{
				const processFileResult = await processFile(
					{
						...options,

						fileName: directoryEntry.name,
						filePath: path.join(options.albumDirectory, directoryEntry.name),
					});

				result.processFileResults.push(processFileResult);

				break;
			}
		}
	}

	return result;
}
