//
// Imports
//

import { ProcessAlbumResult } from "./ProcessAlbumResult.js";
import { ProcessError } from "./ProcessError.js";

//
// Types
//

export interface ProcessArtistResult
{
	artistDirectory : string;

	errors : ProcessError[];

	processAlbumResults : ProcessAlbumResult[];
}