//
// Imports
//

import { ProcessArtistOptions } from "./ProcessArtistOptions.js";

//
// Types
//

export interface ProcessAlbumOptions extends ProcessArtistOptions
{
	albumDirectory : string;

	albumDirectoryName : string;
}