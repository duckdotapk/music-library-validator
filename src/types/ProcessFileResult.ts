//
// Imports
//

import { ProcessError } from "./ProcessError.js";

//
// Types
//

export interface ProcessFileResult
{
	errors : ProcessError[];

	filePath : string;
}