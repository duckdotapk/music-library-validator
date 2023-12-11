//
// Imports
//

import { ProcessArtistResult } from "./ProcessArtistResult.js";
import { ProcessError } from "./ProcessError.js";

//
// Types
//

export interface ProcessMusicCollectionResult
{
	errors : ProcessError[];

	musicDirectory : string;

	processArtistResults : ProcessArtistResult[];
}