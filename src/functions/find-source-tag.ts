//
// Imports
//

import { INativeTags } from "music-metadata/lib/type.js";

//
// Function
//

export interface FindSourceTagResult
{
	type : string;

	source : string;
}

export function findSourceTag(nativeTags : INativeTags) : FindSourceTagResult | null
{
	for (const [ tagsType, tags ] of Object.entries(nativeTags))
	{
		switch (tagsType)
		{
			case "ID3v2.3":
			case "ID3v2.4":
			{
				for (const tag of tags)
				{
					if (tag.id == "TXXX:SOURCE")
					{
						return {
							type: tagsType,
							source: tag.value,
						};
					}
				}

				break;
			}

			case "iTunes":
			{
				for (const tag of tags)
				{
					if (tag.id == "----:com.apple.iTunes:SOURCE")
					{
						return {
							type: tagsType,
							source: tag.value,
						};
					}
				}

				break;
			}

			case "vorbis":
			{
				for (const tag of tags)
				{
					if (tag.id == "SOURCE")
					{
						return {
							type: tagsType,
							source: tag.value,
						};
					}
				}

				break;
			}

			default:
			{
				break;
			}
		}
	}

	return null;
}