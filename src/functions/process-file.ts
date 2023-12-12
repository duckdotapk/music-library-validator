//
// Imports
//

import path from "node:path";

import musicMetadata, { IAudioMetadata } from "music-metadata";

import { validSourceTagValues } from "../data/valid-source-tag-values.js";

import { findSourceTag } from "./find-source-tag.js";
import { getExpectedAlbumDirectoryName } from "./get-expected-album-directory-name.js";

import { ProcessFileOptions } from "../types/ProcessFileOptions.js";
import { ProcessFileResult } from "../types/ProcessFileResult.js";


//
// Function
//

const seenArtistNames = new Map<string, { name : string, filePath : string }>();

export async function processFile(options : ProcessFileOptions) : Promise<ProcessFileResult>
{
	//
	// Initialize Result
	//

	const processFileResult : ProcessFileResult =
		{
			filePath: options.filePath,

			errors: [],
		};

	//
	// Parse File Path
	//

	const parsedFilePath = path.parse(options.filePath);

	//
	// Parse Metadata
	//

	let parsedMetadata : IAudioMetadata;

	try
	{
		parsedMetadata = await musicMetadata.parseFile(options.filePath);
	}
	catch (error)
	{
		processFileResult.errors.push(
			{
				message: "Failed to parse metadata.",
				path: options.filePath,
			});

		return processFileResult;
	}

	//
	// Check Album Artist
	//

	if (parsedMetadata.common.albumartist == null)
	{
		processFileResult.errors.push(
			{
				message: "Track missing album artist.",
				path: options.filePath,
			});
	}
	else if (parsedMetadata.common.albumartist != options.artistDirectoryName)
	{
		processFileResult.errors.push(
			{
				message: "Album artist does not match artist directory name.",
				path: options.filePath,
			});
	}

	if (parsedMetadata.common.albumartist != null)
	{
		if (seenArtistNames.get(parsedMetadata.common.albumartist.toLowerCase()) == null)
		{
			seenArtistNames.set(parsedMetadata.common.albumartist.toLowerCase(),
				{
					name: parsedMetadata.common.albumartist,
					filePath: options.filePath,
				});
		}
		else
		{
			const existingArtistName = seenArtistNames.get(parsedMetadata.common.albumartist.toLowerCase());

			if (existingArtistName!.name != parsedMetadata.common.albumartist)
			{
				processFileResult.errors.push(
					{
						message: "Similar artists: \"" + parsedMetadata.common.albumartist + "\" and \"" + existingArtistName!.name + "\" (" + existingArtistName!.filePath + ")",
						path: options.filePath,
					});
			}
		}
	}

	//
	// Check Album
	//

	if (parsedMetadata.common.album == null)
	{
		processFileResult.errors.push(
			{
				message: "Track missing album.",
				path: options.filePath,
			});
	}
	else if (getExpectedAlbumDirectoryName(parsedMetadata.common.album) != options.albumDirectoryName)
	{
		processFileResult.errors.push(
			{
				message: "Album directory name does not match album name.",
				path: options.filePath,
			});
	}

	//
	// Check Artists
	//

	if (parsedMetadata.common.artists == null)
	{
		processFileResult.errors.push(
			{
				message: "Track missing artists.",
				path: options.filePath,
			});
	}
	else
	{
		for (const artist of parsedMetadata.common.artists)
		{
			if (seenArtistNames.get(artist.toLowerCase()) == null)
			{
				seenArtistNames.set(artist.toLowerCase(),
					{
						name: artist,
						filePath: options.filePath,
					});
			}
			else
			{
				const existingArtistName = seenArtistNames.get(artist.toLowerCase());

				if (existingArtistName!.name != artist)
				{
					processFileResult.errors.push(
						{
							message: "Similar album artists: \"" + artist + "\" and \"" + existingArtistName!.name + "\" (" + existingArtistName!.filePath + ")",
							path: options.filePath,
						});
				}
			}
		}
	}

	//
	// Check Composer
	//

	if (parsedMetadata.common.composer != null && parsedMetadata.common.composer.join("").length > 0)
	{
		processFileResult.errors.push(
			{
				message: "Track has composer.",
				path: options.filePath,
			});
	}

	//
	// Check Date
	//

	if (parsedMetadata.common.year == null)
	{
		processFileResult.errors.push(
			{
				message: "Track missing date.",
				path: options.filePath,
			});
	}

	//
	// Check Disc Number / Track Number / Total Discs / Total Tracks
	//

	if (parsedMetadata.common.disk.no == null)
	{
		processFileResult.errors.push(
			{
				message: "Track missing disc number.",
				path: options.filePath,
			});
	}
	else if (parsedMetadata.common.disk.no == 0)
	{
		processFileResult.errors.push(
			{
				message: "Track has disc number of 0.",
				path: options.filePath,
			});
	}

	if (parsedMetadata.common.track.no == null)
	{
		processFileResult.errors.push(
			{
				message: "Track missing track number.",
				path: options.filePath,
			});
	}
	else if (parsedMetadata.common.track.no == 0)
	{
		processFileResult.errors.push(
			{
				message: "Track has track number of 0.",
				path: options.filePath,
			});
	}

	if (parsedMetadata.common.disk.of == null)
	{
		processFileResult.errors.push(
			{
				message: "Track missing total discs.",
				path: options.filePath,
			});
	}
	else if (parsedMetadata.common.disk.of == 0)
	{
		processFileResult.errors.push(
			{
				message: "Track has total discs of 0.",
				path: options.filePath,
			});
	}

	if (parsedMetadata.common.track.of == null)
	{
		processFileResult.errors.push(
			{
				message: "Track missing total tracks.",
				path: options.filePath,
			});
	}
	else if (parsedMetadata.common.track.of == 0)
	{
		processFileResult.errors.push(
			{
				message: "Track has total tracks of 0.",
				path: options.filePath,
			});
	}

	//
	// Check File Name
	//

	// Note: The following replacements remove various characters that aren't valid in Windows file paths
	//	The exact replacements follow whatever foobar2000 decided should replace these characters in file names
	const expectedFileName = (parsedMetadata.common.disk.no + "." + parsedMetadata.common.track.no?.toString().padStart(2, "0") + " - " + parsedMetadata.common.title + parsedFilePath.ext)
		.replaceAll("*", "x")
		.replaceAll(":", "-")
		.replaceAll(":", "-")
		.replaceAll("/", "-")
		.replaceAll("?", "")
		.replaceAll("\"", "''");

	if (options.fileName != expectedFileName)
	{
		processFileResult.errors.push(
			{
				message: "Unexpected file name. Expected: " + expectedFileName,
				path: options.filePath,
			});
	}

	//
	// Check Genre
	//

	if (parsedMetadata.common.genre != null && parsedMetadata.common.genre.join("").length > 0)
	{
		processFileResult.errors.push(
			{
				message: "Track has genre.",
				path: options.filePath,
			});
	}

	//
	// Check Performer
	//

	if (parsedMetadata.common["performer:instrument"] != null)
	{
		processFileResult.errors.push(
			{
				message: "Track has performer:instrument.",
				path: options.filePath,
			});
	}

	//
	// Check Title
	//

	if (parsedMetadata.common.title == null)
	{
		processFileResult.errors.push(
			{
				message: "Track missing title.",
				path: options.filePath,
			});
	}
	else if (parsedMetadata.common.title.includes("feat.") || parsedMetadata.common.title.includes("ft.") || parsedMetadata.common.title.includes("featuring") || parsedMetadata.common.title.includes("(with"))
	{
		processFileResult.errors.push(
			{
				message: "Track title contains featured artists.",
				path: options.filePath,
			});
	}

	//
	// Check Source
	//

	const findSourceTagResult = findSourceTag(parsedMetadata.native);

	if (findSourceTagResult == null)
	{
		processFileResult.errors.push(
			{
				message: "Track missing source tag.",
				path: options.filePath,
			});
	}
	else if (!validSourceTagValues.includes(findSourceTagResult.source))
	{
		processFileResult.errors.push(
			{
				message: "Invalid source tag: \"" + findSourceTagResult.source + "\"",
				path: options.filePath,
			});
	}

	//
	// Return Result
	//

	return processFileResult;
}