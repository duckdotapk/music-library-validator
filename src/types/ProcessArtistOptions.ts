//
// Imports
//

import { ProcessMusicCollectionOptions } from "./ProcessMusicCollectionOptions.js";

//
// Types
//

export interface ProcessArtistOptions extends ProcessMusicCollectionOptions
{
	artistDirectory : string;

	artistDirectoryName : string;
}