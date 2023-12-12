//
// Function
//

export function isMultiArtistRemix(trackName : string | undefined) : boolean
{
	if (trackName == undefined)
	{
		return false;
	}

	switch (trackName)
	{
		// I couldn't find any info on "HBB" so I think this might just be
		// 	a remix by MYTH & ROID
		case "JINGO JUNGLE -HBB Remix-":
			return false;

		// This is a remix by Malcom Kirby Jr. himself
		case "Saints Row (The Remix)":
			return false;
	}

	return trackName.toLowerCase().includes("remix");
}