//
// Imports
//

import fs from "node:fs";

//
// Function
//

export async function anyFileExists(filePaths : string[]) : Promise<boolean>
{
	for (const filePath of filePaths)
	{
		try
		{
			await fs.promises.access(filePath);

			return true;
		}
		catch (error)
		{
			// Ignore
		}
	}

	return false;
}