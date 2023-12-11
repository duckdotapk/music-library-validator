//
// Imports
//

import musicMetadata, { IAudioMetadata } from "music-metadata";

import { validSourceTagValues } from "../data/valid-source-tag-values.js";

import { findSourceTag } from "./find-source-tag.js";

import { ProcessFileOptions } from "../types/ProcessFileOptions.js";
import { ProcessFileResult } from "../types/ProcessFileResult.js";


//
// Function
//


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

	// TODO: should match the folder name
	//  Also, for non "Various Artists" albums, there should only be ONE album artist

	//
	// Check Album
	//

	// TODO: Ensure folder name is the same as the album name (filenamified for Windows)

	//
	// Check Artists
	//

	// TODO: Check for &, commas, x, etc.
	//  Require artists to be separated by ;

	// TODO: Check for similar artist names and suggest merging them

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

	// TODO: Assure date is only a year (cannot be fucking bothered getting full dates for every album, but year should be easy?)

	//
	// Check Disc Number / Track Number / Total Discs / Total Tracks
	//

	// TODO: Assure all are specified and none are 0

	//
	// Check File Name
	//

	// TODO: Must match format <DISC_NUMBER>.<TRACK_NUMBER> - <TRACK_NAME>.<FILE_EXTENSION>

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