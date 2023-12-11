//
// Imports
//

import { ProcessError } from "./ProcessError.js";
import { ProcessFileResult } from "./ProcessFileResult.js";

//
// Types
//

export interface ProcessAlbumResult
{
	albumDirectory : string;

	errors : ProcessError[];

	processFileResults : ProcessFileResult[];
}