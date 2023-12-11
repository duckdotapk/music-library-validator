//
// Imports
//

import * as fs from "node:fs";
import * as path from "node:path";

import { environmentVariables } from "./instances/environment-variables.js";

//
// Music Library Validator
//

await processMusicCollection(
	{
		musicDirectoryPath: environmentVariables.MUSIC_DIRECTORY,
	});

//
// Functions
//

interface ProcessMusicCollectionOptions
{
	musicDirectoryPath : string;
}

async function processMusicCollection(options : ProcessMusicCollectionOptions)
{
	console.log("Processing music collection: " + options.musicDirectoryPath);

	const directoryEntries = await fs.promises.readdir(options.musicDirectoryPath,
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

		await processArtist(
			{
				...options,

				artistDirectoryName: directoryEntry.name,
				artistDirectoryPath: path.join(options.musicDirectoryPath, directoryEntry.name),
			});
	}
}

interface ProcessArtistOptions extends ProcessMusicCollectionOptions
{
	artistDirectoryName : string;

	artistDirectoryPath : string;
}

async function processArtist(options : ProcessArtistOptions)
{
	console.log("Processing artist: " + options.artistDirectoryName);

	const directoryEntries = await fs.promises.readdir(options.artistDirectoryPath,
		{
			withFileTypes: true,
		});

	for (const directoryEntry of directoryEntries)
	{
		if (!directoryEntry.isDirectory())
		{
			continue;
		}

		await processAlbum(
			{
				...options,

				albumDirectoryName: directoryEntry.name,
				albumDirectoryPath: path.join(options.artistDirectoryPath, directoryEntry.name),
			});
	}
}

interface ProcessAlbumOptions extends ProcessArtistOptions
{
	albumDirectoryName : string;

	albumDirectoryPath : string;
}

async function processAlbum(options : ProcessAlbumOptions)
{
	console.log("Processing album: " + options.albumDirectoryName);

	const directoryEntries = await fs.promises.readdir(options.albumDirectoryPath,
		{
			withFileTypes: true,
		});

	for (const directoryEntry of directoryEntries)
	{
		if (!directoryEntry.isFile())
		{
			continue;
		}

		switch (directoryEntry.name.toLowerCase())
		{
			case "cover.jpg":
			case "thumbs.db":
			{
				break;
			}

			default:
			{
				await processFile(
					{
						...options,

						trackFileName: directoryEntry.name,
						trackFilePath: path.join(options.albumDirectoryPath, directoryEntry.name),
					});

				break;
			}
		}
	}
}

interface ProcessFileOptions extends ProcessAlbumOptions
{
	trackFileName : string;

	trackFilePath : string;
}

async function processFile(options : ProcessFileOptions)
{
	console.log("Processing file: " + options.trackFilePath);

	// TODO: actual processing
}