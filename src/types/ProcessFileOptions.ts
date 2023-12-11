//
// Imports
//

import { ProcessAlbumOptions } from "./ProcessAlbumOptions.js";

//
// Types
//

export interface ProcessFileOptions extends ProcessAlbumOptions
{
	fileName : string;

	filePath : string;
}